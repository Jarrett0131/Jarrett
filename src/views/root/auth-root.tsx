import type {FC ,PropsWithChildren} from 'react';;
import useAppStore ,{selectToken}from '@/store/app-store';
import { Navigate,useLocation ,matchRoutes} from 'react-router-dom';
import router from '@/router';

const AuthRoot: FC<PropsWithChildren> = ({children}) => {
    const token = useAppStore(selectToken); 
    const location = useLocation() ;
    //如果已经有token，说明用户已经登录，直接跳转到首页
    if(token){
        return <>{children}</>;
    }else{
        const nextURL = location.pathname + location.search ;
        const matchResult = matchRoutes(router.routes, nextURL) ;
        if (matchResult && matchResult.length !== 0 && matchResult[matchResult.length - 1].route.path === '*') { 
            return <Navigate to="/login" replace /> // 触发了通配符的路由匹配
            } else { 
            // 无 token，需要强制跳转到登录页面
            return <Navigate to={'/login?from=' + nextURL} replace />
            } 
    }
}

export default AuthRoot;