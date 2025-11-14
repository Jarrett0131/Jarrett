import type { FC } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space,message} from 'antd';
import { Link,useSubmit,redirect,useNavigation} from 'react-router-dom';
import type {ActionFunctionArgs} from 'react-router-dom';
import { regApi } from '@/api/auth-api.ts';
import to from 'await-to-js';

const Reg: FC = () => {
    const submit = useSubmit();
    const navigation = useNavigation();
    const onFinish = (values: RegForm) => {
    //参数1：要提交给action的数据
    //参数2：配置对象，用来指定提交的method 和 action地址
    submit(values, { 
        method: 'post', 
        action: '/reg' 
    });
  }

    return (<Form onFinish={onFinish} size="large">
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名!' },
        {pattern :/^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1到10位的非空字符!' }
    ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username"  />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码!' },
        {pattern :/^\S{6,15}$/, message: '密码必须是6到15位的非空字符!' }
    ]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
      </Form.Item>
      <Form.Item
        name="repassword"
        dependencies={['password']}  //依赖密码框的内容变化来触发验证
        validateFirst    //某一条规则不通过就不再验证后面的规则
        rules={[{ required: true, message: '请确认密码!' },
        {pattern :/^\S{6,15}$/, message: '密码必须是6到15位的非空字符!' },
        ({getFieldValue}) => ({
            validator(_, value,) {
                if(value === getFieldValue('password')) return Promise.resolve();
                return Promise.reject(new Error('两次输入的密码不一致!'));
            }})         
    ]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="Confirm Password" />
      </Form.Item>

      <Form.Item>
        <Space direction="vertical"> 
            <Button block type="primary" htmlType="submit" loading={navigation.state !== 'idle'&&{delay: 200}}>
                Register
            </Button>
            <div>
                or <Link to="/login">Login now!</Link>
            </div>
        </Space>
      </Form.Item>
    </Form>);
}


//定义并导出路由的action函数
export const action = async ({request}:ActionFunctionArgs) => {
    const fd  =await request.formData();
    //优化try-catch：使用await-to-js库来处理异步请求的错误
    const [err] = await to(regApi(fd));

    if(err) return null;
    

    //注册成功
    message.success('注册成功，请登录！');
    return redirect('/login?uname='+ fd.get('username'));
}


export default Reg