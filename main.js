const electron = require('electron')
// Module to control application life.
const app = electron.app
const Menu = electron.Menu

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Define assets directory
const assetsDirectory = path.join(__dirname, 'img')

// Keep a global reference of the window and tray object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let tray

var os = require('os');
var isWin = os.platform() === "win32";
var isMac = os.platform() === "darwin";
var isLinux = os.platform() === "linux";

// Don't show the app in the doc
if(isMac) {
  app.dock.hide()
}

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  mainWindow.show()
  mainWindow.focus()
}

const checkForUpdates = () => {
  mainWindow.webContents.send('update', 'main');
}

// Creates tray image & toggles window on click
const createTray = () => {
  if(isMac) {
    tray = new electron.Tray(path.join(assetsDirectory, 'baseline_opacity_black_36dp.png'))
  } else {
    tray = new electron.Tray(path.join(assetsDirectory, 'baseline_opacity_white_36dp.png'))
  }
  tray.on('click', function (event) {
    toggleWindow()
  })
  const contextMenu = Menu.buildFromTemplate([
    {label: 'About', type: 'normal',  click: () => toggleWindow()},
    {label: 'Check for updates...', type: 'normal',  click: () => checkForUpdates()},
    {label: 'Exit', type: 'normal',  click: () => app.quit()}
  ])
  tray.setToolTip('Elderberry 1.0.0')
  tray.setContextMenu(contextMenu)
}



function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 400, 
    height: 400, 
    show: false, 
    frame: false, 
    fullscreenable: false, 
    resizable: false, 
    transparent: false,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }})

  // Hide the window when it loses focus
  mainWindow.on('blur', () => {
    if (!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide()
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  createTray()
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
