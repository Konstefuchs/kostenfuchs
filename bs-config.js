module.exports = {
  proxy: 'localhost:8000',
  port: 3000,
  files: ['public/**/*', 'src/**/*'],
  open: true,
  reloadDelay: 100,
};
