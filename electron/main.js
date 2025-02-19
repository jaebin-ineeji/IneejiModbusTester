const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
require('dotenv').config();
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          webSecurity: false,
          webviewTag: true,
          devTools: true,
          enableRemoteModule: true,
          allowRunningInsecureContent: true
      }
    })

    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }

    // app.isPackaged로 개발/프로덕션 환경 구분
    const indexPath = app.isPackaged 
        ? path.join(__dirname, './dist/index.html')
        : path.resolve(__dirname, '../frontend/dist/index.html');
    
    console.log('Current directory:', __dirname);
    console.log('Loading file from:', indexPath);
    console.log('File exists:', require('fs').existsSync(indexPath));

    mainWindow.loadFile(indexPath).catch(err => {
      console.error('Failed to load file:', err);
    });

    mainWindow.maximize();

    // 에러 이벤트 리스너 추가
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load:', errorCode, errorDescription);
  });

    mainWindow.on('closed', () => {
        mainWindow = null;
    })

    checkForUpdates();
}

/** ✅ 업데이트 감지 및 알람 표시 기능 */
function checkForUpdates() {
    // 개발 환경에서는 업데이트 체크 건너뛰기
    if (!app.isPackaged) {
        console.log('개발 환경에서는 업데이트를 체크하지 않습니다.');
        return;
    }
    autoUpdater.setFeedURL({
        provider: 'github',
        owner: 'jaebin-ineeji',
        repo: 'IneejiModbusTester',
        private: true,
        token: process.env.GH_TOKEN  // 환경변수에서 토큰 가져오기
    });
    
    autoUpdater.autoDownload = true; // 자동 다운로드 활성화
    autoUpdater.checkForUpdatesAndNotify(); // 업데이트 확인 및 알림

    // 다운로드 진행상황 표시
    autoUpdater.on('download-progress', (progressObj) => {
        mainWindow.webContents.send('update-progress', progressObj.percent);
    });

    // 업데이트를 찾았을 때
    autoUpdater.on('update-available', () => {
        dialog.showMessageBox({
            type: 'info',
            title: '업데이트 가능',
            message: '새 버전이 있습니다. 다운로드를 시작합니다.',
            buttons: ['업데이트', '나중에']
        });
    });

    // 업데이트 다운로드 완료 시
    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
            type: 'info',
            title: '업데이트 완료',
            message: '업데이트가 완료되었습니다. 앱을 재시작할까요?',
            buttons: ['지금 재시작', '나중에'],
            defaultId: 0
        }).then(result => {
            if (result.response === 0) {
                autoUpdater.quitAndInstall();
            }
        });
    });

    // 업데이트 중 오류 발생 시
    autoUpdater.on('error', (error) => {
        dialog.showErrorBox('업데이트 오류', error == null ? '알 수 없는 오류' : error.toString());
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow(); // macOS 설정
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})