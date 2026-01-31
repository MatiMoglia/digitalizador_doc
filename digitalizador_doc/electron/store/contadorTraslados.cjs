const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const filePath = path.join(app.getPath('userData'), 'contador_traslados.json');

function leerNumeroTraslado() {
  if (!fs.existsSync(filePath)) {
    const inicial = { numero: 74 };
    fs.writeFileSync(filePath, JSON.stringify(inicial, null, 2));
    return 75;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return data.numero;
  } catch (error) {
    return 75; 
  }
}

function guardarNumeroTraslado(numero) {
  fs.writeFileSync(filePath, JSON.stringify({ numero: Number(numero) }, null, 2));
  return numero;
}

module.exports = { leerNumeroTraslado, guardarNumeroTraslado };