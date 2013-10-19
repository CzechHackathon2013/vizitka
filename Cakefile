{spawn, exec} = require 'child_process'
{log, error} = console; print = log

run = (cmd, cb) ->
  child = exec cmd
  child.stdout.pipe process.stdout, end: false
  child.stderr.pipe process.stderr, end: false
  child.on 'exit', (code) -> 
    if cb? and not code
      cb(code)
    else
      process.exit code

shell = (cmds, cb) ->
  cmds = [cmds] if Object::toString.apply(cmds) isnt '[object Array]'
  exec cmds.join(' && '), (err, stdout, stderr) ->
    print trimStdout if trimStdout = stdout.trim()
    error stderr.trim() if err
    cb() if cb

local_prod_env      = "NODE_ENV='production'  PORT=9100 DOMAIN='parsers.local' "
dev_environment     = "NODE_ENV='development' PORT=9100 DOMAIN='parsers.local' "
test_environment    = "NODE_ENV='development' PORT=9190 DOMAIN='parsers.local' "
debug_environment   = "#{dev_environment}DEBUG=1 "

task 'run', 'Run as a production version', ->
  run local_prod_env + './node_modules/.bin/coffee app.coffee'

task 'develop', 'Run the dev version using nodemon, build public js files', ->
  run './node_modules/.bin/coffee --compile --output public/js/ --watch assets/coffee/'
  run dev_environment + './node_modules/.bin/nodemon --watch app.coffee --watch lib --watch routes app.coffee'

task 'debug', 'Run the debug version using nodemon', ->
  run debug_environment + './node_modules/.bin/coffee --nodejs --debug app.coffee'

task 'init', 'Install/Update everything, reset database', ->
  invoke 'init:packages', ->
    invoke 'init:db'

task 'init:packages', 'Install/Update everything', ->
  run 'npm install && npm prune && npm update && npm update -g coffee-script && npm rebuild', ->
    run 'git submodule init && git submodule update'

task 'init:db', 'Initialize database from fixture', ->
  # nothing

task 'test', 'Run all tests', ->
  run test_environment + './node_modules/.bin/mocha --compilers coffee:coffee-script --colors --reporter spec --timeout 60000 test/unit/*-test.coffee test/integration/*-test.coffee'

task 'test:watch', 'Run all tests', ->
  run test_environment + './node_modules/.bin/mocha --watch --no-animations --compilers coffee:coffee-script --colors --reporter landing --timeout 60000 test/unit/*-test.coffee test/integration/*-test.coffee'

task 'test:unit', 'Run unit tests', ->
  run test_environment + './node_modules/.bin/mocha --compilers coffee:coffee-script --colors --reporter spec --timeout 3000 test/unit/*-test.coffee'

task 'test:integration', 'Run integration tests', ->
  run test_environment + './node_modules/.bin/mocha --compilers coffee:coffee-script --colors --reporter spec --timeout 30000 test/integration/*-test.coffee'
