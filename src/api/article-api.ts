import axios from '@/api' ;

// 发布文章
export const postArticleApi = (data: FormData) => axios.post<null, BaseResponse>('/my/article/add', data) ;

