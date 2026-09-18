// PM2 configuration for running Nitro server
module.exports = {
  apps: [
    {
      name: "nitro-server",
      script: ".output/server/index.mjs",
      // db/client.ts imports bun:sqlite, a Bun builtin — the server must run
      // under Bun, not PM2's default Node interpreter. "fork" (not
      // "cluster") because PM2's cluster mode relies on Node's cluster IPC,
      // which isn't a supported interpreter combination for Bun.
      interpreter: "bun",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        NITRO_PORT: 3000,
        NITRO_HOST: "127.0.0.1",
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
