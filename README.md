# Browse Buddy

## Install

```bash
npm i
```

## Start in Web mode

```bash
npm run dev
```

## Start in Electron mode

### Linux users

```bash
npm run app:preview
```

### Windows users

- Change settings in the .env file

From EXEC=./resources/chrome-linux/chrome to EXEC=./resources/chrome-win/chrome.exe

```bash
npm run app:preview
```

# Build

- Required chromium
- Extract .zip files and copy the folder to the resources path project
- For [Windows](https://download-chromium.appspot.com/dl/Win_x64?type=snapshots)
- For [Linux](https://download-chromium.appspot.com/dl/Linux_x64?type=snapshots)

## Build on Windows

```bash
npm run release-win
```

portable mode

```bash
npm run release-win-p
```

## Build on Linux

```bash
npm run release-linux
```

## Author

- Charles Lana

## Frameworks

- Vite
- Vue3
- Electron
- Typescript
- Puppeteer
