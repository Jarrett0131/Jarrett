import axios from "@/api/index.ts";

//注册API接口
export const regApi =(data:RegForm) => axios.post('/api/reg',data);