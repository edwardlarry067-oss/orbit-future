#!/usr/bin/env bash
set -e

# Kill any processes on ports we need
fuser -k 3001/tcp 2>/dev/null || true
fuser -k 5000/tcp 2>/dev/null || true
sleep 1

cd /home/runner/workspace/artifacts

echo "==> Building API server..."
cd api-server && pnpm run build && cd ..

echo "==> Starting API server on port 3001..."
PORT=3001 node --enable-source-maps api-server/dist/index.mjs &
API_PID=$!

# Give API a moment to bind
sleep 2

echo "==> Starting frontend on port 5000..."
cd spacex-starlink && pnpm run dev
