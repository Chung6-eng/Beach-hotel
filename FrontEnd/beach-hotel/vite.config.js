import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/rooms": {
        target: "https://hotel-main-server-production.up.railway.app",
        changeOrigin: true,
        secure: true
      },
      "/bookings": {
        target: "https://hotel-main-server-production.up.railway.app",
        changeOrigin: true,
        secure: true
      },
      "/auth": {
        target: "https://hotel-main-server-production.up.railway.app",
        changeOrigin: true,
        secure: true
      },
      "/users": {
        target: "https://hotel-main-server-production.up.railway.app",
        changeOrigin: true,
        secure: true
      },
      "/api": {
        target: "https://hotel-main-server-production.up.railway.app",
        changeOrigin: true,
        secure: true
      }
    }
  }
})
