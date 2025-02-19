여기 프로젝트의 빌드 방법을 문서로 정리해드리겠습니다:

# 프로젝트 빌드 가이드

## 1. 프로젝트 구조
```
remote_test_front/
├── frontend/         # React 프로젝트
└── electron/         # Electron 프로젝트
```

## 2. 웹 애플리케이션 빌드

### 2.1. 의존성 설치
```bash
cd frontend
npm install
```

### 2.2. 개발 모드 실행
```bash
npm run dev
```

### 2.3. 프로덕션 빌드
```bash
npm run build
```

## 3. Electron 애플리케이션 빌드

### 3.1. Electron 의존성 설치
```bash
cd electron
npm install
```

### 3.2. 프론트엔드 빌드
```bash
cd frontend
npm run build:electron  # ELECTRON_BUILD=true로 설정된 빌드
```

### 3.3. 빌드 파일 복사
```bash
cd electron
npm run copy-dist      # frontend/dist를 electron/dist로 복사
```

### 3.4. Electron 애플리케이션 빌드

#### Windows 빌드
```bash
npm run build:win
```

#### macOS 빌드
```bash
npm run build:mac
```

#### Linux 빌드
```bash
npm run build:linux
```

#### 모든 플랫폼 빌드
```bash
npm run build:all
```

## 4. 빌드 결과물

- 웹 빌드: `frontend/dist/` 디렉토리
- Electron 빌드: `electron/release/` 디렉토리
  - Windows: `.exe`, `.zip`
  - macOS: `.dmg`, `.zip`
  - Linux: `.AppImage`, `.deb`

## 5. 주의사항

1. Electron 빌드 전 반드시 프론트엔드를 `build:electron` 스크립트로 빌드해야 합니다.
2. 프론트엔드 라우팅은 `HashRouter`를 사용합니다 (`BrowserRouter` 대신).
3. 일렉트론 빌드 시 아이콘은 다음 위치에 있어야 합니다:
   - Windows: `electron/build/icon/ineeji_logo.ico`
   - macOS: `electron/build/icon/ineeji_logo.icns`
   - Linux: `electron/build/icon/ineeji_logo.png`

## 6. 개발 모드에서 Electron 실행
```bash
cd electron
npm start
```
