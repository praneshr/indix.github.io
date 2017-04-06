#!/bin/bash

set -ex

bundle install
bundle exec middleman build --verbose