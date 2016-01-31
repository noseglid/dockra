import { app, BrowserWindow, Menu } from 'electron';
import { buildMenu } from './menu';

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

  Menu.setApplicationMenu(buildMenu(app));

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
