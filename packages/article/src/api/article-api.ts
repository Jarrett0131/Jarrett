import axios from '@shared/api' ;

// 发布文章
export const postArticleApi = (data: FormData) => axios.post<null, BaseResponse>('/my/article/add', data) ;

// 根据分页，获取文章的列表数据
export const getArticleListApi = (data: ArtListQuery) => axios.get<null, ArticleListResponse>('/my/article/list', { params: data }) ;

// 删除文章
export const deleteArticleApi = (data: FormData) => axios.delete<null, BaseResponse>('/my/article/info', { params: data }) ;

// 根据 id 获取文章详情
export const getArticleApi = (id: string) => axios.get<null, BaseResponse<ArticleEditForm>>('/my/article/info', { params: { id } }) ;

// 修改文章内容
export const putArticleApi = (data: FormData) => axios.put<null, BaseResponse>('/my/article/info', data);

export type LargeFileVerifyPayload = {
  hash: string;
  filename: string;
  size: number;
  chunkSize: number;
  totalChunks: number;
};

export type LargeFileVerifyResponse = {
  uploaded: boolean;
  url?: string;
  uploadedChunks?: number[];
};

export type LargeFileMergePayload = LargeFileVerifyPayload;

export const verifyLargeFileApi = (data: LargeFileVerifyPayload) =>
  axios.post<null, BaseResponse<LargeFileVerifyResponse>>('/my/upload/verify', data);

export const uploadLargeFileChunkApi = (data: FormData, signal?: AbortSignal) =>
  axios.post<null, BaseResponse>('/my/upload/chunk', data, { signal });

export const mergeLargeFileApi = (data: LargeFileMergePayload) =>
  axios.post<null, BaseResponse<{ url: string }>>('/my/upload/merge', data);
