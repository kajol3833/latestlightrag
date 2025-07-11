import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import { webuiPrefix } from './src/lib/constants'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const shouldProxy = env.VITE_API_PROXY === 'true'
  const apiEndpoints = env.VITE_API_ENDPOINTS?.split(',') || []
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:9621'

  const proxyConfig = shouldProxy && apiEndpoints.length
    ? Object.fromEntries(
        apiEndpoints.map(endpoint => [
          endpoint,
          {
            target: backendUrl,
            changeOrigin: true,
            rewrite:
              endpoint === '/api'
                ? (path: any) => path.replace(/^\/api/, '')
                : endpoint === '/docs' || endpoint === '/openapi.json'
                ? (path: any) => path
                : undefined
          }
        ])
      )
    : {}

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    base: webuiPrefix,
    build: {
      outDir: path.resolve(__dirname, '../lightrag/api/webui'),
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'graph-vendor': ['sigma', 'graphology', '@react-sigma/core'],
            'ui-vendor': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-popover',
              '@radix-ui/react-select',
              '@radix-ui/react-tabs'
            ],
            'utils-vendor': [
              'axios',
              'i18next',
              'zustand',
              'clsx',
              'tailwind-merge'
            ],
            'feature-graph': ['./src/features/GraphViewer'],
            'feature-documents': ['./src/features/DocumentManager'],
            'feature-retrieval': ['./src/features/RetrievalTesting'],
            'mermaid-vendor': ['mermaid'],
            'markdown-vendor': [
              'react-markdown',
              'rehype-react',
              'remark-gfm',
              'remark-math',
              'react-syntax-highlighter'
            ]
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    },
    server: {
      proxy: proxyConfig
    }
  }
})



// import { defineConfig } from 'vite'
// import path from 'path'
// import { webuiPrefix } from '@/lib/constants'
// import react from '@vitejs/plugin-react-swc'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src')
//     }
//   },
//   // base: import.meta.env.VITE_BASE_URL || '/webui/',
//   base: webuiPrefix,
//   build: {
//     outDir: path.resolve(__dirname, '../lightrag/api/webui'),
//     emptyOutDir: true,
//     rollupOptions: {
//       output: {
//         // Manual chunking strategy
//         manualChunks: {
//           // Group React-related libraries into one chunk
//           'react-vendor': ['react', 'react-dom', 'react-router-dom'],
//           // Group graph visualization libraries into one chunk
//           'graph-vendor': ['sigma', 'graphology', '@react-sigma/core'],
//           // Group UI component libraries into one chunk
//           'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-select', '@radix-ui/react-tabs'],
//           // Group utility libraries into one chunk
//           'utils-vendor': ['axios', 'i18next', 'zustand', 'clsx', 'tailwind-merge'],
//           // Separate feature modules
//           'feature-graph': ['./src/features/GraphViewer'],
//           'feature-documents': ['./src/features/DocumentManager'],
//           'feature-retrieval': ['./src/features/RetrievalTesting'],

//           // Mermaid-related modules
//           'mermaid-vendor': ['mermaid'],

//           // Markdown-related modules
//           'markdown-vendor': [
//             'react-markdown',
//             'rehype-react',
//             'remark-gfm',
//             'remark-math',
//             'react-syntax-highlighter'
//           ]
//         },
//         // Ensure consistent chunk naming format
//         chunkFileNames: 'assets/[name]-[hash].js',
//         // Entry file naming format
//         entryFileNames: 'assets/[name]-[hash].js',
//         // Asset file naming format
//         assetFileNames: 'assets/[name]-[hash].[ext]'
//       }
//     }
//   },
//   server: {
//     proxy: import.meta.env.VITE_API_PROXY === 'true' && import.meta.env.VITE_API_ENDPOINTS ?
//       Object.fromEntries(
//         import.meta.env.VITE_API_ENDPOINTS.split(',').map(endpoint => [
//           endpoint,
//           {
//             target: import.meta.env.VITE_BACKEND_URL || 'http://localhost:9621',
//             changeOrigin: true,
//             rewrite: endpoint === '/api' ?
//               (path) => path.replace(/^\/api/, '') :
//               endpoint === '/docs' || endpoint === '/openapi.json' ?
//                 (path) => path : undefined
//           }
//         ])
//       ) : {}
//   }
// })
