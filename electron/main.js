const { app, BrowserWindow } = require('electron');
const path = require('path');

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