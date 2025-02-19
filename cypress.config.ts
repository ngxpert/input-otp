import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'w78mnp',
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },

  e2e: {
    baseUrl: 'http://localhost:4200',
    testIsolation: false,
  },
});
