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
    "Declaraciones-Juradas",
  );
}

function formatearFechaSimple(fecha) {
  if (!fecha) return "";

  const [year, month, day] = fecha.split("-");
  return `${day}/${month}/${year}`;
}
function fechaLarga(fecha) {
  if (!fecha) return "";

  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const [year, month, day] = fecha.split("-");
  const diaLimpio = parseInt(day, 10);
  const nombreMes = meses[parseInt(month, 10) - 1];
  return `${diaLimpio} de ${nombreMes} de ${year}`;
}

function filaPuntos(label, value, widthLabel = "auto") {
  return {
    margin: [0, 5, 0, 0],
    columns: [
      {
        text: label,
        style: "label",
        width: widthLabel,
        bold: false,
      },
      {
        stack: [
          {
            text: (value || "").toUpperCase(),
            style: "inputText",
            margin: [5, 0, 0, 0],
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 2,
                x2: 495 - (widthLabel === "auto" ? 100 : widthLabel),
                y2: 2,
                lineWidth: 0.5,
                lineColor: "#aaaaaa",
                dash: { length: 1, space: 1 },
              },
            ],
          },
        ],
      },
    ],
  };
}

async function generarDeclaracion(data) {
  const outputDir = downloadsDir();
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const filePath = path.join(outputDir, `DJ_Cremacion_${Date.now()}.pdf`);

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [60, 30, 45, 30],
    defaultStyle: { font: "Times", fontSize: 10, lineHeight: 1.2 },
    content: [
      {
        columns: [
          {
            stack: [
              {
                text: "Pedro Bonzi 541 - Tacural (Santa Fe)",
                bold: true,
                fontSize: 7,
              },
              { text: "Tel.: (03493) 492156 - 492205", fontSize: 8 },
              { text: "e-mail: airesdepazcc@yahoo.com.ar", fontSize: 8 },
            ],
            width: "*",
          },
          {
            stack: [
              {
                text: "Aires de Paz",
                font: "Times",
                italics: true,
                fontSize: 20,
                alignment: "right",
              },
              {
                text: `Número De Orden: ${".".repeat(30)}`,
                fontSize: 8,
                alignment: "right",
                margin: [0, 5, 0, 0],
              },
              {
                text: `Recibo Oficial Nº: ${".".repeat(30)}`,
                fontSize: 8,
                alignment: "right",
                margin: [0, 5, 0, 0],
              },
              {
                text: `Importe Abonado: ${".".repeat(30)}`,
                fontSize: 8,
                alignment: "right",
                margin: [0, 5, 0, 0],
              },
            ],
            width: "auto",
          },
        ],
      },
      {
        text: "Declaración Jurada: Solicitud de Autorización",
        style: "title",
        fontSize: 15,
        margin: [0, 5, 0, 5],
      },
      {
        text: [
          { text: "Tacural ", bold: true },
          {
            text: fechaLarga(data.fechaDocumento),
            style: "inputText",
          },
        ],
        margin: [0, 0, 0, 5],
      },
      filaPuntos("El /la que suscribe", data.nombreSuscribe, 85),
      filaPuntos("D.N.I.", data.dniSuscribe, 35),
      filaPuntos("domiciliado/a en", data.domicilioSuscribe, 75),

      {
        margin: [0, 10, 0, 0],
        text: [
          {
            text: "SOLICITA Y AUTORIZA A",
          },
          {
            text: " Aires de Paz Complejo Crematorio",
            bold: true,
            italics: true,
          },
          { text: " la cremación del cadáver de:", bold: true },
        ],
      },

      {
        margin: [0, 5, 0, 0],
        columns: [
          {
            width: "75%",
            stack: [
              {
                text: (data.nombreFallecido || "").toUpperCase(),
                style: "inputText",
                margin: [5, 0, 0, 0],
              },
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 2,
                    x2: 360,
                    y2: 2,
                    lineWidth: 0.5,
                    lineColor: "#aaaaaa",
                    dash: { length: 1, space: 1 },
                  },
                ],
              },
            ],
          },
          {
            width: "25%",
            alignment: "right",
            text: [
              { text: " ATAUD ", bold: true },
              { text: ".".repeat(15), color: "#aaaaaa" },
              { text: " URNA ", bold: true },
              { text: ".".repeat(15), color: "#aaaaaa" },
            ],
          },
        ],
      },

      {
        margin: [0, 5, 0, 0],
        columns: [
          { text: "Fallecido el", style: "label", width: "auto" },
          {
            width: 80,
            stack: [
              {
                text: formatearFechaSimple(data.fechaFallecimiento),
                style: "inputText",
                margin: [5, 0, 0, 0],
              },
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 2,
                    x2: 80,
                    y2: 2,
                    lineWidth: 0.5,
                    lineColor: "#aaaaaa",
                    dash: { length: 1, space: 1 },
                  },
                ],
              },
            ],
          },
          { text: "en", style: "label", width: "auto", margin: [5, 0, 0, 0] },
          {
            width: "*",
            stack: [
              {
                text: (data.lugarFallecimiento || "").toUpperCase(),
                style: "inputText",
                margin: [5, 0, 0, 0],
              },
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 2,
                    x2: 300,
                    y2: 2,
                    lineWidth: 0.5,
                    lineColor: "#aaaaaa",
                    dash: { length: 1, space: 1 },
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        margin: [0, 10, 0, 0],
        columns: [
          { text: "causa de la defunción", style: "label", width: "auto" },
          {
            width: "*",
            stack: [
              {
                text: (data.causaDefuncion || "").toUpperCase(),
                style: "inputText",
                margin: [5, 0, 0, 0],
              },
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 2,
                    x2: 385,
                    y2: 2,
                    lineWidth: 0.5,
                    lineColor: "#aaaaaa",
                    dash: { length: 1, space: 1 },
                  },
                ],
              },
            ],
          },
        ],
      },

      filaPuntos("Certificada por el/los médicos", data.nombreMedico, 135),
      filaPuntos("O por partida de defuncion", "-", 130),
      filaPuntos("O por orden de traslado cementerio de", "-", 170),
      filaPuntos("Cochería", data.cocheria, 50),
      {
        text: "El / la Solicitante declara bajo juramento:",
        bold: true,
        margin: [0, 10, 0, 5],
        fontSize: 10,
      },
      {
        columns: [
          { text: "a)", width: 15 },
          {
            text: "Que sabe y le consta que el fallecido murió de causas naturales y que no existió intervención judicial o policial.",
            width: "*",
            fontSize: 11,
          },
        ],
      },
      {
        margin: [0, 4, 0, 0],
        columns: [
          { text: "b)", width: 15 },
          {
            text: "Que es el familiar mas directo del fallecido con la facultad para solicitar la cremación, no existiendo oposición a tal solicitud por ninguna persona con mejor derecho.",
            width: "*",
            fontSize: 11,
          },
        ],
      },
      {
        margin: [0, 4, 0, 2],
        columns: [
          { text: "c)", width: 15 },
          {
            text: "Que asume cualquier consecuencia legal relacionada con los reclamos familiares derivados de la cremación que solicita desligando expresamente a Aires de la Paz Complejo Crematorio de toda responsabilidad sobre el particular.",
            width: "*",
            fontSize: 11,
          },
        ],
      },
      {
        text: "El solicitante exhibe los siguientes documentos:",
        fontSize: 11,
      },

      {
        columns: [
          {
            text: "OBSERVACIONES:",
            bold: true,
            decoration: "underline",
            width: "auto",
          },
          {
            text: (data.observaciones || "").toUpperCase(),
            margin: [10, 0, 0, 0],
            width: "*",
          },
        ],
        margin: [0, 3, 0, 50],
      },

      {
        columns: [
          {
            stack: [
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 0,
                    x2: 130,
                    y2: 0,
                    lineWidth: 0.5,
                    lineColor: "#aaaaaa",
                    dash: { length: 1, space: 1 },
                  },
                ],
              },
              {
                text: "Firma",
                alignment: "center",
                fontSize: 8,
                margin: [0, 4, 0, 50],
              },
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 0,
                    x2: 130,
                    y2: 0,
                    lineWidth: 0.5,
                    lineColor: "#aaaaaa",
                    dash: { length: 1, space: 1 },
                  },
                ],
              },
              {
                text: "Firma (Testigo I)",
                alignment: "center",
                fontSize: 8,
                margin: [0, 4, 0, 50],
              },
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 0,
                    x2: 130,
                    y2: 0,
                    lineWidth: 0.5,
                    lineColor: "#aaaaaa",
                    dash: { length: 1, space: 1 },
                  },
                ],
              },
              {
                text: "Firma (Testigo II)",
                alignment: "center",
                fontSize: 8,
                margin: [0, 4, 0, 0],
              },
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
                    x2: 130,
                    y2: 0,
                    lineWidth: 0.5,
                    lineColor: "#aaaaaa",
                    dash: { length: 1, space: 1 },
                  },
                ],
              },
              {
                text: "Aclaración manuscrita",
                alignment: "center",
                fontSize: 8,
                margin: [0, 4, 0, 50],
              },
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 0,
                    x2: 130,
                    y2: 0,
                    lineWidth: 0.5,
                    lineColor: "#aaaaaa",
                    dash: { length: 1, space: 1 },
                  },
                ],
              },
              {
                text: "Aclaración manuscrita",
                alignment: "center",
                fontSize: 8,
                margin: [0, 4, 0, 50],
              },
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 0,
                    x2: 130,
                    y2: 0,
                    lineWidth: 0.5,
                    lineColor: "#aaaaaa",
                    dash: { length: 1, space: 1 },
                  },
                ],
              },
              {
                text: "Aclaración manuscrita",
                alignment: "center",
                fontSize: 8,
                margin: [0, 4, 0, 0],
              },
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
                    x2: 130,
                    y2: 0,
                    lineWidth: 0.5,
                    lineColor: "#aaaaaa",
                    dash: { length: 1, space: 1 },
                  },
                ],
              },
              {
                text: "Firmo ante",
                alignment: "center",
                fontSize: 8,
                margin: [0, 4, 0, 0],
              },
            ],
          },
        ],
      },
      {
        text: "OBSERVACIONES: DECLARO FEHACIENTEMENTE QUE EL FALLECIDO NO POSEE MARCA PASO NI PROTESIS SILICONADAS.",
        fontSize: 8,
        characterSpacing: 1.2,
        margin: [0, 10, 0, 32],
      },
      {
        columns: [
          {
            stack: [
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 0,
                    x2: 160,
                    y2: 0,
                    lineWidth: 0.5,
                    lineColor: "#000000",
                    dash: { length: 1, space: 1 },
                  },
                ],
              },
              {
                text: "FIRMA Y ACLARACION",
                fontSize: 10,
                margin: [0, 5, 0, 5],
              },
            ],
            width: "auto",
          },
          {
            stack: [
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 0,
                    x2: 130,
                    y2: 0,
                    lineWidth: 0.5,
                    lineColor: "#000000",
                    dash: { length: 1, space: 1 },
                  },
                ],
              },
            ],
            alignment: "right",
          },
        ],
      },
      {
        text: `Destino de las Cenizas: ${".".repeat(80)}`,
        margin: [0, 3, 0, 5],
        fontSize: 9,
      },
      {
        text: `Retiro las Cenizas correspondientes el: ${".".repeat(60)}`,
        margin: [0, 2, 0, 0],
        fontSize: 9,
      },
    ],
    styles: {
      title: { bold: true, decoration: "underline" },
      label: { bold: false },
      inputText: { fontSize: 11, bold: true },
    },
  };
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(filePath));
  pdfDoc.end();

  return filePath;
}

module.exports = { generarDeclaracion };
