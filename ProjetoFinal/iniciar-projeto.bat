@echo off
setlocal
title Equipe AP - Inicializador
cd /d "%~dp0"

echo.
echo ========================================
echo          EQUIPE AP - INICIADOR
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 goto instalar_node

where npm >nul 2>&1
if errorlevel 1 goto instalar_node

goto instalar_dependencias

:instalar_node
echo Node.js nao foi encontrado.
echo Instalando a versao LTS...
echo.

where winget >nul 2>&1
if errorlevel 1 goto instalar_node_direto

winget install --id OpenJS.NodeJS.LTS --exact --accept-package-agreements --accept-source-agreements
if errorlevel 1 goto instalar_node_direto
goto atualizar_path

:instalar_node_direto
echo Instalacao pelo winget indisponivel. Baixando do site oficial...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $release=Invoke-RestMethod 'https://nodejs.org/dist/index.json' ^| Where-Object lts ^| Select-Object -First 1; $arch=if([Environment]::Is64BitOperatingSystem){'x64'}else{'x86'}; $file='node-'+$release.version+'-'+$arch+'.msi'; $url='https://nodejs.org/dist/'+$release.version+'/'+$file; $msi=Join-Path $env:TEMP $file; Invoke-WebRequest $url -OutFile $msi; Start-Process msiexec.exe -Verb RunAs -Wait -ArgumentList @('/i',$msi,'/passive','/norestart'); Remove-Item $msi -Force"
if errorlevel 1 goto erro_node

:atualizar_path
set "PATH=C:\Program Files\nodejs;%LOCALAPPDATA%\Programs\nodejs;%PATH%"
where node >nul 2>&1
if errorlevel 1 goto erro_node
where npm >nul 2>&1
if errorlevel 1 goto erro_node

:instalar_dependencias
set "NODE_EXE="
for /f "delims=" %%I in ('where node 2^>nul') do if not defined NODE_EXE set "NODE_EXE=%%I"
if not defined NODE_EXE goto erro_node

echo Instalando dependencias do projeto...
call npm install
if errorlevel 1 goto erro_npm

echo.
echo Iniciando o servidor...
start "Equipe AP - Servidor" /D "%~dp0" "%NODE_EXE%" server.js

echo Aguardando o sistema ficar disponivel...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; for($i=0;$i -lt 60;$i++){try{$r=Invoke-RestMethod 'http://localhost:3000/api/health' -TimeoutSec 1; if($r.sistema -eq 'equipe-ap' -and $r.status -eq 'ok'){exit 0}}catch{}; Start-Sleep -Seconds 1}; exit 1"
if errorlevel 1 goto erro_servidor

echo Abrindo o sistema no navegador...
start "" "http://localhost:3000"
exit /b 0

:erro_node
echo.
echo ERRO: nao foi possivel instalar ou localizar o Node.js.
echo Verifique sua conexao com a internet e tente novamente.
pause
exit /b 1

:erro_npm
echo.
echo ERRO: nao foi possivel instalar as dependencias do projeto.
pause
exit /b 1

:erro_servidor
echo.
echo ERRO: o servidor nao respondeu em http://localhost:3000.
echo Consulte a janela "Equipe AP - Servidor" para ver os detalhes.
pause
exit /b 1
