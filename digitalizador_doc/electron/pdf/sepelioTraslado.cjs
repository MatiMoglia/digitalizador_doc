const { app } = require("electron");
const PdfPrinter = require("pdfmake/src/printer");
const fs = require("fs");
const path = require("path");

const fonts = {
  Times: {
    normal: "Times-Roman",
    bold: "Times-Bold",
    italics: "Times-Italic",
    bolditalics: "Times-BoldItalic",
  },
};

const printer = new PdfPrinter(fonts);

function downloadsDir() {
  return path.join(
    app.getPath("downloads"),
    "SistemaDigitalizacion",
    "Traslados",
  );
}

function formatearFecha(fecha) {
  if (!fecha) return "../../....";
  const [year, month, day] = fecha.split("-");
  return `${day}/${month}/${year}`;
}

function filaDatoPegado(label, value) {
  const valorTexto = String(value || "").toUpperCase();
  return {
    table: {
      widths: ["auto", "*"],
      body: [
        [
          {
            text: label,
            style: "labelItalic",
            italics: true,
            bold: true,
            border: [false, false, false, false],
          },
          {
            text: valorTexto,
            style: "inputText",
            margin: [5, 0, 0, 0],
            border: [false, false, false, false],
          },
        ],
      ],
    },
    layout: "noBorders",
    margin: [0, 12, 0, 0],
  };
}
async function generarSolicitudTrasladoPDF(data) {
  const outputDir = downloadsDir();
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const fileName = `Traslado_${data.nroDoc || Date.now()}.pdf`;
  const filePath = path.join(outputDir, fileName);
  const logoPath = path.join(__dirname, "assets", "logo.jpg");

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 80],
    defaultStyle: { font: "Times", fontSize: 13, lineHeight: 1.2 },

    content: [
      {
        columns: [
          { image: logoPath, width: 35 },
          {
            stack: [
              {
                text: "COOPERATIVA DE SERVICIOS PÚBLICOS\nDE PORTEÑA LTDA.",
                style: "headerMain",
              },
              {
                text: "Av. Simón Daniele 259 - 450000/450001 - 2415 PORTEÑA (Prov. Cba.)",
                style: "headerSub",
              },
            ],
            alignment: "center",
            width: "*",
            margin: [-40, 0, 0, 0],
          },
        ],
        margin: [0, 0, 0, 1],
      },
      {
        canvas: [
          { type: "line", x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 0.5 },
        ],
        margin: [0, 0, 0, 15],
      },

      {
        columns: [
          {
            text: "Solicitud de Servicio de Sepelio (Traslado)",
            style: "title",
            width: "*",
          },
          {
            text: [
              { text: "Nº  ", fontSize: 13 },
              { text: String(data.nroDoc || ""), fontSize: 14, bold: true },
            ],
            width: "auto",
            alignment: "right",
          },
        ],
        margin: [0, 0, 0, 25],
      },

      filaDatoPegado("Solicitante:", data.solicitante),
      filaDatoPegado("Fallecido:", data.nombreFallecido),
      filaDatoPegado("Lugar de salida:", data.salida),
      filaDatoPegado("Lugar de destino:", data.destino),
      filaDatoPegado("Total de kilómetros recorridos:", data.kmRecorridos),

      {
        table: {
          widths: ["auto", "auto"],
          body: [
            [
              {
                text: "Fecha del traslado:",
                style: "labelItalic",
                italics: true, 
                bold: true,
                border: [false, false, false, false],
              },
              {
                text: formatearFecha(data.fechaTraslado),
                style: "inputText",
                margin: [10, 0, 0, 0],
                border: [false, false, false, false],
              },
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 15, 0, 40],
      },
      {
        margin: [0, 80, 0, 0],
        columns: [
          {
            stack: [
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 0,
                    x2: 150,
                    y2: 0,
                    lineWidth: 0.5,
                  },
                ],
                alignment: "center",
              },
              { text: "Firma del Encargado", style: "signatureText" },
            ],
          },
          {
            stack: [
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 0,
                    x2: 150,
                    y2: 0,
                    lineWidth: 0.5,
                  },
                ],
                alignment: "center",
              },
              { text: "Firma del Solicitante", style: "signatureText" },
            ],
          },
        ],
      },
    ],

    footer: function () {
      return {
        stack: [
          {
            canvas: [
              { type: "rect", x: 40, y: 0, w: 515, h: 30, color: "#1a1a1a" },
            ],
          },
          {
            text: "GUARDIA TRASLADO SOCIAL: (03564) 15593560 - ADMINISTRACIÓN: (03564) 450000",
            color: "white",
            fontSize: 8,
            alignment: "center",
            relativePosition: { x: 0, y: -22 },
          },
        ],
      };
    },

    styles: {
      headerMain: { fontSize: 15, bold: true },
      headerSub: { fontSize: 11 },
      title: { fontSize: 16, bold: true, decoration: "underline" },
      label: { fontSize: 14, bold: true },
      inputText: { fontSize: 15, bold: false },
      signatureText: {
        fontSize: 12,
        bold: true,
        margin: [0, 8, 0, 0],
        alignment: "center",
      },
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(filePath));
  pdfDoc.end();

  return filePath;
}

module.exports = { generarSolicitudTrasladoPDF };
