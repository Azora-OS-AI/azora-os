;
; AZORA IDE - NSIS INSTALLER SCRIPT FOR WINDOWS
; Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
;

!include "MUI2.nsh"
!include "FileFunc.nsh"

; Application information
!define APP_NAME "Azora IDE"
!define APP_VERSION "1.0.0"
!define APP_PUBLISHER "Azora ES (Pty) Ltd"
!define APP_URL "https://azora.world"
!define APP_EXE "azora-ide.exe"

; Installer settings
Name "${APP_NAME}"
OutFile "azora-ide-setup-${APP_VERSION}.exe"
InstallDir "$PROGRAMFILES64\${APP_NAME}"
InstallDirRegKey HKLM "Software\${APP_NAME}" "Install_Dir"
RequestExecutionLevel admin

; Modern UI Configuration
!define MUI_ABORTWARNING
!define MUI_ICON "assets\icon.ico"
!define MUI_UNICON "assets\icon.ico"
!define MUI_WELCOMEFINISHPAGE_BITMAP "assets\wizard.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "assets\wizard.bmp"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; Languages
!insertmacro MUI_LANGUAGE "English"

; Installer sections
Section "Azora IDE (Required)" SecCore
  SectionIn RO
  
  SetOutPath "$INSTDIR"
  
  ; Application files
  File /r "dist\*.*"
  
  ; Write registry keys
  WriteRegStr HKLM "Software\${APP_NAME}" "Install_Dir" "$INSTDIR"
  WriteRegStr HKLM "Software\${APP_NAME}" "Version" "${APP_VERSION}"
  
  ; Write uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  ; Add to Programs and Features
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayName" "${APP_NAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayIcon" '"$INSTDIR\${APP_EXE}"'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "Publisher" "${APP_PUBLISHER}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayVersion" "${APP_VERSION}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "URLInfoAbout" "${APP_URL}"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "NoRepair" 1
  
SectionEnd

Section "Desktop Shortcut" SecDesktop
  CreateShortcut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}" "" "$INSTDIR\${APP_EXE}" 0
SectionEnd

Section "Start Menu Shortcuts" SecStartMenu
  CreateDirectory "$SMPROGRAMS\${APP_NAME}"
  CreateShortcut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}" "" "$INSTDIR\${APP_EXE}" 0
  CreateShortcut "$SMPROGRAMS\${APP_NAME}\Uninstall.lnk" "$INSTDIR\Uninstall.exe" "" "$INSTDIR\Uninstall.exe" 0
SectionEnd

Section "File Associations" SecFileAssoc
  ; Register file associations for common programming languages
  WriteRegStr HKCR ".ts" "" "AzoraIDE.TypeScript"
  WriteRegStr HKCR "AzoraIDE.TypeScript" "" "TypeScript File"
  WriteRegStr HKCR "AzoraIDE.TypeScript\DefaultIcon" "" "$INSTDIR\${APP_EXE},0"
  WriteRegStr HKCR "AzoraIDE.TypeScript\shell\open\command" "" '"$INSTDIR\${APP_EXE}" "%1"'
  
  WriteRegStr HKCR ".tsx" "" "AzoraIDE.TSX"
  WriteRegStr HKCR "AzoraIDE.TSX" "" "TypeScript React File"
  WriteRegStr HKCR "AzoraIDE.TSX\DefaultIcon" "" "$INSTDIR\${APP_EXE},0"
  WriteRegStr HKCR "AzoraIDE.TSX\shell\open\command" "" '"$INSTDIR\${APP_EXE}" "%1"'
  
  WriteRegStr HKCR ".js" "" "AzoraIDE.JavaScript"
  WriteRegStr HKCR "AzoraIDE.JavaScript" "" "JavaScript File"
  WriteRegStr HKCR "AzoraIDE.JavaScript\DefaultIcon" "" "$INSTDIR\${APP_EXE},0"
  WriteRegStr HKCR "AzoraIDE.JavaScript\shell\open\command" "" '"$INSTDIR\${APP_EXE}" "%1"'
  
  WriteRegStr HKCR ".jsx" "" "AzoraIDE.JSX"
  WriteRegStr HKCR "AzoraIDE.JSX" "" "JavaScript React File"
  WriteRegStr HKCR "AzoraIDE.JSX\DefaultIcon" "" "$INSTDIR\${APP_EXE},0"
  WriteRegStr HKCR "AzoraIDE.JSX\shell\open\command" "" '"$INSTDIR\${APP_EXE}" "%1"'
  
  WriteRegStr HKCR ".py" "" "AzoraIDE.Python"
  WriteRegStr HKCR "AzoraIDE.Python" "" "Python File"
  WriteRegStr HKCR "AzoraIDE.Python\DefaultIcon" "" "$INSTDIR\${APP_EXE},0"
  WriteRegStr HKCR "AzoraIDE.Python\shell\open\command" "" '"$INSTDIR\${APP_EXE}" "%1"'
SectionEnd

Section "Add to PATH" SecPath
  ; Add Azora IDE to system PATH
  Push "$INSTDIR"
  Call AddToPath
SectionEnd

