import ReactDOM from 'react-dom/client'
import {RouterProvider} from 'react-router-dom'
import router from '@/router'   
// 全局样式表
import '@/index.less'

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router}/>);
