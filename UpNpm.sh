#!/bin/sh

set -e
for i in $(npm outdated --parseable --depth=0 | cut -d: -f5)
do
    npm install "$i"
done

read -p "press enter end"