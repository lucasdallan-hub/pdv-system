' PDV System Setup Script for Windows
' Double-click this file to run setup

Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Get current directory
strCurrentPath = objFSO.GetParentFolderName(WScript.ScriptFullName)

' Display welcome message
objShell.Popup "PDV System Setup" & vbCrLf & vbCrLf & _
  "Este script vai:" & vbCrLf & _
  "1. Instalar dependências" & vbCrLf & _
  "2. Criar dados de teste" & vbCrLf & _
  "3. Iniciar servidores" & vbCrLf & vbCrLf & _
  "Clique OK para continuar...", , "PDV System Setup"

' Run the batch file
objShell.CurrentDirectory = strCurrentPath
objShell.Run "cmd.exe /k SETUP.bat", 1, False

WScript.Quit
