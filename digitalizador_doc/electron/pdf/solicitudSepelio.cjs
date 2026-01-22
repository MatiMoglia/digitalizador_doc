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
    "Solicitudes-Sepelio",
  );
}

function fechaLarga(fecha) {
  if (!fecha) return "....................";
  const f = new Date(fecha);
  return f.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function dataCell(text) {
  return {
    text: text || "",
    style: "inputText",
    border: [false, false, false, false],
  };
}

function labelCell(text, align = "left") {
  return {
    text: text,
    style: "label",
    alignment: align,
    border: [false, false, false, false],
  };
}

async function generarSolicitudSepelio(data) {
  const outputDir = downloadsDir();
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const fileName = `Solicitud_Sepelio_${data.numeroDocumento || Date.now()}.pdf`;
  const filePath = path.join(outputDir, fileName);
  const logoPath = path.join(__dirname, "assets", "logo.jpg");

  let servicioTextoFinal = data.tipoServicio || "NO ESPECIFICADO";

  if (
    servicioTextoFinal.toLowerCase().includes("mutal") ||
    servicioTextoFinal.toLowerCase().includes("mutual")
  ) {
    const nombreMutual = data.nombreMutual ? ` ${data.nombreMutual}` : "";
    servicioTextoFinal = `A CARGO MUTUAL${nombreMutual}`;
  }

  let observacionesConcatenadas = "";
  if (data.ataudTipo) {
    observacionesConcatenadas = ` ${data.ataudTipo}`;
  }
  if (data.observacion) {
    observacionesConcatenadas += observacionesConcatenadas
      ? ` - ${data.observacion}`
      : data.observacion;
  }

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],
    defaultStyle: {
      font: "Times",
      fontSize: 11,
      lineHeight: 1.2,
    },
    content: [
      {
        columns: [
          {
            image: logoPath,
            width: 35,
          },
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
            text: "Solicitud de Servicio de Sepelio",
            style: "title",
            width: "*",
          },
          {
            text: [
              { text: "Nº  ", fontSize: 11 },
              {
                text: String(data.numeroDocumento || ""),
                fontSize: 13,
                bold: true,
              },
            ],
            width: "auto",
            alignment: "right",
          },
        ],
        margin: [0, 0, 0, 5],
      },
      { text: "SOLICITANTE DEUDOR RESPONSABLE", style: "sectionHeader" },
      {
        table: {
          widths: [50, "*", 60, 100],
          body: [
            [
              labelCell("Señor:"),
              { ...dataCell(data.solicitanteNombre), colSpan: 3 },
              {},
              {},
            ],
            [
              labelCell("Domicilio:"),
              dataCell(data.domicilio),
              labelCell("Localidad:", "right"),
              dataCell(data.domicilioLOC || "Porteña"),
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 5],
      },
      {
        table: {
          widths: [100, 40, 40, "*"],
          body: [
            [
              labelCell("Documento Tipo:"),
              dataCell("DNI"),
              labelCell("Nº:", "right"),
              dataCell(data.solicitanteDni),
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 5],
      },
      {
        table: {
          widths: ["auto", "*"],
          body: [
            [
              labelCell("Servicio convenido para el/la extinto/a:"),
              dataCell(data.nombreFallecido),
            ],
          ],
          layout: "noBorders",
          margin: [0, 0, 0, 5],
        },
      },
      {
        table: {
          widths: [90, "*"],
          body: [[labelCell("Casa Mortuoria:"), dataCell(data.casaMortuoria)]],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 5],
      },
      {
        table: {
          widths: [75, 120, 40, 50, 70, "*"],
          body: [
            [
              labelCell("Sepelio: Día:"),
              dataCell(fechaLarga(data.fechaSepelio)),
              labelCell("Hora:", "right"),
              dataCell(data.horaSepelio),
              labelCell("Cementerio:", "right"),
              dataCell(data.cementerio || "Porteña"),
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 10],
      },

      { text: "TIPOS DE SERVICIOS DISPONIBLES", style: "sectionHeader" },
      {
        stack: [
          {
            text: "• NORMALIZADO para Asociados adheridos con Ataúd tipo.",
            style: "listText",
          },
          {
            text: "• NORMALIZADO para Asociados adheridos con Ataúd.",
            style: "listText",
          },
          { text: "• Para Asociados con Ataúd.", style: "listText" },
          { text: "• Para no Asociados con Ataúd.", style: "listText" },
          { text: "• A cargo Mutual con Ataúd.", style: "listText" },
          { text: "• Otros.", style: "listText" },
        ],
        margin: [10, 5, 0, 10],
      },

      {
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: [
                  {
                    text: "SERVICIO SELECCIONADO: ",
                    bold: true,
                    fontSize: 13,
                    color: "#555555",
                  },
                  {
                    text: servicioTextoFinal.toUpperCase(),
                    bold: true,
                    fontSize: 13,
                  },
                ],
                alignment: "center",
                margin: [0, 10, 0, 10],
                fillColor: "#f9f9f9",
              },
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 10, 0, 10],
      },

      observacionesConcatenadas
        ? {
            table: {
              widths: [90, "*"],
              body: [
                [
                  labelCell("Observaciones:"),
                  dataCell(observacionesConcatenadas),
                ],
              ],
            },
            layout: "noBorders",
            margin: [0, 0, 0, 15],
          }
        : null,

      {
        text: [
          {
            text: "Este servicio es tratado en la suma de pesos: ",
            bold: true,
          },
          {
            text: `$ ${data.monto || "...................."}`,
            bold: true,
            fontSize: 13,
          },
        ],
        margin: [0, 0, 0, 15],
      },
      {
        text: "En prueba de conformidad, firmamos el presente y nos obligamos mancomunada y solidariamente a pagar el total anterior según las condiciones pactadas con la administración de la Cooperativa.",
        style: "legalText",
      },
      {
        text: "La falta de cumplimiento en el pago de las obligaciones convenidas devengará el interés por mora vigente, reservándose la Cooperativa el derecho de trasladar los antecedentes a ASESORÍA JURÍDICA para la gestión de cobro.-",
        style: "legalText",
        margin: [0, 5, 0, 20],
      },
      {
        text: [
          { text: "PORTEÑA, ", bold: true },
          { text: fechaLarga(data.fechaDocumento) },
        ],
        alignment: "right",
        margin: [0, 0, 0, 60],
      },
      {
        table: {
          widths: ["*", "*", "*"],
          body: [
            [
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
                      },
                    ],
                    alignment: "center",
                  },
                  {
                    text: "Solicitante Deudor Responsable",
                    style: "signatureText",
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
                      },
                    ],
                    alignment: "center",
                  },
                  {
                    text: "Por Cooperativa de Servicios Públicos\nde Porteña Ltda.",
                    style: "signatureText",
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
                      },
                    ],
                    alignment: "center",
                  },
                ],
              },
            ],
          ],
        },
        layout: "noBorders",
      },
    ],
    styles: {
      headerMain: { fontSize: 16, bold: true },
      headerSub: { fontSize: 9 },
      title: { fontSize: 16, bold: true, decoration: "underline" },
      sectionHeader: {
        fontSize: 11,
        bold: true,
        decoration: "underline",
        margin: [0, 10, 0, 8],
        italics: true,
      },
      label: { fontSize: 11, bold: true },
      inputText: { fontSize: 12, bold: false },
      listText: { fontSize: 11, margin: [0, 1, 0, 1], color: "#444444" },
      legalText: { fontSize: 10, alignment: "justify", lineHeight: 1.3 },
      signatureText: {
        fontSize: 9,
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

module.exports = { generarSolicitudSepelio };
