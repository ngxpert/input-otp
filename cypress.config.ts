import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'w78mnp',
  e2e: {
    baseUrl: 'http://localhost:4200',
    testIsolation: false,
  },
});
