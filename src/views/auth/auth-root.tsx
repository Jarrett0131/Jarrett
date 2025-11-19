import type {FC ,PropsWithChildren} from 'react';
import useAppStore ,{selectToken}from '@/store/app-store'
import { Navigate } from 'react-router-dom'

const AuthRoot: FC<PropsWithChildren> = ({children}) => {
    const token = useAppStore(selectToken); 
    //如果已经有token，说明用户已经登录，直接跳转到首页
    if(token){
        return <>{children}</>
    }else{
        return <Navigate to="/login" replace />
    }
}

export default AuthRoot