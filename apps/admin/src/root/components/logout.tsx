import type { FC } from 'react';   
import { Button,Popconfirm} from 'antd'; 
import {resetAllStore} from '@shared/store/resetters.ts';
import {useNavigate} from 'react-router-dom';

const Logout: FC = () => {
    const navigate = useNavigate();
    const confirm = () => {
        //清空store中的数据，跳转到登陆页面
        resetAllStore();
        navigate('/login');
    };

    return <Popconfirm
    title="退出登录"
    description="您确定退出登录吗？"
    onConfirm={confirm}
    okText="确认"
    cancelText="取消"
  >
    <Button type = "link">Logout</Button>
  </Popconfirm>
    
}   

export default Logout;