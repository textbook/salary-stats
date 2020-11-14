#! /usr/bin/env bash

set -euo pipefail

TAG="${TAG:-dev}"

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

ARCHIVE="dist-${TAG}.tar.gz"

pushd "$HERE/.."
  if [ ! -d node_modules/ ]; then
    npm ci
  fi

  if [ ! -d dist/ ]; then
    npm run build
  fi

  if [ ! -d dist-ghp/ ]; then
    npm run build -- \
      --baseHref='https://blog.jonrshar.pe/salary-stats' \
      --deployUrl='/salary-stats/' \
      --outputPath=dist-ghp/
  fi

  if [ ! -f "$ARCHIVE" ]; then
    tar -zcf "$ARCHIVE" dist/
  fi
popd
