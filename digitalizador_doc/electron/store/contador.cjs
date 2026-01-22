const fs = require('fs')
const path = require('path')
const { app } = require('electron')

const filePath = path.join(app.getPath('userData'), 'contador.json')

function leerNumero() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ numero: 2737 }))
    return 2737
  }

  const data = JSON.parse(fs.readFileSync(filePath))
  return data.numero
}

function guardarNumero(numero) {
  fs.writeFileSync(filePath, JSON.stringify({ numero }, null, 2))
  return numero
}

module.exports = { leerNumero, guardarNumero }
