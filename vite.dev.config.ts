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
      entry: 'src/main.tsx', 
      inject: { 
        data: { 
          title: 'dev-文章后台管理系统', 
          injectScript: '' // 开发阶段不需要向网页中注入任何 script 标签
        } 
      } 
    })  
  ],
  resolve: {
    alias: {
      // 配置 @ 的路径别名
      '@': join(__dirname, './src/')
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  }
}

export default devConfig ;
