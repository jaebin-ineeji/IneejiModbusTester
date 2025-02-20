require('dotenv').config();

// 커스텀 토큰을 GH_TOKEN으로 설정
process.env.GH_TOKEN = process.env.MY_CUSTOM_TOKEN || process.env.GH_TOKEN;

const { execSync } = require('child_process');

// 명령행 인자 파싱
const arg = process.argv[2];

// copy-dist 실행
execSync('npm run copy-dist', { stdio: 'inherit' });

// 플랫폼별 빌드 명령어 실행
switch (arg) {
    case '--win':
        execSync(`electron-builder --win --publish always -c.publish.token=${process.env.GH_TOKEN}`, { stdio: 'inherit' });
        break;
    case '--mac':
        execSync(`electron-builder --mac --publish always -c.publish.token=${process.env.GH_TOKEN}`, { stdio: 'inherit' });
        break;
    case '--linux':
        execSync(`electron-builder --linux --publish always -c.publish.token=${process.env.GH_TOKEN}`, { stdio: 'inherit' });
        break;
    case '--all':
        execSync(`electron-builder --win --mac --linux --publish always -c.publish.token=${process.env.GH_TOKEN}`, { stdio: 'inherit' });
        break;
    default:
        console.error('Please specify platform: --win, --mac, --linux, or --all');
        process.exit(1);
}