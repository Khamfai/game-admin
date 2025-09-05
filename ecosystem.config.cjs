module.exports = {
  apps: [
    {
      name: 'game-web-admin',
      script: 'server.mjs',
      instances: 1,
      instance_var: 'INSTANCE_ID',
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      merge_logs: true,
      max_memory_restart: '1G',
      error_file: 'logs/error.log',
      ignore_watch: ['logs', 'node_modules'],
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
