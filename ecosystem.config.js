module.exports = {
  apps: [
    {
      name: "frontend",
      script: "./app/server.js", // Run server.js directly
      env: {
        NODE_ENV: "production",
      },
      watch: false,
      error_file: "./logs/frontend-err.log",
      out_file: "./logs/frontend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm Z",
    },
    {
      name: "backend",
      cwd: "./api",
      script: "node",
      args: "dist/server.js", // Run compiled API
      env: {
        NODE_ENV: "production",
      },
      watch: false,
      error_file: "./logs/backend-err.log",
      out_file: "./logs/backend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm Z",
    },
  ],
};
