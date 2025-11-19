import {createBrowserRouter} from 'react-router-dom';

//导入路由组件
import Root ,{loader as rootLoader}from '@/views/root/root.tsx';
import Login,{action as loginAction}from '@/views/auth/login.tsx';
import Reg,{action as regAction}from '@/views/auth/reg.tsx';
import AuthLayout from '@/views/auth/auth-layout.tsx';
import AuthRoot from '@/views/auth/auth-root';
import Home from '@/views/home/home.tsx';
import UserAvatar from '@/views/user/user-avatar';
import UserInfo from '@/views/user/user-info';
import UserPassword from '@/views/user/user-password';
import ArticleAdd from '@/views/article/article-add';
import ArticleEdit from '@/views/article/article-edit';
import ArticleCate from '@/views/article/article-cate';
import ArticleList from '@/views/article/article-list';


const router = createBrowserRouter([
    {path :'/reg', 
        action: regAction,
        element: (
        <AuthLayout>
            <Reg/>
        </AuthLayout>)},
    {path :'/login', 
    action: loginAction,
        element: (
        <AuthLayout>
            <Login/>
        </AuthLayout>)},
    {   path :'/', 
        element: (
            <AuthRoot>
                <Root/>
            </AuthRoot>    
        ),
        loader: rootLoader,
        children :[
            //索引路由
            {index: true,element : <Home/>},
            {path : 'home',element : <Home/>},
            {path : 'user-avatar',element : <UserAvatar/>},
            {path : 'user-info',element : <UserInfo/>},
            {path : 'user-pwd',element : <UserPassword/>},
            {path : 'art-add',element : <ArticleAdd/>},
            {path : 'art-cate',element : <ArticleCate/>},
            {path : 'art-list',element : <ArticleList/>},
            {path :'art-edit/:id',element : <ArticleEdit/>}
        ]
    },
])

export default router;