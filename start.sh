#!/usr/bin/env bash
set -e

# Kill any processes on ports we need
fuser -k 3001/tcp 2>/dev/null || true
fuser -k 5000/tcp 2>/dev/null || true
sleep 1

ARTIFACTS=/home/runner/workspace/artifacts

echo "==> Installing dependencies..."
cd "$ARTIFACTS" && pnpm install --frozen-lockfile 2>&1 | tail -5

echo "==> Building API server..."
cd "$ARTIFACTS/api-server" && pnpm run build

echo "==> Starting API server on port 3001..."
cd "$ARTIFACTS" && PORT=3001 node --enable-source-maps api-server/dist/index.mjs &
API_PID=$!

# Give API a moment to bind
sleep 2

echo "==> Starting frontend on port 5000..."
cd "$ARTIFACTS/spacex-starlink" && pnpm run dev
