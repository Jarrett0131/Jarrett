import {createBrowserRouter} from 'react-router-dom';
//导入路由组件
import RouterErrorElement from '@shared/components/router-error-element';
import PageNotFound from '@shared/components/404';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import AuthLayout from '@auth/views/auth/auth-layout.tsx';
import AuthRoot from '@admin/root/auth-root';



const router = createBrowserRouter([
    {path :'/reg', 
    errorElement: <RouterErrorElement />,
        async lazy() { 
            const { default: Reg, action } = await import('@auth/views/auth/reg.tsx') 
            return { 
                element: ( 
                <AuthLayout>
                    <Reg />
                </AuthLayout> 
                ), 
                action 
            } 
            } 
    },
    {path :'/login', 
    errorElement: <RouterErrorElement /> ,
     async lazy() {  
        const { default: Login, action } = await import('@auth/views/auth/login.tsx')  
        return {  
            element: (  
            <AuthLayout>
                <Login />
            </AuthLayout>  
            ),  
            action  
        }  
        }  
    },
    {   path :'/', 
        errorElement: <RouterErrorElement />  ,
        async lazy() {  
            const { default: Root, loader } = await import('@admin/root/root.tsx')  
            return {  
                element: (  
                <AuthRoot>
                    <Root />
                </AuthRoot>  
                ),  
                loader  
            }  
            },  
        children :[
            {  
            errorElement: <RouterErrorElement />,  
            children: [
            //索引路由
            {index: true,
                async lazy() { 
                    const { default: Home } = await import('@admin/home/home.tsx') 
                    return { Component: Home } 
                    } 
            },
            {path : 'home',
                async lazy() { 
                    const { default: Home } = await import('@admin/home/home.tsx') 
                    return { Component: Home } 
                } 
            },
            {path : 'user-avatar',
                handle: { permissions: 'user:avatar' },
                async lazy() { 
                    const { default: UserAvatar, action } = await import('@user/views/user/user-avatar.tsx') 
                    return { Component: UserAvatar, action } 
                } 
            },
            {path : 'user-info',
                handle: { permissions: 'user:profile' },
                async lazy() { 
                    const { default: UserInfo, action } = await import('@user/views/user/user-info.tsx') 
                    return { Component: UserInfo, action } 
                } 
            },
            {path : 'user-pwd',
                handle: { permissions: 'user:password' },
                async lazy() { 
                    const { default: UserPassword, action } = await import('@user/views/user/user-password.tsx') 
                    return { Component: UserPassword, action } 
                } 
            },
            {path : 'art-add',
                handle: { permissions: 'article:create' },
                async lazy() { 
                    const { default: ArticleAdd, loader, action } = await import('@article/views/article/article-add.tsx') 
                    return { Component: ArticleAdd, loader, action } 
                    }, 
                shouldRevalidate: () => false
            },
            {path : 'art-cate',
                handle: { permissions: 'article:category' },
                async lazy() { 
                    const { default: ArticleCate, loader, action } = await import('@article/views/article/article-cate.tsx') 
                    return { Component: ArticleCate, loader, action } 
                    } ,
            errorElement: <RouterErrorElement /> 
            },
            {path : 'art-list',
                handle: { permissions: 'article:list' },
                async lazy() { 
                    const { default: ArticleList, loader, action } = await import('@article/views/article/article-list.tsx') 
                    return { Component: ArticleList, loader, action } 
                    } 
            },
            {path :'art-edit/:id',
                handle: { permissions: 'article:update' },
                async lazy() { 
                    const { default: ArticleEdit, loader, action } = await import('@article/views/article/article-edit.tsx') 
                    return { Component: ArticleEdit, loader, action } 
                    }, 
                shouldRevalidate: () => false
            },
            { path: '*', element: <PageNotFound /> } 
                ]
            }
        ]
    },
])

// 监听路由对象的变化
router.subscribe((state) => {
  if (state.navigation.location) {
    // 正在请求页面资源...
    // 展示顶部的一个进度条，提示用户资源加载中
    NProgress.start();
  } else {
    // 没有请求页面资源...
    // 隐藏顶部的进度条
    NProgress.done() ;
  }
})

export default router;
