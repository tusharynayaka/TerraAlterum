import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: '.',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                globe: resolve(__dirname, 'globe.html'),
                simulation: resolve(__dirname, 'simulation.html'),
                weather: resolve(__dirname, 'open.html'),
                ml: resolve(__dirname, 'ML.html'),
                contact: resolve(__dirname, 'Contact.html')
            }
        }
    },
    server: {
        port: 5173,
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true
            }
        }
    }
});
