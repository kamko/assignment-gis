#!/bin/sh

set -e

( cd be-app && npm run serve &)
http-server /fe-app/dist
wait