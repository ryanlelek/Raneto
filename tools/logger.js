var log4js = require('log4js');
log4js.configure('./tools/log4js.json',{});
var logger = log4js.getLogger('z-seek');

exports.info = function (message) {
    console.log(message);
    logger.info(message);
};

exports.debug = function (message) {
    console.log(message);
    logger.debug(message);
};

exports.trace = function (message) {
    console.log(message);
    logger.trace(message);
};

exports.warn = function (message) {
    console.log(message);
    logger.warn(message);
};

exports.error = function (message) {
    console.log(message);
    logger.error(message);
};

exports.fatal = function (message) {
    console.log(message);
    logger.fatal(message);
};