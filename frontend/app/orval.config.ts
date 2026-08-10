import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: './openapi.json',
    output: {
      target: './src/api/generated.ts',
      client: 'react-query',
      mode: 'single',
      override: {
        mutator: {
          path: './src/api/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
