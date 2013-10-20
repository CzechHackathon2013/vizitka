# Good morning, everyone! How to run?

For development on your local machine, take the following steps:
* First you'll need to make sure your system has a c++ compiler. For OSX, XCode will work, for Ubuntu, the `build-essential` and `libssl-dev` packages work.
* install nvm `curl https://raw.github.com/creationix/nvm/master/install.sh | sh`
* use nvm to install node and npm `nvm install 0.10`
* install CoffeeScript `npm install -g coffee-script`
* add the following to `/etc/hosts`
    127.0.0.1       vizitka.local
* install and start memcached `brew install memcached` to store rendered pages
* in shell, type:
  - `cake init` to update all dependencies
  - `cake develop` and server is running at [vizitka.local:9200](http://vizitka.local:9200) as you edit your the code, the localhost server will automatically restart if your files change