; Section descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SecCore} "Core Azora IDE application files (required)"
  !insertmacro MUI_DESCRIPTION_TEXT ${SecDesktop} "Create a desktop shortcut"
  !insertmacro MUI_DESCRIPTION_TEXT ${SecStartMenu} "Create Start Menu shortcuts"
  !insertmacro MUI_DESCRIPTION_TEXT ${SecFileAssoc} "Associate programming files with Azora IDE"
  !insertmacro MUI_DESCRIPTION_TEXT ${SecPath} "Add Azora IDE to system PATH"
!insertmacro MUI_FUNCTION_DESCRIPTION_END

; Uninstaller section
Section "Uninstall"
  ; Remove files
  Delete "$INSTDIR\Uninstall.exe"
  RMDir /r "$INSTDIR"
  
  ; Remove shortcuts
  Delete "$DESKTOP\${APP_NAME}.lnk"
  RMDir /r "$SMPROGRAMS\${APP_NAME}"
  
  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}"
  DeleteRegKey HKLM "Software\${APP_NAME}"
  
  ; Remove file associations
  DeleteRegKey HKCR ".ts"
  DeleteRegKey HKCR "AzoraIDE.TypeScript"
  DeleteRegKey HKCR ".tsx"
  DeleteRegKey HKCR "AzoraIDE.TSX"
  DeleteRegKey HKCR ".js"
  DeleteRegKey HKCR "AzoraIDE.JavaScript"
  DeleteRegKey HKCR ".jsx"
  DeleteRegKey HKCR "AzoraIDE.JSX"
  DeleteRegKey HKCR ".py"
  DeleteRegKey HKCR "AzoraIDE.Python"
  
  ; Remove from PATH
  Push "$INSTDIR"
  Call un.RemoveFromPath
SectionEnd

; Helper functions
Function AddToPath
  Exch $0
  Push $1
  Push $2
  Push $3
  
  Call IsNT
  Pop $1
  
  StrCmp $1 1 AddToPath_NT
    ; Windows 9x
    Goto AddToPath_done
  
  AddToPath_NT:
    ReadRegStr $1 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "PATH"
    StrCpy $2 $1 1 -1
    StrCmp $2 ";" 0 +2
      StrCpy $1 $1 -1
    
    StrCmp $1 "" AddToPath_NTdoIt
      StrCpy $0 "$1;$0"
    
    AddToPath_NTdoIt:
      WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "PATH" $0
      SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
  
  AddToPath_done:
    Pop $3
    Pop $2
    Pop $1
    Pop $0
FunctionEnd

Function un.RemoveFromPath
  Exch $0
  Push $1
  Push $2
  Push $3
  Push $4
  Push $5
  Push $6
  
  Call un.IsNT
  Pop $1
  
  StrCmp $1 1 unRemoveFromPath_NT
    ; Windows 9x
    Goto unRemoveFromPath_done
  
  unRemoveFromPath_NT:
    ReadRegStr $1 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "PATH"
    StrCpy $5 $1 1 -1
    StrCmp $5 ";" +2
      StrCpy $1 "$1;"
    
    Push $1
    Push "$0;"
    Call un.StrStr
    Pop $2
    StrCmp $2 "" unRemoveFromPath_done
      StrLen $3 "$0;"
      StrLen $4 $2
      IntOp $5 $1 - $4
      IntOp $5 $5 + $3
      StrCpy $5 $1 $5
      IntOp $6 $4 - $3
      StrCpy $6 $2 "" $6
      StrCpy $3 "$5$6"
      
      StrCpy $5 $3 1 -1
      StrCmp $5 ";" 0 +2
        StrCpy $3 $3 -1
      
      WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "PATH" $3
      SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
  
  unRemoveFromPath_done:
    Pop $6
    Pop $5
    Pop $4
    Pop $3
    Pop $2
    Pop $1
    Pop $0
FunctionEnd

Function IsNT
  Push $0
  ReadRegStr $0 HKLM "SOFTWARE\Microsoft\Windows NT\CurrentVersion" CurrentVersion
  StrCmp $0 "" 0 IsNT_yes
  ; Windows 9x
  StrCpy $0 0
  Goto IsNT_done
  IsNT_yes:
    StrCpy $0 1
  IsNT_done:
  Pop $0
FunctionEnd

Function un.IsNT
  Push $0
  ReadRegStr $0 HKLM "SOFTWARE\Microsoft\Windows NT\CurrentVersion" CurrentVersion
  StrCmp $0 "" 0 unIsNT_yes
  ; Windows 9x
  StrCpy $0 0
  Goto unIsNT_done
  unIsNT_yes:
    StrCpy $0 1
  unIsNT_done:
  Pop $0
FunctionEnd

Function un.StrStr
  Exch $R1 ; needle
  Exch
  Exch $R2 ; haystack
  Push $R3
  Push $R4
  Push $R5
  StrLen $R3 $R1
  StrCpy $R4 0
  loop:
    StrCpy $R5 $R2 $R3 $R4
    StrCmp $R5 $R1 done
    StrCmp $R5 "" done
    IntOp $R4 $R4 + 1
    Goto loop
  done:
  StrCpy $R1 $R2 "" $R4
  Pop $R5
  Pop $R4
  Pop $R3
  Pop $R2
  Exch $R1
FunctionEnd
