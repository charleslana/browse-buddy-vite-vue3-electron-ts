import { join } from 'path';

export function getAppIconPath() {
  let iconFileName = '';
  if (process.platform === 'linux') {
    iconFileName = 'icon256x.png';
  } else if (process.platform === 'win32') {
    iconFileName = 'icon256x.ico';
  }
  return join(__dirname, 'assets', 'images', iconFileName);
}
