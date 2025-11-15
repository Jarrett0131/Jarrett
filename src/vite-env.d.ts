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
interface BaseResponse {
    code: number
    message: string
}
//登录响应类型
interface LoginResponse extends BaseResponse {
    token: string
}