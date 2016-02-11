import { app, BrowserWindow, Menu } from 'electron';
import { buildMenu } from './menu';

let mainWindow;

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    title: 'Dockra',
    width: 1024,
    height: 576
  });

  Menu.setApplicationMenu(buildMenu(app));

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
