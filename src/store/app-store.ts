import {create} from 'zustand';
import {persist,devtools} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';

type AppStoreType = typeof initState;

// 定义初始状态
const initState = {
    token:''
};

const useAppStore = create<AppStoreType>()(
    immer(
        devtools(
            persist(
                ()=>{
                // store中的数据
                return {
                    ...initState
                }},
                {name:'app-store'} //数据持久化的配置
                ),
        {name:'app-store'})//调试工具的配置
    )
);

export default useAppStore;

//修改 store 数据的函数
//为token赋值的函数
export const setToken = (token:string) =>{
    useAppStore.setState((state) => {
        state.token = token;
    });
}