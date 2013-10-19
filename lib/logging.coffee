winston     = require 'winston'
papertrail  = require('winston-papertrail').Papertrail

config      = require './config'


# Winston default loging levels: { silly: 0, debug: 1, verbose: 2, info: 3, warn: 4, error: 5 }
loggers = {}
transportsGroups = {}
log_level = process.env.LOG_LEVEL or if process.env.DEBUG then 'debug' else if process.env.NODE_ENV is 'development' then 'verbose' else 'info'


exports.getLogger = (name, options = {}) ->
  #console.error "__ getLogger creates new winston.Logger with name: \"#{name}\"" unless loggers[name]
  loggers[name] = new winston.Logger { transports: exports.getTransports(name, options) } unless loggers[name]
  return loggers[name]

exports.getTransports = (name, options = {}) ->
  #console.error "__ getTransports creates new winston.transports with name: \"#{name}\"" unless transportsGroups[name]
  unless transportsGroups[name]
    transportsGroups[name] = []
    transportsGroups[name].push new winston.transports.Console
      json:        options.json        or false
      level:       options.level       or log_level
      prettyPrint: options.prettyPrint or true
      colorize:    options.colorize    or true
      timestamp:   options.timestamp   or true
    if process.env.PAPERTRAIL
      transportsGroups[name].push new winston.transports.Papertrail
        level:       options.level       or log_level
        colorize:    options.colorize    or true
        host:        options.host        or 'logs.papertrailapp.com'
        port:        options.port        or process.env.PAPERTRAIL
  return transportsGroups[name]