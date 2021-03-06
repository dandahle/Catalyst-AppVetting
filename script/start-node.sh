#! /bin/bash

cd "$(dirname "$0")/.."
AVT_PARENT_DIR=/usr/src
BIN_PATH=./node_modules/.bin

if [ -x "$(command -v sudo)" ]; then
  SUDO_CMD=sudo
fi

$SUDO_CMD $BIN_PATH/forever start -o $AVT_PARENT_DIR/logs/server.log -e $AVT_PARENT_DIR/logs/server.log ./bin/www
# $BIN_PATH/forever logs 0 -f