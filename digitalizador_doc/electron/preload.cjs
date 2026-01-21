const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  generarConstancia: (data) => ipcRenderer.invoke("generar-constancia", data),
  generarSolicitudSepelio: (data) => ipcRenderer.invoke("generar-solicitud-sepelio", data),
  obtenerNumero: () => ipcRenderer.invoke("obtener-numero"),
  guardarNumero: (numero) => ipcRenderer.invoke("guardar-numero", numero),
  generarNotaDiarioPDF: (data) => ipcRenderer.invoke("generar-nota-diario", data),
});
