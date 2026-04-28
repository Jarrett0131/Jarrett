import type { FC } from 'react';
import { Button, Modal, Spin } from 'antd';
import EyeOutlined from '@ant-design/icons/es/icons/EyeOutlined';
import { useState } from 'react';
import { getArticleApi } from '@article/api/article-api';
import '@article/components/article-list/css/article-preview.css';

interface Props {
  id: number;
}

type ArticlePreview = Article & {
  content: string;
};

const BtnPreviewArticle: FC<Props> = ({ id }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<ArticlePreview | null>(null);

  const showPreview = async () => {
    setOpen(true);
    setLoading(true);

    try {
      const res = await getArticleApi(String(id));
      setDetail((res.data ?? null) as ArticlePreview | null);  // 后端返回格式见你的 BaseResponse
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="link" onClick={showPreview}>
        <EyeOutlined /> 预览
      </Button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        width={800}
        footer={null}
        title="文章预览"
      >
        {loading ? (
            <Spin />
        ) : detail && (
            <div className="reader-container">
            <h1>{detail.title}</h1>
            <p style={{ color: '#888', marginBottom: 20 }}>
                分类：{detail.cate_name} | 发布时间：{detail.pub_date}
            </p>

            <div
                dangerouslySetInnerHTML={{ __html: detail.content ?? '' }}
            />
            </div>
        )}
      </Modal>
    </>
  );
};

export default BtnPreviewArticle;
