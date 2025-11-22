import type { FC } from 'react';
import { Button, Modal, Spin } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { getArticleApi } from '@/api/article-api';

interface Props {
  id: number;
}

const BtnPreviewArticle: FC<Props> = ({ id }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any>(null);

  const showPreview = async () => {
    setOpen(true);
    setLoading(true);

    try {
      const res = await getArticleApi(String(id));
      setDetail(res.data);  // 后端返回格式见你的 BaseResponse
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
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin />
          </div>
        ) : (
          detail && (
            <div>
              <h2>{detail.title}</h2>
              <p>分类：{detail.cate_name}</p>
              <p>发布时间：{detail.pub_date}</p>

              <div
                style={{ marginTop: 20 }}
                dangerouslySetInnerHTML={{ __html: detail.content }}
              />
            </div>
          )
        )}
      </Modal>
    </>
  );
};

export default BtnPreviewArticle;
