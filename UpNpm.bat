@echo off  & (for /f "delims=^" %%i in ('npm outdated --parseable --depth=0') do (
for /f "tokens=5 delims=:" %%i in ("%%i") do (echo %%i|findstr "^@"&&npm i -S -D %%i||npm i %%i)
))& pause