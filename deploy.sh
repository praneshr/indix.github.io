#!/bin/bash

set -e

bundle install
bundle exec middleman build --verbose