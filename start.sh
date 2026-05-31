#!/usr/bin/env bash
set -e

cd /home/runner/workspace/artifacts

echo "==> Building API server..."
cd api-server && pnpm run build && cd ..

echo "==> Starting API server on port 3001..."
PORT=3001 node --enable-source-maps api-server/dist/index.mjs &
API_PID=$!

echo "==> Starting frontend on port 5000..."
cd spacex-starlink && pnpm run dev
