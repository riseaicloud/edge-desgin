import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  external: ['react', 'react-dom', '@riseaicloud/ui', '@riseaicloud/tokens', '@xyflow/react'],
  clean: true,
})
