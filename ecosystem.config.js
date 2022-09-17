module.exports = {
  apps: [
    {
      name: "app",
      script: "./app.js",
      // max_memory_restart: '3G',
      // instances: 3,
      // exec_mode: 'cluster',
      out_file: "../out.log",
      error_file: "../error.log",
      max_restart: 10,
      autorestart: true,
      restart_delay: 4000,
      wait_ready: true,

      env: {
        NODE_ENV: "production",
        PORT: 80,
        JWT_SECRET: "Dkfl",
      },
    },
  ],
  deploy: {
    production: {
      user: "root",
      host: "62.113.100.228",
      repo: "https://github.com/Nef007/follow",
      ref: "origin/master",
      path: "/home/follow",
      "post-deploy": " pm2 startOrRestart ecosystem.config.js",
      env: {
        NODE_ENV: "production",
      },
    },
  },
};
