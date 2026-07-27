@echo off
cd /d "%~dp0"
bun install --frozen-lockfile
bun run build
