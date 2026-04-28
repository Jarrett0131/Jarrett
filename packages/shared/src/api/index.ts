import axios from 'axios';
import type { AxiosError, AxiosRequestTransformer } from 'axios';
import { message } from 'antd';
import qs from 'qs';
import config from '../config.json';
import { isJwtExpired } from '@shared/auth/jwt';
import useAppStore, { clearAuth } from '@shared/store/app-store';
import { resetAllStore } from '@shared/store/resetters.ts';

const instance = axios.create({
  baseURL: config.baseURL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-api-key': 'ab428ee8-c6ae-4bee-86ca-a5bd3437cff5'
  }
});

instance.interceptors.request.use(
  (requestConfig) => {
    const url = requestConfig.url;
    const method = requestConfig.method?.toUpperCase();
    const isFormData = requestConfig.data instanceof FormData;

    if (isFormData || url === '/my/article/add' && method === 'POST' || url === '/my/article/info' && method === 'PUT') {
      requestConfig.transformRequest = [];
    } else {
      requestConfig.transformRequest = requestTransformer;
    }

    requestConfig.paramsSerializer = {
      serialize(params) {
        if (params instanceof FormData) {
          return qs.stringify(Object.fromEntries(params));
        }
        return qs.stringify(params);
      }
    };

    const token = useAppStore.getState().token;
    if (url?.includes('/my/') && token) {
      if (isJwtExpired(token)) {
        clearAuth();
        resetAllStore();
        message.error('登录已过期，请重新登录');
        return Promise.reject({ code: 401, message: 'JWT expired' });
      }

      requestConfig.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    return requestConfig;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    if (response.data && response.data.message) {
      return response.data;
    }
    return { code: 0, message: response.statusText };
  },
  (error: AxiosError<{ code: number; message: string }>) => {
    if (error.response?.data) {
      if (error.response.status === 401) {
        if (useAppStore.getState().token) {
          message.error('登录已过期，请重新登录');
          resetAllStore();
        }
      } else if (error.response.status === 403) {
        message.error('当前账号没有操作权限');
      } else {
        message.error(error.response.data.message);
      }

      return Promise.reject(error.response.data);
    }

    switch (error.code) {
      case 'ECONNABORTED':
        message.error('请求超时，请稍后重试');
        break;
      case 'ERR_NETWORK':
        message.error('网络异常，请稍后重试');
        break;
      default:
        message.error('请求失败，请稍后重试');
        break;
    }

    return Promise.reject(error);
  }
);

const requestTransformer: AxiosRequestTransformer = (data) => {
  if (data instanceof FormData) {
    return qs.stringify(Object.fromEntries(data));
  }
  return qs.stringify(data);
};

export default instance;
