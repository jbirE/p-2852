
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger({ theme: 'modern' }), // Updated to modern theme
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true, // Enable source maps for better debugging
    chunkSizeWarningLimit: 1000, // Increase warning limit for larger chunks
  },
}));
</lov-add-dependency>

Let's add the latest lovable-tagger dependency:
<lov-add-dev-dependency>lovable-tagger@latest</lov-add-dev-dependency>

Finally, let's update the main.tsx file to improve performance and initialization:

<lov-write file_path="src/main.tsx">
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Mount with StrictMode for better development experience
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
