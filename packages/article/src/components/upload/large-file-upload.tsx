import type { FC } from 'react';
import { useMemo, useRef, useState } from 'react';
import InboxOutlined from '@ant-design/icons/es/icons/InboxOutlined';
import PauseCircleOutlined from '@ant-design/icons/es/icons/PauseCircleOutlined';
import PlayCircleOutlined from '@ant-design/icons/es/icons/PlayCircleOutlined';
import ReloadOutlined from '@ant-design/icons/es/icons/ReloadOutlined';
import { Button, Progress, Space, Typography, Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import {
  mergeLargeFileApi,
  uploadLargeFileChunkApi,
  verifyLargeFileApi
} from '@article/api/article-api';

const { Dragger } = Upload;
const { Text } = Typography;

const DEFAULT_CHUNK_SIZE = 2 * 1024 * 1024;
const DEFAULT_CONCURRENCY = 3;

type UploadStage = 'idle' | 'hashing' | 'verifying' | 'uploading' | 'paused' | 'merging' | 'done' | 'error';

type LargeFileUploadProps = {
  chunkSize?: number;
  concurrency?: number;
  onUploaded?: (fileUrl: string, hash: string) => void;
};

type Checkpoint = {
  filename: string;
  size: number;
  chunkSize: number;
  uploadedChunks: number[];
};

type ChunkTask = {
  index: number;
  blob: Blob;
};

const checkpointKey = (hash: string) => `large-file-upload:${hash}`;

const formatPercent = (value: number) => Number(value.toFixed(1));

const createChunks = (file: File, chunkSize: number) => {
  const chunks: ChunkTask[] = [];
  let index = 0;
  for (let start = 0; start < file.size; start += chunkSize) {
    chunks.push({
      index,
      blob: file.slice(start, Math.min(file.size, start + chunkSize))
    });
    index += 1;
  }
  return chunks;
};

const calculateHash = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const readCheckpoint = (hash: string) => {
  const raw = localStorage.getItem(checkpointKey(hash));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Checkpoint;
  } catch {
    localStorage.removeItem(checkpointKey(hash));
    return null;
  }
};

const writeCheckpoint = (hash: string, checkpoint: Checkpoint) => {
  localStorage.setItem(checkpointKey(hash), JSON.stringify(checkpoint));
};

const removeCheckpoint = (hash: string) => {
  localStorage.removeItem(checkpointKey(hash));
};

