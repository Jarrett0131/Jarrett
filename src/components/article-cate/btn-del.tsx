import type { FC } from 'react';
import type { PopconfirmProps } from 'antd';
import { Button, message,Popconfirm} from 'antd';
import { useState ,useEffect} from 'react';
import { useSubmit ,useActionData} from 'react-router-dom';
import { useNavSubmitting ,useNavLoading } from '@/utils/hooks.ts';

const ButtonDelete: FC<{ id: number }> = ({ id }) => {

const [open, setOpen] = useState(false);
const submit = useSubmit();
const submitting = useNavSubmitting('DELETE');
const loading = useNavLoading('DELETE');
const actionData = useActionData() as boolean ;


  const handleDelete = () => {
    if (id === 1 || id === 2) {
      return message.error('管理员不允许删除此分类！');
    }

    setOpen(true) ;
  }

  const confirm = () => {
    console.log('确认删除！', id);
    submit({ id }, { method: 'DELETE' }) ;
    }

    const cancel = () => {
        console.log('取消了删除');
        setOpen(false);
    }

    const handleOpenChange: PopconfirmProps['onOpenChange'] = (isOpen, e) => {
        const btnType = e?.currentTarget.dataset.type 


        if (!isOpen && btnType !== 'btn-ok') { 
            // 手动关闭旧的气泡确认框
            setOpen(false)
        }
    }

    useEffect(() => {
        if (loading && actionData) {
            setOpen(false);
        }
        }, [loading, actionData])

  return (
    <>
    <Popconfirm
        open={open} // 控制气泡确认框的显示和隐藏
        title="操作提示"
        description="您确定删除此文章分类吗？"
        onConfirm={confirm} // 确认按钮的点击事件处理函数
        onCancel={cancel} // 取消按钮的点击事件处理函数
        okText="确定"
        cancelText="取消"
        onOpenChange={handleOpenChange} 
        okButtonProps={{
            'data-type': 'btn-ok',
            loading: submitting && { delay: 200 } 
        }} // 确认按钮的自定义属性
        >
        <Button type="link" size="small" onClick={handleDelete}>
            删除
        </Button>
    </Popconfirm>
    </>
  )
}

export default ButtonDelete;