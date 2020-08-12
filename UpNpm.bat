@echo off  & (for /f "delims=^" %%i in ('npm outdated --parseable --depth=0') do (
for /f "delims=:" %%i in ("%%~ni") do (npm i %%i@latest)
))& pause