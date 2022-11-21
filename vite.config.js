import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	root: './src',
	publicDir: 'assets',
	plugins: [vue()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src")
		}
	},
	build: {
		outDir: '../dist',
	},
	preview: {
		port: 3300,
	},
})
