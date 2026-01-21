const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const { generarConstanciaPDF } = require('./pdf/constanciaServ.cjs')
const { generarSolicitudSepelio} = require('./pdf/solicitudSepelio.cjs')
const { leerNumero, guardarNumero } = require('./store/contador.cjs')
const { generarNotaDiarioPDF } = require('./pdf/notaDiario.cjs') 
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.loadURL('http://localhost:5173')
}

ipcMain.handle('generar-constancia', async (_, data) => {
  const filePath = await generarConstanciaPDF(data)
  shell.openPath(filePath)
  return filePath
})
ipcMain.handle('generar-solicitud-sepelio', async (_, data) => {
  const filePath = await generarSolicitudSepelio(data)
  shell.openPath(filePath)
  return filePath
})
ipcMain.handle('generar-nota-diario', async (_, data) => {
  const filePath = await generarNotaDiarioPDF(data)
  shell.openPath(filePath)
  return filePath
})

ipcMain.handle('obtener-numero', () => {
  return leerNumero()
})
ipcMain.handle('guardar-numero', (_, numero) => {
  guardarNumero(numero)
})
app.whenReady().then(createWindow)