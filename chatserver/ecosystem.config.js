module.exports = {
  apps: [
    {
      name: 'gloomychatserver',
      script: 'src/server.ts',
      interpreter: 'ts-node',
      watch: true,
      exec_mode: 'cluster',
      instances: 'max',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};