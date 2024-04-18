import { defineConfig } from 'vite';
import getBanner from './build/banner';

const RollupBannerPlugin = {
  name: 'banner',
  enforce: 'post',
  generateBundle(options, bundle) {
    const banner = getBanner()
    for (const module of Object.values(bundle)) {
      if (module.type === 'chunk') {
        module.code = banner + module.code
      }
    }
  }
}

export default defineConfig({
  build: {
    lib: {
      entry: './lib/index.js',
      name: 'echarts-extension-bingmaps',
      fileName: 'echarts-extension-bingmaps',
    },
    rollupOptions: {
      external: ['echarts'],
      output: {
        globals: {
          echarts: 'echarts',
        },
      },
      plugins: [
        RollupBannerPlugin
      ]
    },
  },
});
