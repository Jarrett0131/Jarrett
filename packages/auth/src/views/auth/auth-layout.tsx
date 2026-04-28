import type { FC ,PropsWithChildren} from 'react';
import useAppStore ,{clearAuth, selectToken}from '@shared/store/app-store';
import { Navigate,useLocation } from 'react-router-dom';
import styles from './css/auth-layout.module.less';
import { isJwtExpired } from '@shared/auth/jwt';

const AuthLayout: FC<PropsWithChildren> = ({children}) => {
    const token = useAppStore(selectToken);
    const location = useLocation() ;

    //如果已经有token，说明用户已经登录，直接跳转到首页
    if(token && isJwtExpired(token)){
        clearAuth();
    }

    if(token && !isJwtExpired(token)){
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
