const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");

const { generarConstanciaPDF } = require("./pdf/constanciaServ.cjs");
const { generarSolicitudSepelio } = require("./pdf/solicitudSepelio.cjs");
const { generarNotaDiarioPDF } = require("./pdf/notaDiario.cjs");
const { leerNumero, guardarNumero } = require("./store/contador.cjs");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  } else {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  }
}

ipcMain.handle("generar-constancia", async (event, data) => {
  try {
    const filePath = await generarConstanciaPDF(data);

    const openError = await shell.openPath(filePath);
    if (openError) {
      console.warn("No se pudo abrir el PDF:", openError);
    }
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      win.show();
      win.focus();
    }

    return filePath;
  } catch (err) {
    console.error("Error generando constancia PDF:", err);
    throw err; 
  }
});

ipcMain.handle("generar-solicitud-sepelio", async (event, data) => {
  try {
    const filePath = await generarSolicitudSepelio(data);

    const openError = await shell.openPath(filePath);
    if (openError) {
      console.warn("No se pudo abrir el PDF:", openError);
    }

    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      win.show();
      win.focus();
    }

    return filePath;
  } catch (err) {
    console.error("Error generando solicitud sepelio:", err);
    throw err;
  }
});

ipcMain.handle("generar-nota-diario", async (_, data) => {
  const filePath = await generarNotaDiarioPDF(data);
  shell.openPath(filePath);

  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    win.show();
    win.focus();
  }

  return filePath;
});

ipcMain.handle("obtener-numero", () => leerNumero());
ipcMain.handle("guardar-numero", (_, numero) => {
  return guardarNumero(numero);
});

app.whenReady().then(createWindow);
