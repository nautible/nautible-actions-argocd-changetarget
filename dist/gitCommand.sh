#!/bin/bash

git config --global push.default current
git config user.name github-actions[bot]
git config user.email github-actions[bot]@users.noreply.github.com
git add .
git commit -m "update targetRevision"
git push