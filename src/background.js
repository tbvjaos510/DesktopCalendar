"use strict";
import {
  app,
  BrowserWindow,
  Menu,
  Notification,
  protocol,
  screen,
  Tray,
  ipcMain
} from "electron";
import fs from "fs";
import path from "path";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";

const isDevelopment = process.env.NODE_ENV !== "production";
process.chdir(path.dirname(process.execPath));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, startWindow;
let tray = null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

function createWindow() {
  openTray();
  // Create the browser window.
  mainWindow = new BrowserWindow({
    transparent: true,
    frame: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.setBounds(screen.getAllDisplays()[0].bounds);
  mainWindow.setIgnoreMouseEvents(true, { forward: true });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) {
      mainWindow.webContents.openDevTools({ mode: "undocked" });
    }
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    mainWindow.loadURL("app://./index.html");
  }

  DisableMinimize(mainWindow.getNativeWindowHandle());
  mainWindow.on("blur", () => {
    console.log("blured");
    mainWindow.setIgnoreMouseEvents(true, { forward: true });
  });
  mainWindow.on("close", e => {
    e.preventDefault();
    e.returnValue = false;
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function setupWindow() {
  fs.stat(app.getPath("userData") + "/calendar.json", (err, stat) => {
    if (err) {
      fs.mkdir(app.getPath("userData"), (errs, res) => {
        if (errs) console.log("fileExists");
        startWindow = new BrowserWindow({
          title: "Desktop Calendar 시작",
          webPreferences: {
            nodeIntegration: true
          }
        });
        if (process.env.WEBPACK_DEV_SERVER_URL) {
          startWindow.webContents.openDevTools({
            mode: "undocked"
          });
          startWindow.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}/#/setup`);
        } else {
          startWindow.loadURL("app://./index.html#setup");
        }
        startWindow.on("close", () => {
          startWindow = null;
        });
      });
    } else {
      createWindow();
    }
  });
}
app.requestSingleInstanceLock();
ipcMain.on("settingend", () => {
  createWindow();
  startWindow.destroy();
});
app.setAppUserModelId("com.sanghie.dcalendar");
// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    if (tray) {
      tray.destroy();
    }
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("ready", setupWindow);

function openTray() {
  tray = new Tray("/icon.png");
  tray.setToolTip("DeskTop Calendar");
  const contextMenu = [
    {
      label: "프로그램 종료",
      type: "normal",
      click: () => {
        tray.destroy();
        mainWindow.destroy();
      }
    },
    {
      label: "숨기기",
      type: "normal",
      click: () => {
        mainWindow.hide();
      }
    },
    {
      label: "보이기",
      type: "normal",
      click: () => {
        mainWindow.show();
      }
    }
  ];
  if (process.env.NODE_ENV === "development") {
    contextMenu.push({
      label: "Open DevTool",
      type: "normal",
      click: () => {
        mainWindow.webContents.openDevTools({
          mode: "undocked"
        });
      }
    });
  }
  tray.setContextMenu(Menu.buildFromTemplate(contextMenu));
  const notify = new Notification({
    title: "Desktop Calendar 실행 중",
    body: "Desktop Calendar가 실행 중입니다. 트레이 아이콘에서 볼 수 있습니다."
  });
  notify.show();
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
