//项目发布上线时对应的打包配置项
import type { UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { join } from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import { createHtmlPlugin } from 'vite-plugin-html';
import externalGlobals from 'rollup-plugin-external-globals';


const prodConfig: UserConfig = {
  plugins: [
    react(),
    visualizer({ open: false, gzipSize: true, brotliSize: true, filename: 'stats.html' }) ,
    externalGlobals({ 
      // 键: 值
      // 排除的第三方包的名字: window对象上通过 CDN 资源链接挂载的对象的名字
      react: 'React', 
      'react-dom': 'ReactDOM',
      antd: 'antd'
    }), 
    createHtmlPlugin({ 
      // 是否针对 html 标签进行代码压缩
      minify: true, 
      // 打包的入口
      entry: 'apps/admin/src/main.tsx', 
      // 向网页中注入数据
      inject: { 
        // 真正要注入到网页中的数据
        data: { 
          title: '\u53a6\u5927\u6570\u5b57\u5de5\u574a\u6587\u7ae0\u540e\u53f0\u7ba1\u7406\u7cfb\u7edf', 
          injectScript: `
            <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
            <script defer src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script>
            <script defer src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
            <script defer src="https://cdn.jsdelivr.net/npm/antd@5.12.2/dist/antd.min.js"></script>
            `
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
  },
  build: { 
    // 这是 rollup 的打包配置项
    rollupOptions: { 
      output: { 
        // 按照文件类型，组织打包生成的资源文件（css, 图片等）
        assetFileNames: '[ext]/[name]-[hash][extname]', 
        // 把打包生成的入口文件，放入到 js/entry/ 目录下
        entryFileNames: 'js/entry/[name]-[hash].js', 
        // 把打包生成的 chunk 文件，放入到 js/chunk/ 目录下
        chunkFileNames: 'js/chunk/[name]-[hash].js',
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('localforage')) return 'vendor-storage';
          if (id.includes('react-router-dom') || id.includes('@remix-run')) return 'vendor-router';
          if (id.includes('zustand') || id.includes('immer')) return 'vendor-state';
          if (id.includes('react-quill') || id.includes('quill')) return 'vendor-editor';
          if (id.includes('dayjs') || id.includes('axios') || id.includes('qs') || id.includes('await-to-js')) return 'vendor-utils';
          return 'vendor';
        }
      } ,
      // 凡是需要排除在打包结果之外的第三方依赖包，都需要声明到这个数组中，而且没有前后顺序
      external: ['react-dom', 'react','antd'] 
    } 
  } ,
  esbuild: { 
    drop: ['console', 'debugger'] 
  } 
}

export default prodConfig;
