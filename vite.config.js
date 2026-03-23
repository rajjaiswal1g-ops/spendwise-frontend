import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // यहाँ swc हटाकर plugin-react कर दें
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})