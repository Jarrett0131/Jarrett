/// <reference types="vite/client" />


//---------- 请求体的数据类型 ----------

type RegForm = {
    username: string
    password: string
    repassword: string
}

type LoginForm = Omit<RegForm, 'repassword'>;


//---------- 接口返回的数据类型 ----------

//基础响应类型
interface BaseResponse <T = unknown>{
    code: number
    message: string
    data ?: T
}
//登录响应类型
interface LoginResponse extends BaseResponse {
    token: string
}

//用户的基本信息
type User = {
    readonly "id": number,
    "username": string,
    "nickname"?: string,
    "email"?: string,
    "user_pic"?: string
}

//左侧菜单项的TS类型
type MenuItem = {
    readonly key: string,
    title?: string,
    label: string,
    icon: React.ReactNode,
    children?: MenuItem[]

}


//用户信息表单TS类型
type UserInfoForm = Pick<User, 'id' | 'email' | 'nickname'>


//修改密码表单TS类型
type ResetPwdForm = {
  old_pwd: string
  new_pwd: string
  re_pwd: string
}


//文章分类TS类型
type CateItem = {
  readonly id: number
  cate_name: string
  cate_alias: string
}


type ArtCateAddForm = Omit<CateItem, 'id'>

//发表文章表单的TS类型
type ArticleAddForm = {
  title: string
  cate_id: string 
  content: string
  state: '草稿' | '已发布'
  cover_img: Blob
  [x: string]: string | Blob
}

type ArticleAddBaseForm = Partial<Pick<ArticleAddForm, 'title' | 'cate_id'>> 