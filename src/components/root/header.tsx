import type {FC} from 'react';
import {MenuFoldOutlined,MenuUnfoldOutlined,UserOutlined} from '@ant-design/icons';
import { Button, Layout, Avatar } from 'antd';
import Logout from './logout';
import useAppStore,{setCollapsed,selectCollapsed}from '@/store/app-store';
import useUserStore,{selectName,selectAvatar} from '@/store/user-store';
import styles from '@/components/css/header.module.less';
import RootBreadcrumb from '@/components/root/breadCrumb';


const { Header} = Layout;

const RootHeader: FC = () => {
    //从zustand获取全局数据（侧边栏展开状态）
    const collapsed =useAppStore(selectCollapsed);
    const name = useUserStore(selectName);
    const avatar = useUserStore(selectAvatar);


    return (
    <Header className={styles.container} >
          <div className={styles.boxLeft}>
            <Button
            type="text"
            className={styles.btnCollapsed}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <span>欢迎:{name},您当前的位置是:</span>
          {/* 封装并实现面包屑导航组件 */}
              <RootBreadcrumb />
          </div>
          <div>
            {/*头像和退出登录按钮*/}
            {avatar?<Avatar src ={avatar} />:<Avatar  icon={<UserOutlined />} />}
            <Logout/>
          </div>
        </Header>
        )
}

export default RootHeader;