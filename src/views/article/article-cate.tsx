import type { FC } from 'react';
import { Suspense } from 'react';
import { getCateListApi,postCateApi,editCateApi,delCateApi} from '@/api/cate-api.ts';
import to from 'await-to-js';
import { useLoaderData ,defer,Await} from 'react-router-dom';
import { Table ,Space,message } from 'antd';
import type { TableProps } from 'antd';
import ButtonAdd from '@/components/article-cate/btn-add';
import type { ActionFunctionArgs } from 'react-router-dom';
import ButtonEdit from '@/components/article-cate/btn-edit';
import ButtonDelete from '@/components/article-cate/btn-del';
import LoaderErrorElement from '@/components/common/loader-error-element';


const columns: TableProps<CateItem>['columns'] = [
  {
    title: '序号',
    render(_, __, index) {
      return index + 1
    }
  },
  {
    title: '分类名称',
    dataIndex: 'cate_name'
  },
  {
    title: '分类别名',
    dataIndex: 'cate_alias'
  },
  {
    title: '操作',
    render(_, record) {
      return (
        <>
          <ButtonEdit cate={record} />
          <ButtonDelete id={record.id} />
        </>
      )
    }
  }
]


const ArticleCate: FC = () => {
  const loaderData = useLoaderData() as { result : Promise<BaseResponse<CateItem[]>>} ;

  return <Suspense fallback ={<Table loading ={true}/>}>
    <Await resolve={loaderData.result} errorElement={<LoaderErrorElement/>}  >
      {(result :BaseResponse<CateItem[]>) => (
        <Space direction="vertical" style={{display :'flex'}}>
        <ButtonAdd />
        <Table
          dataSource={result.data} // 表格的数据源
          columns={columns} // 列的配置
          size="middle" // 表格的尺寸
          rowKey="id" // 数据项的唯一标识
          pagination={false} // 是否显示表格分页
          bordered // 边框线
        />
      </Space>
      )}
    </Await>
  </Suspense>   
}



export default ArticleCate;

export const loader = async () => {
  //调用接口，请求分类的列表数据
  const result = getCateListApi();

  //如果想要减少loader的执行事件，那么异步的Ajax操作，可以不在loader中进行await等待
  //直接把Promise return给组件，让组件自己进行Promise的等待
  return defer({result });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData();

  // 获取请求的 method 类型
  const method = request.method.toUpperCase() as 'POST' | 'PUT' | 'PATCH' | 'DELETE';


  if (method === 'POST') {
    // 调用添加的 API 接口
    const [err] = await to(postCateApi(fd));
    if (err) return null;
    message.success('添加成功!');
  } else if (method === 'PUT') {
    // 调用修改文章分类的接口
    const [err] = await to(editCateApi(fd)) ;
    if (err) return null;
    message.success('修改成功!') ;
  }else if (method === 'DELETE') {
    // 调用删除分类的接口
    const [err] = await to(delCateApi(fd)) ;
    if (err) return null;
    message.success('删除成功!');
  }
  return true;
}