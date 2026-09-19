@echo off
echo Starting OTT Platform...
cd /d "D:\AI Learing\OTT-Platform"
docker-compose up -d
echo.
echo Backend started!
echo.
cd frontend
start cmd /k "npm start"
echo.
echo Opening browser...
timeout /t 5
start http://localhost:4200
echo.
echo OTT Platform is running!
pause