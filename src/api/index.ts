import axios from 'axios'
import type { AxiosRequestTransformer,AxiosError} from 'axios'
import config from '../config.json'
import qs from 'qs'
import {message} from 'antd'

const instance = axios.create({
    baseURL: config.baseURL,
    timeout:1000,
    headers: {  
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-api-key': 'ab428ee8-c6ae-4bee-86ca-a5bd3437cff5'
    }
})

// 请求拦截器
instance.interceptors.request.use(
    function (config) {
    // Do something before request is sent
        const url = config.url;
        const method = config.method?.toUpperCase();

        //为当前请求挂载“请求体转换器”
        if(url === '/my/article/add' && method ==='POST'||url === '/my/article/info' && method ==='PUT'){
            config.transformRequest = [] ;   
        }else{
            config.transformRequest = requestTrasnformer;
        }

    config.transformRequest = requestTrasnformer;
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// 响应拦截器
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if(response.data && response.data.message){
        //有响应体的情况
        return response.data;
    }else{
        //没有响应体的情况
        return {code:0,message:response.statusText};
    }
  }, 
  function (error :AxiosError<{code:number;message:string}>) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log(error);

    //判断 error对象中是否包含 response 响应对象
    //若包含则以包含的message为准，否则使用通用的错误提示
    if(error.response && error.response.data){
        //有响应体的情况
        message.error(error.response.data.message );//弹出错误消息
        return Promise.reject(error.response.data);
    }else{
        //没有响应体的情况
        switch(error.code){
            case 'ECONNABORTED':
                message.error('请求超时，请稍后重试！');break;
            case 'ERR_NETWORK':
                message.error('网络异常，请稍后重试！');break;
            default:
                message.error('请求失败，请稍后重试！');break;
            
            return Promise.reject({code:1,message:error.message});
        }
    } 

    
  });


//请求体转换器
  const requestTrasnformer :AxiosRequestTransformer = (data) => {
    if(data instanceof FormData){
        return qs.stringify(Object.fromEntries(data));
    }else{
        return qs.stringify(data);
    }
  }
export default instance