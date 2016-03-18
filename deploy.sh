#!/bin/bash

set -e

DEPLOY_FOLDER="deploy/"

if [ ! -d "$DEPLOY_FOLDER" ]; then
  git clone -b master git@github.com:ind9/ind9.github.io $DEPLOY_FOLDER
fi

bundle install
bundle exec middleman build
cp -r build/ $DEPLOY_FOLDER

cd $DEPLOY_FOLDER

git add -A
git commit -am "Site generated at $(date)"
git push origin master
