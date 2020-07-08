#! /usr/bin/env bash

set -e

docker -v

echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin

NAME='textbook/salary-stats'
MAJOR="$(echo $TRAVIS_TAG | cut -d. -f1)"
MINOR="$(echo $TRAVIS_TAG | cut -d. -f2)"

for TAG in "$MAJOR" "$MAJOR.$MINOR" "$TRAVIS_TAG"; do
  docker tag "$NAME" "$NAME:$TAG"
done

docker push "$NAME"
