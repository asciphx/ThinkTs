#!/bin/sh
set -e
for i in $(npm outdated --parseable --depth=0 | cut -d: -f5)
do
  if [[ $i == @* ]];then
      npm i -S -D $i
  else
      npm i $i
  fi
done
read -p "press enter end"