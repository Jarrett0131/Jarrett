import React from 'react';
import { Layout,} from 'antd';
import RootHeader from '@/components/root/header';
import useAppStore ,{selectCollapsed}from '@/store/app-store'; 
import { initUser } from '@/store/user-store.ts'; 
import { getMenuApi } from '@/api/user-api';
import to from 'await-to-js'; 
import RootMenu from '@/components/root/menu';
import { Outlet } from 'react-router-dom';
import logo from '@/assets/images/logo.svg';
import styles from './css/root.module.less';

const { Sider, Content,Footer} = Layout;

const Root: React.FC = () => {
  const collapsed = useAppStore(selectCollapsed); 
  return (
    <Layout className={styles.container}>
        {/*侧边栏*/}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        {/*侧边栏头部logo区域*/}
        <div className = {styles.boxLogo}>
            <img src={logo} alt="logo" className={styles.logo}/>
            {/*按需展示文字标题*/}
            {!collapsed && <span className={styles.logoText}>文章管理系统</span>}
        </div>
        {/*菜单项*/}
        <RootMenu/>
      </Sider>
      <Layout>
        {/*头部区域*/}
        <RootHeader/>
        {/*内容区域*/}
        <Content className = {styles.content}>
          <Outlet />
        </Content>
        {/*底部区域*/}
        <Footer style={{ textAlign: 'center' }}>
          Powered by © Jarrett
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Root;

export const loader = async() => {
    //路由匹配成功后，将要渲染该组件时，调用initUser函数初始化用户信息
    initUser();
    //获取左侧菜单的列表数据
    const [err,res] = await to(getMenuApi());

    if(err) return null;

    return {menus: res.data};
}