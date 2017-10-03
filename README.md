# swa-logger

## 功能描述
应用于swa平台或者其他任意场景的日志记录模块。该模块基于[**winston**](https://www.npmjs.com/package/winston)组件, 日志内容[按天](https://www.npmjs.com/package/winston-daily-rotate-file)分文件存储，日志文件的名称格式为`business.{level}.YYYY-MM-DD.log`。日志文件默认的存储位置为当前模块的 `/logs` 目录, 如果当前运行环境有 `NODE_SWA_ROOT` 环境变量，则日志的默认开发目录为 `{NODE_SWA_ROOT}/logs` 目录。

## 配置信息
    'swa-logger': {
      'logs-path': 'logs', //日志存放目录

      // 所有日志级别: error, warn, info, verbose, debug, silly
      'level-development': 'debug', //开发模式下的日志级别
      'level-production': 'warn'    //生产模式下的日志级别
    }    

## 使用方式

    var logger = require('swa-logger');
    logger.error('error level');
    logger.warn('warn level');
    logger.info('info level');
    logger.verbose('verbose level');
    logger.debug('debug level');
    logger.silly('silly level');