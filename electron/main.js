const { app, BrowserWindow, dialog, Menu } = require('electron');
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

        // 메뉴 템플릿 정의
        const template = [
            {
                label: 'File',
                submenu: [
                    {
                        label: '설정',
                        accelerator: process.platform === 'darwin' ? 'Command+,' : 'Ctrl+,',
                        click: () => mainWindow.loadURL('/#/settings')
                    },
                    { type: 'separator' },
                    { role: 'quit', label: '종료' }
                ]
            },
            {
                label: 'View',
                submenu: [
                    { role: 'reload', label: '새로고침' },
                    { role: 'forceReload', label: '강제 새로고침' },
                    { type: 'separator' },
                    { role: 'toggleDevTools', label: '개발자 도구' },
                    { type: 'separator' },
                    { role: 'resetZoom', label: '확대/축소 초기화' },
                    { role: 'zoomIn', label: '확대' },
                    { role: 'zoomOut', label: '축소' },
                    { type: 'separator' },
                    { role: 'togglefullscreen', label: '전체 화면' }
                ]
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: '개발자 정보',
                        click: async () => {
                            await dialog.showMessageBox({
                                type: 'info',
                                title: '개발자 정보',
                                message: '인이지 모드버스 테스터',
                                detail: `개발: Jaebin Sa
                                        \n이메일: jaebin@ineeji.com
                                        \n회사: 인이지(Ineeji)
                                        \n웹사이트: https://ineeji.com
                                        \n버전: v${app.getVersion()}
                                        \n\n© ${new Date().getFullYear()} Ineeji. All rights reserved.`,
                                buttons: ['확인', '웹사이트 방문'],
                                defaultId: 0,
                                cancelId: 0
                            }).then(result => {
                                if (result.response === 1) {
                                    require('electron').shell.openExternal('https://ineeji.com');
                                }
                            });
                        }
                    },
                    {
                        label: '매뉴얼',
                        click: async () => {
                            await dialog.showMessageBox({
                                type: 'info',
                                title: '매뉴얼',
                                message: '인이지 모드버스 테스터 매뉴얼',
                                detail: '자세한 사용법은 매뉴얼을 참고해주세요.'
                            });
                        }
                    },
                    {
                        label: '버전 정보',
                        click: async () => {
                            await dialog.showMessageBox({
                                type: 'info',
                                title: '버전 정보',
                                message: `Ineeji Modbus Tester v${app.getVersion()}`,
                                detail: '© 2025 Ineeji. All rights reserved.',
                                buttons: ['확인']
                            });
                        }
                    },
                    { type: 'separator' },
                    {
                        label: '웹사이트',
                        click: async () => {
                            const { shell } = require('electron');
                            await shell.openExternal('https://ineeji.com');
                        }
                    }
                ]
            }
        ];
    
        // macOS의 경우 앱 이름 메뉴 추가
        if (process.platform === 'darwin') {
            template.unshift({
                label: app.getName(),
                submenu: [
                    { role: 'about', label: '인이지 모드버스 테스터 정보' },
                    { type: 'separator' },
                    { role: 'services', label: '서비스' },
                    { type: 'separator' },
                    { role: 'hide', label: '숨기기' },
                    { role: 'hideOthers', label: '다른 창 숨기기' },
                    { role: 'unhide', label: '모두 보기' },
                    { type: 'separator' },
                    { role: 'quit', label: '종료' }
                ]
            });
        }
    
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);

    checkForUpdates();
}

/** ✅ 업데이트 감지 및 알람 표시 기능 */
function checkForUpdates() {
    // 개발 환경에서는 업데이트 체크 건너뛰기
    if (!app.isPackaged || process.platform === 'darwin') {
        console.log('개발 환경에서는 업데이트를 체크하지 않습니다.');
        return;
    }
    
    autoUpdater.checkForUpdatesAndNotify(); // 업데이트 확인 및 알림


    // 업데이트를 찾았을 때
    autoUpdater.on('update-available', (info) => {
        dialog.showMessageBox({
            type: 'info',
            title: '업데이트 가능',
            message: `새 버전(${info.version})이 있습니다. 다운로드를 시작할까요?`,
            buttons: ['업데이트', '나중에'],
            defaultId: 0,
            cancelId: 1
        }).then(result => {
            if (result.response === 0) {
                autoUpdater.downloadUpdate();
            } else {
                // 나중에를 선택한 경우 업데이트 체크 중단
                autoUpdater.removeAllListeners('update-available');
                autoUpdater.removeAllListeners('download-progress');
                autoUpdater.removeAllListeners('update-downloaded');
            }
        });
    });

    // 다운로드 진행상황 표시
    autoUpdater.on('download-progress', (progressObj) => {
        mainWindow.webContents.send('update-progress', progressObj.percent);
    });

    // 업데이트 다운로드 완료 시
    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
            type: 'info',
            title: '업데이트 완료',
            message: '업데이트가 완료되었습니다. 앱을 재시작할까요?',
            buttons: ['지금 재시작', '나중에'],
            defaultId: 0,
            cancelId: 1
        }).then(result => {
            if (result.response === 0) {
                autoUpdater.quitAndInstall(false, true);
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