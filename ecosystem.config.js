module.exports = {
  apps: [{
    name: 'ERP-TOTALMOTORS-FRONTEND - PORT 3000',
    script: './node_modules/.bin/next',
    args: 'start',
    cwd: '/app',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/app/logs/err.log',
    out_file: '/app/logs/out.log',
    log_file: '/app/logs/combined.log',
    time: true
  }]
}