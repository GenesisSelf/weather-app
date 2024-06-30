module.exports = {
    testEnvironment: 'jsdom',
    roots: ['./'],
    testMatch: ['**/__tests__/**/*.test.tsx'], // pattern for test files
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    moduleNameMapper: {
        '^pages/(.*)$': '/pages/$1',
        '\\.css$': 'identity-obj-proxy',
    },
  };