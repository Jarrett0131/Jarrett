import { FC } from "react";
import { useState } from "react";
import HomeOutlined from '@ant-design/icons/es/icons/HomeOutlined';
import ReadOutlined from '@ant-design/icons/es/icons/ReadOutlined';
import AppstoreOutlined from '@ant-design/icons/es/icons/AppstoreOutlined';
import ProfileOutlined from '@ant-design/icons/es/icons/ProfileOutlined';
import FileAddOutlined from '@ant-design/icons/es/icons/FileAddOutlined';
import FileTextOutlined from '@ant-design/icons/es/icons/FileTextOutlined';
import UserOutlined from '@ant-design/icons/es/icons/UserOutlined';
import SolutionOutlined from '@ant-design/icons/es/icons/SolutionOutlined';
import PictureOutlined from '@ant-design/icons/es/icons/PictureOutlined';
import KeyOutlined from '@ant-design/icons/es/icons/KeyOutlined';
import { Menu } from 'antd';
import type {MenuProps} from 'antd';
import { useNavigate, useLocation,useAsyncValue} from "react-router-dom";

const iconMap ={
    //键：值
    HomeOutlined:<HomeOutlined/>,
    ReadOutlined:<ReadOutlined/>,
    AppstoreOutlined:<AppstoreOutlined/>,
    ProfileOutlined:<ProfileOutlined/>,
    FileAddOutlined:<FileAddOutlined/>,
    FileTextOutlined:<FileTextOutlined/>,
    UserOutlined:<UserOutlined/>,
    SolutionOutlined:<SolutionOutlined/>,
    PictureOutlined:<PictureOutlined/>,
    KeyOutlined:<KeyOutlined/>
}

const rootSubmenuKeys = ['2','3']

const  RootMenu:FC = () => {
    //const data = useLoaderData() as { menus: MenuItem[] } | null;
    const [menuResult] =useAsyncValue() as [BaseResponse<MenuItem[]>];
    const menus = menuResult.data || [];
    const navigate = useNavigate();
    const location = useLocation();

    const selectedKey = location.pathname === '/' ? '/home' :location.pathname;

    const [openKeys,setOpenkeys] = useState<string[]>([getOpenKey(menus, selectedKey)]);

    const onOpenChange:MenuProps['onOpenChange'] = (keys) =>{
        const latestOpenkey = keys.find((key) => openKeys.indexOf(key) === -1);
        if(latestOpenkey && rootSubmenuKeys.indexOf(latestOpenkey!) === -1){
            setOpenkeys(keys);
        }else{
            setOpenkeys(latestOpenkey?[latestOpenkey] :[]);
        }
    }
 

    //const {menus} = data;
    //递归处理每个菜单项的图标
    resolveMenuIcon(menus);


    const onMenuItemClick : MenuProps['onClick']= ({key}) => {
        //进行路由导航的跳转
        navigate(key);

    }

    return <> 
    <Menu
          theme="dark"
          mode="inline"
          items={menus}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          onClick={onMenuItemClick}
          selectedKeys={[selectedKey]}
        />
    </>
}

//定义一个方法，递归的处理每一个菜单项的图标
const resolveMenuIcon = (menus : MenuItem[]) =>{
    for(const menu of menus){
        const iconName = menu.icon as keyof typeof iconMap;
        menu.icon = iconMap[iconName];

        if(menu.children){
            resolveMenuIcon(menu.children);
        }

    }
}

//定义一个递归函数，递归查找当前选中结点的的父节点的key值
const getOpenKey = (menus: MenuItem[] | undefined, selectedKey: string, parentKey: string = ''): string => {
    if (!menus) return ''
    for (const item of menus) {
        // 如果当前循环项的 key 等于 selectedKey（被选中的菜单项的 key），则把父节点的 key 值返回
        if (item.key === selectedKey) {
        return parentKey
        }

        if (item.children) {
        const result = getOpenKey(item.children, selectedKey, item.key)
        if (result) {
            // 找到了
            return result
        }
        }
    }

  return ''
}

export default RootMenu;