import {createBrowserRouter} from 'react-router-dom';

//导入路由组件
import Root ,{loader as rootLoader}from '@/views/root/root.tsx';
import Login,{action as loginAction}from '@/views/auth/login.tsx';
import Reg,{action as regAction}from '@/views/auth/reg.tsx';
import AuthLayout from '@/views/auth/auth-layout.tsx';
import AuthRoot from '@/views/auth/auth-root';
import Home from '@/views/home/home.tsx';
import UserAvatar, { action as userAvatarAction } from '@/views/user/user-avatar';
import UserInfo ,{ action as userInfoAction }from '@/views/user/user-info';
import UserPassword, { action as userPwdAction } from '@/views/user/user-password'
import ArticleAdd, { loader as artAddLoader ,action as artAddAction } from '@/views/article/article-add';
import ArticleEdit from '@/views/article/article-edit';
import ArticleCate, { loader as artCateLoader ,action as artCateAction } from '@/views/article/article-cate';
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
            {path : 'user-avatar',element : <UserAvatar/>,action: userAvatarAction},
            {path : 'user-info',element : <UserInfo/>,action: userInfoAction},
            {path : 'user-pwd',element : <UserPassword/>,action: userPwdAction},
            {path : 'art-add',element : <ArticleAdd/>,loader:artAddLoader,action : artAddAction,shouldRevalidate: () => false},
            {path : 'art-cate',element : <ArticleCate/>,loader: artCateLoader,action: artCateAction},
            {path : 'art-list',element : <ArticleList/>},
            {path :'art-edit/:id',element : <ArticleEdit/>}
        ]
    },
])

export default router;