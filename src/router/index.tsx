import {createBrowserRouter} from 'react-router-dom';
//导入路由组件
import RouterErrorElement from '@/components/common/router-error-element';
import PageNotFound from '@/components/common/404';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import AuthLayout from '@/views/auth/auth-layout.tsx';
import AuthRoot from '@/views/root/auth-root';



const router = createBrowserRouter([
    {path :'/reg', 
    errorElement: <RouterErrorElement />,
        async lazy() { 
            const { default: Reg, action } = await import('@/views/auth/reg.tsx') 
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
        const { default: Login, action } = await import('@/views/auth/login.tsx')  
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
            const { default: Root, loader } = await import('@/views/root/root.tsx')  
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
                    const { default: Home } = await import('@/views/home/home.tsx') 
                    return { Component: Home } 
                    } 
            },
            {path : 'home',
                async lazy() { 
                    const { default: Home } = await import('@/views/home/home.tsx') 
                    return { Component: Home } 
                } 
            },
            {path : 'user-avatar',
                async lazy() { 
                    const { default: UserAvatar, action } = await import('@/views/user/user-avatar.tsx') 
                    return { Component: UserAvatar, action } 
                } 
            },
            {path : 'user-info',
                async lazy() { 
                    const { default: UserInfo, action } = await import('@/views/user/user-info.tsx') 
                    return { Component: UserInfo, action } 
                } 
            },
            {path : 'user-pwd',
                async lazy() { 
                    const { default: UserPassword, action } = await import('@/views/user/user-password.tsx') 
                    return { Component: UserPassword, action } 
                } 
            },
            {path : 'art-add',
                async lazy() { 
                    const { default: ArticleAdd, loader, action } = await import('@/views/article/article-add.tsx') 
                    return { Component: ArticleAdd, loader, action } 
                    }, 
                shouldRevalidate: () => false
            },
            {path : 'art-cate',
                async lazy() { 
                    const { default: ArticleCate, loader, action } = await import('@/views/article/article-cate.tsx') 
                    return { Component: ArticleCate, loader, action } 
                    } ,
            errorElement: <RouterErrorElement /> 
            },
            {path : 'art-list',
                async lazy() { 
                    const { default: ArticleList, loader, action } = await import('@/views/article/article-list.tsx') 
                    return { Component: ArticleList, loader, action } 
                    } 
            },
            {path :'art-edit/:id',
                async lazy() { 
                    const { default: ArticleEdit, loader, action } = await import('@/views/article/article-edit.tsx') 
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