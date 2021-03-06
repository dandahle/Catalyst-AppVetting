#! /bin/bash

set -e
cd "$(dirname "$0")/.."
TITLE="\e[96mInitialization Script for Catalyst AppVetting Tool v0.2.0 by Rohin Adalja\e[0m"
SETUP="\n\e[93mINIT\e[0m"

echo -e "\n$TITLE"
echo -e "$SETUP: Running in $(pwd)"

./script/init-install.sh
./script/init-configure.sh
reset
sudo bash ./script/init-setup.sh