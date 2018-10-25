'use strict'

import electron, { Menu } from 'electron'
const { app, BrowserWindow, Tray, Notification } = electron

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let mainWindow
let tray = null
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  const screen = electron.screen
  mainWindow = new BrowserWindow({
    transparent: true,
    frame: false,
    skipTaskbar: true
  })
  mainWindow.setBounds(screen.getAllDisplays()[0].bounds)
  mainWindow.setIgnoreMouseEvents(true, { forward: true })
  mainWindow.loadURL(winURL)
  mainWindow.on('blur', () => {
    mainWindow.setIgnoreMouseEvents(true, { forward: true })
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.on('resize', () => {
    console.log('resized')
  })
}

app.on('ready', createWindow)
app.on('ready', () => {
  tray = new Tray(__static + '/icon.png')
  tray.setToolTip('DeskTop Calendar')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '프로그램 종료',
      type: 'normal',
      click: () => {
        tray.destroy()
        mainWindow.close()
      }
    },
    {
      label: 'Open DevTool',
      type: 'normal',
      click: () => {
        mainWindow.webContents.openDevTools({
          mode: 'undocked'
        })
      }
    },
    {
      label: '숨기기',
      type: 'normal',
      click: () => {
        mainWindow.hide()
      }
    },
    {
      label: '보이기',
      type: 'normal',
      click: () => {
        mainWindow.show()
      }
    }
  ])
  tray.setContextMenu(contextMenu)
  let notify = new Notification({
    title: 'Desktop Calendar 실행 중',
    body: 'Desktop Calendar가 실행 중입니다. 트레이 아이콘에서 볼 수 있습니다.'
  })
  notify.show()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (tray && tray.isDestroyed()) {
      tray.destroy()
    }
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
