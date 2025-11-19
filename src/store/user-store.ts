import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware'; 
import { immer } from 'zustand/middleware/immer';
import resetters from './resetters';
import { getUserApi } from '@/api/user-api';
import to from 'await-to-js';

type UserStoreType = typeof initState;

//默认的初始数据
const initState = {
    user:{} as User

};


//创建store的hook
const useUserStore = create<UserStoreType>()(
    immer(
        devtools(
            persist((set)=>{
            //添加重置函数到resetters中
            resetters.push(() =>set(initState));
            return {
                ...initState
            };},
            {name:'user-store'} //数据持久化的配置
        ),
        { name: 'user-store' } // 调试工具的配置
    )
    )
);


//导出store的hook
export default useUserStore;

//selsectors
//名字
export const selectName = (state:UserStoreType) => state.user.username||state.user.nickname;
//头像
export const selectAvatar = (state:UserStoreType) => state.user.user_pic;


//actions
//初始化用户基本信息
export const initUser = async() => {
    //1.调用接口，获取用户基本信息
    //2.将获取到的信息，保存到store中
    const [err,res] = await to(getUserApi());

    if(err) return;

    useUserStore.setState((state) => {
        if(res.data) state.user = res.data;
    });
    
}