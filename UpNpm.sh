#!/bin/sh
set -e
for i in $(npm outdated --parseable --depth=0 | cut -d: -f2)
do
    npm install "$i"
done