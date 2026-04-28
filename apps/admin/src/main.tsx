import ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import router from '@admin/router' ;
// 全局样式表
import '@admin/index.less';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={zhCN}>
    <RouterProvider router={router} />
  </ConfigProvider>
) ;