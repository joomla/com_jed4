#!/bin/sh

eval "$(ssh-agent -s)" >/dev/null
ssh-add ~/.ssh/id_rsa-stage-access-for-JED-CI >/dev/null 2>&1
cd /home/stageext/repositories/jed-dev
git checkout develop >/dev/null 2>&1
git pull >/dev/null
killall ssh-agent