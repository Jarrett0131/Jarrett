import type { FC ,PropsWithChildren} from 'react';
import useAppStore ,{selectToken}from '@/store/app-store';
import { Navigate,useLocation } from 'react-router-dom';
import styles from './css/auth-layout.module.less';

const AuthLayout: FC<PropsWithChildren> = ({children}) => {
    const token = useAppStore(selectToken);
    const location = useLocation() ;

    //如果已经有token，说明用户已经登录，直接跳转到首页
    if(token){
        let nextURL = ''
            if (location.search.includes('?from=')) {  
            const search = location.search.replace('?from=', '')
            nextURL = search ? search : '/'
            } else {  
            nextURL = '/'
            }  
        return <Navigate to={nextURL} replace /> ;
    }else{
        return (
        <div className={styles.container}>
            <div className={styles.boxTest}> 
                {children}
            </div>
        </div>  
    )
    }

    
}   

export default AuthLayout;