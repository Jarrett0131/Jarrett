import type { FC } from 'react';
import LockOutlined from '@ant-design/icons/es/icons/LockOutlined';
import UserOutlined from '@ant-design/icons/es/icons/UserOutlined';
import { Button, Form, Input,Space,message} from 'antd';
import { Link,useSearchParams,useFetcher} from 'react-router-dom';    
import type {ActionFunctionArgs} from 'react-router-dom';
import { loginApi } from '@/api/auth-api.ts';
import to from 'await-to-js';
import {setToken} from '@/store/app-store.ts';

const Login: FC = () => {
//获取查询参数
const [searchParams ] = useSearchParams();
const loginFetcher = useFetcher();

    const onFinish = (values: LoginForm) => {
      if(loginFetcher.state === 'submitting') return ;
        loginFetcher.submit(values, {
            method: 'post',
            action: '/login'
        });
  };

    return ( <Form 
    onFinish={onFinish} 
    size="large"
    initialValues={{username:searchParams.get('username') || ''}}
    >
      <Form.Item
        name="username"
        rules={[
            { required: true, message: '请输入用户名!' },
            {pattern :/^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1到10位的非空字符!' }
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
            { required: true, message: '请输入密码!' },
            {pattern :/^\S{6,15}$/, message: '密码必须是6到15位的非空字符!' }
        ]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Space direction="vertical"> 
            <Button 
            block type="primary" 
            htmlType="submit" 
            loading={loginFetcher.state === 'submitting'&&{delay: 200}}
            >
                Login
            </Button>
            <div>
                or <Link to="/reg">Register now!</Link>
            </div>
        </Space>
      </Form.Item>
    </Form>   
    );
}

export const action = async({request}:ActionFunctionArgs) =>{
    const fd =await request.formData();
    const [err ,res] = await to(loginApi(fd));
    
    if(err)  return null;
    //将token存储到zustand全局状态管理中
    setToken(res.token);
    message.success(res.message);
    //登录成功后跳转到首页
    //return redirect('/');
    return null;
}


export default Login