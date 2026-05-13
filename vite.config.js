import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        port: 3001,
        proxy: {
            '/auth': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '/trajets': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '/itineraires': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '/connections': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '/transactions': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '/billets': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '/controles': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '/admin': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '/users': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '/services-transport': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '/unites-controle': {
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        }
    }
})