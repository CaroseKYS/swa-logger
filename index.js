const winston = require('winston');
const rotate  = require('winston-daily-rotate-file');
const utils   = require('swa-utils');
const path    = require('path');
const fs      = require('fs');
const mkdirp  = require('mkdirp');

/*应用根路径*/
const rootDir    = process.env.NODE_SWA_ROOT || __dirname;
/*配置文件*/
const configFile = path.join(rootDir, "swa-conf.js");
/*服务器运行状态*/
const appEnv     = (process.env.NODE_ENV === 'production') ? 'production' : 'development';
/*开发模式下的日志级别*/
var levelDev;
/*生产模式下的日志级别*/
var levelPro;
/*日志存放路径*/
var logsPath;
/*日志配置对象*/
var jsonData;

/*判断配置文件是否存在*/
try{
  jsonData = require(configFile);
}catch(e){
  console.log(rootDir, '目录下不存在名为 swa-conf.js 的配置文件，业务日志选项采用默认方式处理。');
  jsonData = {};
}

/*赋予属性默认值*/
jsonData['swa-logger']                      = jsonData['swa-logger']                      || {};
jsonData['swa-logger']['level-development'] = jsonData['swa-logger']['level-development'] || 'debug';
jsonData['swa-logger']['level-production']  = jsonData['swa-logger']['level-production']  || 'warn' ;
jsonData['swa-logger']['logs-path']         = jsonData['swa-logger']['logs-path']         || 'logs' ;

/*设置日志级别以及日志存放路径*/
levelDev = utils.getJsonProp(jsonData, 'swa-logger.level-development');
levelPro = utils.getJsonProp(jsonData, 'swa-logger.level-production');
logsPath = utils.getJsonProp(jsonData, 'swa-logger.logs-path');

/*根据运行环境选择日志级别*/
var logLevel     = (appEnv === 'development') ? levelDev : levelPro;
/*确定日志存放位置*/
var logsRealPath = path.join(rootDir, logsPath);

/*创建日志输出目录*/
if(!fs.existsSync(logsRealPath)){
  if(!mkdirp.sync(logsRealPath)){
    logsRealPath = rootDir;
    console.log("创建日志输出目录失败，日志将存储在应用根目录下。");
  }
}

/*日志输出目标*/
var transports = [
  new (rotate)({/*任何情况下都出现的日志记录*/
    timestamp: getTimestamp,
    filename : path.join(logsRealPath, `business.${logLevel}.`),
    datePattern: 'yyyy-MM-dd.log',
    level: logLevel
  })
];

/*如果是开发环境，则同时将日志输出到控制台*/
if(appEnv === 'development'){
  transports.push(new (winston.transports.Console)({
    timestamp: getTimestamp,
    level: levelDev
  }));
}

var logger = new (winston.Logger)({
  transports: transports
});

console.log(`业务日志级别: ${logLevel}`);
console.log(`业务日志文件存放路径: ${logsRealPath}`);

function getTimestamp() {
  var now    = new Date();

  var year   = now.getFullYear();
  var month  = now.getFullYear() + 1;
  var day    = now.getDate();

  var hour   = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

module.exports = logger;