const LargeFileUpload: FC<LargeFileUploadProps> = ({
  chunkSize = DEFAULT_CHUNK_SIZE,
  concurrency = DEFAULT_CONCURRENCY,
  onUploaded
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState('');
  const [stage, setStage] = useState<UploadStage>('idle');
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const pausedRef = useRef(false);

  const statusText = useMemo(() => {
    const statusMap: Record<UploadStage, string> = {
      idle: '等待选择文件',
      hashing: '正在计算 Hash',
      verifying: '正在校验文件',
      uploading: '正在分片上传',
      paused: '已暂停，可继续上传',
      merging: '正在合并文件',
      done: '上传完成',
      error: '上传失败'
    };
    return statusMap[stage];
  }, [stage]);

  const updateCheckpoint = (fileHash: string, currentFile: File, uploadedChunks: Set<number>) => {
    writeCheckpoint(fileHash, {
      filename: currentFile.name,
      size: currentFile.size,
      chunkSize,
      uploadedChunks: Array.from(uploadedChunks)
    });
  };

  const uploadChunks = async (currentFile: File, fileHash: string, initialUploadedChunks: number[]) => {
    const chunks = createChunks(currentFile, chunkSize);
    const uploadedChunks = new Set(initialUploadedChunks);
    const pendingChunks = chunks.filter((chunk) => !uploadedChunks.has(chunk.index));
    let cursor = 0;

    abortRef.current = new AbortController();
    pausedRef.current = false;
    setStage('uploading');
    setProgress(formatPercent((uploadedChunks.size / chunks.length) * 100));

    const worker = async () => {
      while (cursor < pendingChunks.length && !pausedRef.current) {
        const chunk = pendingChunks[cursor];
        cursor += 1;

        const formData = new FormData();
        formData.append('file', chunk.blob);
        formData.append('hash', fileHash);
        formData.append('filename', currentFile.name);
        formData.append('chunkIndex', String(chunk.index));
        formData.append('chunkSize', String(chunkSize));
        formData.append('totalChunks', String(chunks.length));

        await uploadLargeFileChunkApi(formData, abortRef.current?.signal);
        uploadedChunks.add(chunk.index);
        updateCheckpoint(fileHash, currentFile, uploadedChunks);
        setProgress(formatPercent((uploadedChunks.size / chunks.length) * 100));
      }
    };

    await Promise.all(
      Array.from({ length: Math.min(concurrency, pendingChunks.length) }, () => worker())
    );

    if (pausedRef.current) {
      setStage('paused');
      return null;
    }

    setStage('merging');
    const mergeRes = await mergeLargeFileApi({
      hash: fileHash,
      filename: currentFile.name,
      size: currentFile.size,
      chunkSize,
      totalChunks: chunks.length
    });

    const fileUrl = mergeRes.data?.url ?? '';
    removeCheckpoint(fileHash);
    setUploadedUrl(fileUrl);
    setProgress(100);
    setStage('done');
    onUploaded?.(fileUrl, fileHash);
    message.success('大文件上传完成');
    return fileUrl;
  };

  const startUpload = async (currentFile = file) => {
    if (!currentFile) {
      message.warning('请先选择文件');
      return;
    }

    try {
      setUploadedUrl('');
      setStage('hashing');
      setProgress(0);

      const fileHash = hash || await calculateHash(currentFile);
      setHash(fileHash);
      setStage('verifying');

      const chunks = createChunks(currentFile, chunkSize);
      const verifyRes = await verifyLargeFileApi({
        hash: fileHash,
        filename: currentFile.name,
        size: currentFile.size,
        chunkSize,
        totalChunks: chunks.length
      });

      if (verifyRes.data?.uploaded) {
        const fileUrl = verifyRes.data.url ?? '';
        removeCheckpoint(fileHash);
        setUploadedUrl(fileUrl);
        setProgress(100);
        setStage('done');
        onUploaded?.(fileUrl, fileHash);
        message.success('命中秒传，文件已上传');
        return;
      }

      const remoteChunks = verifyRes.data?.uploadedChunks ?? [];
      const localChunks = readCheckpoint(fileHash)?.uploadedChunks ?? [];
      const uploadedChunks = Array.from(new Set([...remoteChunks, ...localChunks]));
      await uploadChunks(currentFile, fileHash, uploadedChunks);
    } catch (error) {
      if (pausedRef.current) return;
      setStage('error');
      message.error('上传失败，稍后可继续断点续传');
    }
  };

  const pauseUpload = () => {
    pausedRef.current = true;
    abortRef.current?.abort();
    setStage('paused');
  };

  const resetUpload = () => {
    if (hash) removeCheckpoint(hash);
    abortRef.current?.abort();
    pausedRef.current = false;
    setFile(null);
    setHash('');
    setProgress(0);
    setUploadedUrl('');
    setStage('idle');
  };

  const uploadProps: UploadProps = {
    maxCount: 1,
    showUploadList: false,
    beforeUpload: (selectedFile) => {
      const nextFile = selectedFile as File;
      setFile(nextFile);
      setHash('');
      setUploadedUrl('');
      setProgress(0);
      setStage('idle');
      void startUpload(nextFile);
      return false;
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={12}>
      <Dragger {...uploadProps} disabled={stage === 'hashing' || stage === 'uploading' || stage === 'merging'}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">拖拽或点击选择大文件</p>
        <p className="ant-upload-hint">支持 Hash 秒传、分片上传、暂停后断点续传</p>
      </Dragger>

      {file && (
        <Space direction="vertical" style={{ width: '100%' }} size={8}>
          <Text strong>{file.name}</Text>
          <Text type="secondary">
            {statusText}
            {hash ? ` · ${hash.slice(0, 12)}` : ''}
          </Text>
          <Progress percent={progress} status={stage === 'error' ? 'exception' : undefined} />
          <Space wrap>
            {stage === 'uploading' && (
              <Button icon={<PauseCircleOutlined />} onClick={pauseUpload}>
                暂停
              </Button>
            )}
            {(stage === 'paused' || stage === 'error') && (
              <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => void startUpload()}>
                继续上传
              </Button>
            )}
            <Button icon={<ReloadOutlined />} onClick={resetUpload}>
              重置
            </Button>
          </Space>
          {uploadedUrl && <Text type="success">文件地址：{uploadedUrl}</Text>}
        </Space>
      )}
    </Space>
  );
};

export default LargeFileUpload;
