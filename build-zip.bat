@echo off
REM === Build Chrome extension zip archive ===
REM Includes: all git-tracked files (if available) + single image "images/logo.png"
REM Archive name: <name>-<version>.zip (from manifest.json)

setlocal EnableExtensions EnableDelayedExpansion

REM --- read manifest.json fields using PowerShell ---
for /f "delims=" %%i in ('powershell -NoProfile -Command ^
  "(Get-Content manifest.json -Raw | ConvertFrom-Json).version"') do set "VERSION=%%i"

for /f "delims=" %%i in ('powershell -NoProfile -Command ^
  "((Get-Content manifest.json -Raw | ConvertFrom-Json).name -replace '[^A-Za-z0-9\- ]','').Trim() -replace '\s+','-'"') do set "NAME=%%i"

if not defined VERSION (
  echo manifest.json not found or version missing.
  pause
  exit /b 1
)

set "ZIPNAME=%NAME%-%VERSION%.zip"
set "STAGING=dist_staging"

REM --- prepare staging folder ---
if exist "%STAGING%" rmdir /s /q "%STAGING%"
mkdir "%STAGING%"

REM --- detect git availability ---
where git >nul 2>&1
if %errorlevel%==0 (
  REM --- copy git-tracked files preserving directory structure ---
  for /f "usebackq delims=" %%F in (`git ls-files`) do (
    set "SRC=%%F"
    set "DEST=%STAGING%\%%F"
    call :CopyPreserve
  )
) else (
  echo Git not found. Fallback: copy common extension files.
  for /r %%F in (*.json *.html *.js *.css *.svg *.png *.jpg *.jpeg *.md) do (
    REM make path relative to root
    set "REL=%%F"
    set "REL=!REL:%CD%\=!"
    if "!REL:~0,1!"=="\" set "REL=!REL:~1!"
    set "SRC=%%F"
    set "DEST=%STAGING%\!REL!"
    call :CopyPreserve
  )
)

REM --- always include only images/logo.png (instead of the whole folder) ---
if exist "images\logo.png" (
  call :EnsureDir "%STAGING%\images\logo.png"
  echo [COPY] "images\logo.png" ^> "%STAGING%\images\logo.png"
  copy /y "images\logo.png" "%STAGING%\images\logo.png" >nul 2>nul && set /a COPIED+=1 || (
    echo [ERROR] copy failed: images\logo.png
    set /a ERRORS+=1
  )
) else (
  echo [WARN] images\logo.png not found
)

REM --- create zip via PowerShell ---
if exist "%ZIPNAME%" del "%ZIPNAME%"
powershell -NoProfile -Command "Compress-Archive -Path '%STAGING%\*' -DestinationPath '%ZIPNAME%'"

REM --- cleanup ---
rmdir /s /q "%STAGING%"

echo.
echo Archive created: %ZIPNAME%
pause
exit /b 0

:CopyPreserve
REM Ensure destination directory exists, then copy file
set "D=!DEST!"
for %%P in ("!D!") do (
  if not exist "%%~dpP" mkdir "%%~dpP"
)
copy /y "!SRC!" "!DEST!" >nul
exit /b
