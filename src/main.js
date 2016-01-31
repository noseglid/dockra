import { app, BrowserWindow } from 'electron';

let mainWindow;

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    title: 'Dockra',
    width: 1600,
    height: 1200
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
