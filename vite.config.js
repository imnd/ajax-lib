import path  from 'path'
import { defineConfig } from 'vite'

const config = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'ajax.js'),
      name: 'ajax',
      fileName: 'ajax'
    },
  }
});

export default config;
