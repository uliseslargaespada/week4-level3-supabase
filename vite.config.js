import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  test: {
    environment: 'jsdom',
    globals: false,

    setupFiles: ['./src/test/setup.js'],

    include: ['src/**/*.{test,spec}.{js,jsx}'],

    clearMocks: true,

    coverage: {
      provider: 'v8',

      reporter: ['text', 'html', 'lcov'],

      include: [
        'src/components/**/*.{js,jsx}',
        'src/hooks/**/*.js',
        'src/pages/**/*.jsx',
      ],

      exclude: [
        'src/**/*.{test,spec}.{js,jsx}',
        'src/test/**',
      ],
    }
  }
});
