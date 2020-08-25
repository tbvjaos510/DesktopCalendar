import { app, BrowserWindow } from "electron";
const path = require("path");

process.env.NODE_ENV = process.env.NODE_ENV || "production";
if (process.env.NODE_ENV === "production") {
  require("electron-serve")({ directory: "renderer" });
} else {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "../node_modules", ".bin", "electron.cmd"),
    ignored: "renderer",
    argv: ["build/main.js"],
  });
}

console.log("ENV", process.env.NODE_ENV);
let mainWindow: Electron.BrowserWindow | null;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    frame: true,
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL(`http://localhost:4000`);
  } else {
    mainWindow.loadURL(`app://-`);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);
app.allowRendererProcessReuse = true;
