import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { decodeJwt, getJwtPermissions } from '@shared/auth/jwt';
import resetters from './resetters';

const initState = {
  token: '',
  tokenPayload: null as ReturnType<typeof decodeJwt>,
  permissions: [] as string[],
  collapsed: false
};

export type AppStoreType = typeof initState;

const useAppStore = create<AppStoreType>()(
  immer(
    devtools(
      persist(
        (set) => {
          resetters.push(() => set(initState));

          return {
            ...initState
          };
        },
        {
          name: 'app-store',
          onRehydrateStorage() {
            return (state) => {
              if (!state?.token) return;
              state.tokenPayload = decodeJwt(state.token);
              state.permissions = getJwtPermissions(state.token);
            };
          }
        }
      ),
      { name: 'app-store' }
    )
  )
);

export default useAppStore;

export const setToken = (token: string) => {
  useAppStore.setState((state) => {
    state.token = token;
    state.tokenPayload = decodeJwt(token);
    state.permissions = getJwtPermissions(token);
  });
};

export const clearAuth = () => {
  useAppStore.setState((state) => {
    state.token = '';
    state.tokenPayload = null;
    state.permissions = [];
  });
};

export const setCollapsed = (collapsed: boolean) => {
  useAppStore.setState((state) => {
    state.collapsed = collapsed;
  });
};

export const selectCollapsed = (state: AppStoreType) => state.collapsed;
export const selectToken = (state: AppStoreType) => state.token;
export const selectTokenPayload = (state: AppStoreType) => state.tokenPayload;
export const selectPermissions = (state: AppStoreType) => state.permissions;
