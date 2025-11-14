import type { FC ,PropsWithChildren} from 'react'
import styles from './css/auth-layout.module.less'

const AuthLayout: FC<PropsWithChildren> = ({children}) => {
    return <div className={styles.container}>
        <div className={styles.boxTest}> 
            {children}
        </div>
    </div>   
}   

export default AuthLayout