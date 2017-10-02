var assert = require('assert');
var should = require('should');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var muk = require('muk');

var indexPath = path.join(__dirname, '..', 'index.js');
var logger;

describe('swa-logger模块测试', function(){
  describe('模块加载', function(){

    beforeEach(function(){
      delete require.cache[indexPath];
      delete process.env.NODE_SWA_ROOT;
      delete process.env.NODE_ENV;

      fs.rmdir(path.join(__dirname, 'logs'));
      fs.rmdir(path.join(__dirname, '..', 'logs'));
    });

    it('开发环境: 配置文件不存在的时候不抛出异常', function(){
      process.env.NODE_SWA_ROOT = path.join(__dirname, '..');
      should.doesNotThrow(function(){
        logger = require('../index.js');
      });
      logger.should.has.keys('error','warn','info','verbose','debug','silly');
      logger.silly('logger.silly');
      logger.debug('logger.debug');
      logger.verbose('logger.verbose');
      logger.info('logger.info');
      logger.warn('logger.warn');
      logger.error('logger.error');
    });

    it('开发环境: 配置文件存在的时候不抛出异常', function(){
      process.env.NODE_SWA_ROOT = __dirname;
      assert.doesNotThrow(function(){
        require('../index.js');
        delete require.cache[indexPath];
        require('../index.js');
      });
    });

    it('生产环境: 配置文件不存在的时候不抛出异常', function(){
      process.env.NODE_ENV = 'production';
      assert.doesNotThrow(function(){
        logger = require('../index.js');
      });
    });

    it('生产环境: 创建目录失败时抛出异常', function(){
      process.env.NODE_ENV = 'production';
      process.env.NODE_SWA_ROOT = __dirname;

      muk(mkdirp, 'sync', function(){
        return false;
      });

      assert.doesNotThrow(function(){
        require('../index.js');
      });

      muk.restore();
    });
  });
});