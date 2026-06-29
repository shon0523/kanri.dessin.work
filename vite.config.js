import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 本番ビルド（GitHub Pages公開）時はリポジトリ名をベースパスにする。
// ローカル開発（npm run dev）時は通常どおり "/" を使う。
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/kanri.dessin.work/' : '/',
  plugins: [react()],
}))
