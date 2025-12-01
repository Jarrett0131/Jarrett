import type { FC } from 'react';
import { useMemo } from 'react';
import { Breadcrumb } from 'antd';
import {  useLocation ,matchPath,useAsyncValue} from 'react-router-dom';

type BreadcrumbItem = {
  title: string
}

const RootBreadcrumb: FC = () => {
  //const loaderData = useLoaderData() as { menus: MenuItem[] } | null;
  const  [menuResult] =useAsyncValue() as [BaseResponse<MenuItem[]>] ;
  const menus = useMemo(()=>menuResult.data || [] , [menuResult]);
  const location = useLocation();
  const nowPath = location.pathname === '/' ? '/home' : location.pathname ;

  const items = useMemo(() => resolveBreadcrumbItems(menus, nowPath), [menus, nowPath])  ;

  return <Breadcrumb items={items} />
}

const resolveBreadcrumbItems = (menus: MenuItem[] | undefined, nowPath: string, breadcrumbItems: BreadcrumbItem[] = []): BreadcrumbItem[] | undefined => {
  if (!menus) return ;
  for (const item of menus) {
    // 进行路径的匹配操作：
    // 如果 matchResult 为 null 说明匹配失败
    // 如果 matchResult 是一个匹配的结果对象，说明匹配成功
    const matchResult = matchPath(item.key, nowPath) ;
     if (matchResult) { // 如果 matchResult 能转为 true，说明匹配成功
      breadcrumbItems.unshift({ title: item.label }) ;
      return breadcrumbItems ;
    }

    if (item.children) {
      // result 有两种结果：
      // 1. 找到了，那么 result 是一个数组，转为布尔值以后是 true
      // 2. 没找到子节点，那么 result 是 undefined，转为布尔值以后是 false
      const result = resolveBreadcrumbItems(item.children, nowPath, breadcrumbItems)
      if (result) {
        // 追加父节点
        breadcrumbItems.unshift({ title: item.label });
        return breadcrumbItems;
      }
    }
  }
}



export default RootBreadcrumb ;