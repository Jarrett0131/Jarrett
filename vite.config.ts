import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { join } from 'node:path';
import devConfig from './vite.dev.config';
import prodConfig from './vite.prod.config';

// https://vitejs.dev/config/
export default defineConfig(({mode})=>{
  return mode === 'development' ? devConfig : prodConfig ;
})


