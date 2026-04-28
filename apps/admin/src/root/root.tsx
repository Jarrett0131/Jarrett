import React,{Suspense} from 'react';
import { Layout,Spin} from 'antd';
import RootHeader from '@admin/root/components/header';
import useAppStore ,{clearAuth, selectCollapsed}from '@shared/store/app-store'; 
import { initUser } from '@user/store/user-store.ts'; 
import { getMenuApi } from '@user/api/user-api';
import RootMenu from '@admin/root/components/menu';
import { Outlet,Await,redirect,useLoaderData} from 'react-router-dom';
import { isJwtExpired } from '@shared/auth/jwt';
import logo from '@shared/assets/images/logo.svg';
import styles from './css/root.module.less';

const { Sider, Content,Footer} = Layout;

const Root: React.FC = () => {
  const collapsed = useAppStore(selectCollapsed); 
  const loaderData = useLoaderData() as {result: Promise<[BaseResponse<MenuItem[]>, void]>};

  return (
    <Suspense fallback = {<Spin fullscreen />}>
      <Await resolve={loaderData.result}>
        {()=>{
          return (
            <Layout className={styles.container}>
                {/*侧边栏*/}
              <Sider trigger={null} collapsible collapsed={collapsed}>
                {/*侧边栏头部logo区域*/}
                <div className = {styles.boxLogo}>
                    <img src={logo} alt="logo" className={styles.logo}/>
                    {/*按需展示文字标题*/}
                    {!collapsed && <span className={styles.logoText}>厦大数字工坊</span>}
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
          )
        }}
      </Await>
    </Suspense>
  );
};

export default Root;

export const loader = async() => {
    const token = useAppStore.getState().token;
    if (!token || isJwtExpired(token)) {
        clearAuth();
        return redirect('/login');
    }

    const result = Promise.all([getMenuApi(),initUser()])

    return {result};
}
