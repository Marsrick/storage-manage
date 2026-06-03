@echo off
chcp 65001 >nul
setlocal

echo ============================================
echo   仓库管理系统 - 一键打包脚本
echo ============================================
echo.

:: ---- 配置区域（按需修改） ----
set "JAVA_HOME=D:\soft\develop\jdk\jdk21"
set "ANDROID_SDK=D:\soft\develop\android-sdk"

:: ---- Step 1: 同步 Web 资源到 Android 项目 ----
echo [1/4] 同步 Web 资源到 Android 项目...
call npx cap sync android
if %errorlevel% neq 0 (
    echo [错误] Capacitor sync 失败！
    goto :fail
)
echo [1/4] 同步完成 ✓
echo.

:: ---- Step 2: 写入 local.properties ----
echo [2/4] 配置 Android SDK 路径...
echo sdk.dir=%ANDROID_SDK:\=/% > android\local.properties
echo [2/4] 配置完成 ✓
echo.

:: ---- Step 3: Gradle 编译 APK ----
echo [3/4] 编译 Android APK（请稍候）...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo [错误] Gradle 编译失败！
    cd ..
    goto :fail
)
cd ..
echo [3/4] 编译完成 ✓
echo.

:: ---- Step 4: 复制 APK 到项目根目录 ----
echo [4/4] 复制 APK 到项目根目录...
set "APK_SRC=android\app\build_new\outputs\apk\debug\app-debug.apk"
if not exist "%APK_SRC%" (
    set "APK_SRC=android\app\build\outputs\apk\debug\app-debug.apk"
)
if exist "%APK_SRC%" (
    copy /Y "%APK_SRC%" storage-manage.apk >nul
    echo [4/4] APK 已输出到: storage-manage.apk ✓
) else (
    echo [警告] 未找到编译产物，请检查编译日志。
    goto :fail
)

echo.
echo ============================================
echo   打包成功！
echo   APK 文件: storage-manage.apk
echo ============================================
goto :end

:fail
echo.
echo ============================================
echo   打包失败，请检查上方错误信息。
echo ============================================
exit /b 1

:end
endlocal
