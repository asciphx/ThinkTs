#!/bin/sh
set -e
for i in $(npm -g outdated --parseable --depth=0 | cut -d: -f2)
do
    npm -g install "$i"
done