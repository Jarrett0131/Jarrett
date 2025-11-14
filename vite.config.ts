import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { join } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 配置 @ 的路径别名
      '@': join(__dirname, './src/')
    }
  },
  css: {
    modules: {
      // 设置 CSS 模块的命名格式  
      localsConvention: 'camelCaseOnly'
    }
  }
})
