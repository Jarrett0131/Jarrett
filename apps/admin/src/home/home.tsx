import { FC } from 'react';
import {Image, Space} from 'antd';
import styles from '@admin/home/css/home.module.less';

import home from '@shared/assets/images/home.webp';


import '@admin/home/css/home.module.less';

const fallbackImage = 'data :image/png';

const Home : FC = () => {
    return (
        <div className={styles.containerHome}>
            <h1 className={styles.title}>欢迎光临！</h1>
            <br />
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Space direction="horizontal" size={50}>
                    <Image
                    width={600}
                    height={500}
                    className={styles.qrImage}
                    fallback={fallbackImage}
                    src={home}
                    />
                </Space>
                </div>
        </div>
    )
}

export default Home;
