module.exports = {
  /*配置开发和生产环境下的日志级别*/
  'fdp-logger': {
    'logs-path': 'logs', /*日志的存放目录，默认为/logs目录*/
    /**
     *开发模式和生产模式下的业务日志级别，级别由高到低为：
     *error, warn, info, verbose, debug, silly
     *详情性查看: https://github.com/winstonjs/winston
     */
    'level-development': 'debug',
    'level-production': 'error'
  }
}