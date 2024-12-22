import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'docs',
    assetsDir: 'assets'
  },
  base: './',
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.gif'],
  css: {
    preprocessorOptions: {
      scss: {
        // 移除这行，因为我们会直接在需要的地方导入
        // additionalData: `@import "@/assets/styles/variables.scss";`
      }
    }
  }
})
