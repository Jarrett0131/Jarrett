import axios from '@/api' ;

// 发布文章
export const postArticleApi = (data: FormData) => axios.post<null, BaseResponse>('/my/article/add', data) ;

// 根据分页，获取文章的列表数据
export const getArticleListApi = (data: ArtListQuery) => axios.get<null, ArticleListResponse>('/my/article/list', { params: data }) ;

// 删除文章
export const deleteArticleApi = (data: FormData) => axios.delete<null, BaseResponse>('/my/article/info', { params: data }) ;

