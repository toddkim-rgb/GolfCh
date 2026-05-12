#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo '{"async": true, "asyncTimeout": 300000}'

# 의존성 설치
cd "$CLAUDE_PROJECT_DIR"
npm install

# Vite 개발 서버 백그라운드 실행
nohup npm run dev > /tmp/vite-dev.log 2>&1 &
echo "Vite dev server started (PID $!)"
