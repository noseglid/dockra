'use babel';

import { app, BrowserWindow } from 'electron';

let mainWindow;

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    title: 'Dockra',
    width: 1280,
    height: 720
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
