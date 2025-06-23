module.exports = {
  apps: [{
    name: 'erp-totalmotors',
    script: 'npm',
    args: 'start',
    cwd: '/app',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}