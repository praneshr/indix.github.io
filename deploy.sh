#!/bin/bash

set -e

DEPLOY_FOLDER="deploy/"

bundle install
bundle exec middleman build

if [ ! -d "$DEPLOY_FOLDER" ]; then
  git clone -b master git@github.com:ind9/ind9.github.io $DEPLOY_FOLDER
fi

cd $DEPLOY_FOLDER
git pull origin master
cp -r ../build/ .

git add -A
git commit -am "Site generated at $(date)"
git push origin master
