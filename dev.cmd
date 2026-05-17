@echo off
set "NODE_DIR=C:\Users\Louis\AppData\Local\nodejs-portable\node-v22.15.1-win-x64"
set "PATH=%NODE_DIR%;%PATH%"
echo Node.js pret : 
node --version
echo.
echo Demarrage UPFACE sur http://localhost:3000
echo.
npm run dev
