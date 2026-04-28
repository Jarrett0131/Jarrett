//项目开发阶段对应的打包配置项
import type { UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { join } from 'node:path';
import { createHtmlPlugin } from 'vite-plugin-html';

const devConfig: UserConfig = {
  plugins: [
    react(),
    createHtmlPlugin({ 
      minify: false, 
      entry: 'apps/admin/src/main.tsx', 
      inject: { 
        data: { 
          title: 'dev-厦大数字工坊', 
          injectScript: '' // 开发阶段不需要向网页中注入任何 script 标签
        } 
      } 
    })  
  ],
  resolve: {
    alias: {
      // 配置 @ 的路径别名
      '@admin': join(__dirname, './apps/admin/src/'),
      '@shared': join(__dirname, './packages/shared/src/'),
      '@article': join(__dirname, './packages/article/src/'),
      '@auth': join(__dirname, './packages/auth/src/'),
      '@user': join(__dirname, './packages/user/src/')
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  }
}

export default devConfig ;
