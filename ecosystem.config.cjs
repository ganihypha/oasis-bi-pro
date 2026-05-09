module.exports = {
  apps: [
    {
      name: 'oasis-bi-pro',
      script: 'npx',
      args: 'wrangler pages dev dist --d1=oasis-bi-pro-production --kv=OASIS_KV --r2=OASIS_R2 --local --ip 0.0.0.0 --port 3000',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
