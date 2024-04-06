import { join } from 'path';

export function getAppIconPath() {
  let iconFileName = '';
  if (process.platform === 'linux') {
    iconFileName = 'icon-256x256.png';
  } else if (process.platform === 'win32') {
    iconFileName = 'icon-256x256.ico';
  }
  return join(__dirname, 'assets', iconFileName);
}
