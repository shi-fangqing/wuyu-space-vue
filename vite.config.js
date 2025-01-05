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
    outDir: 'dist',
    assetsDir: 'assets',
    // // 确保静态资源被正确复制
    // rollupOptions: {
    //   input: {
    //     main: path.resolve(__dirname, 'index.html')
    //   },
    //   output: {
    //     assetFileNames: (assetInfo) => {
    //       const info = assetInfo.name.split('.')
    //       let extType = info[info.length - 1]
    //       // 图片资源不添加 hash，保持原始文件名
    //       if (/\.(png|jpe?g|gif|svg|webp)(\?.*)?$/i.test(assetInfo.name)) {
    //         const name = assetInfo.name.replace(/^.*[\\\/]/, '') // 获取文件名
    //         return `assets/img/${name}`
    //       }
    //       // 其他资源
    //       return `assets/${extType}/[name]-[hash][extname]`
    //     },
    //     chunkFileNames: 'assets/js/[name]-[hash].js',
    //     entryFileNames: 'assets/js/[name]-[hash].js'
    //   }
    // },
    // // 添加静态资源处理
    // copyPublicDir: true,
    // assetsInlineLimit: 4096
  },
  base: '/wuyu-space-vue/',
  // 配置静态资源处理
  publicDir: 'public',
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.gif', '**/*.svg', '**/*.webp', '**/*.md']
})
