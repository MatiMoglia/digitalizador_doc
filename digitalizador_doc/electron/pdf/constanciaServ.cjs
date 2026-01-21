const { app } = require("electron");
const PdfPrinter = require("pdfmake/src/printer");
const fs = require("fs");
const path = require("path");

function downloadsDir() {
  return path.join(app.getPath("downloads"), "SistemaDigitalizacion");
}

const fonts = {
  Times: {
    normal: "Times-Roman",
    bold: "Times-Bold",
    italics: "Times-Italic",
    bolditalics: "Times-BoldItalic",
  },
};

const printer = new PdfPrinter(fonts);

function fechaLarga(fecha) {
  if (!fecha) return "....................";
  const f = new Date(fecha);
  return f.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function generarConstanciaPDF(data) {
  const outputDir = path.join(downloadsDir(), "Constancias");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const safeName = (data.nombreFallecido || "sin_nombre").replace(/\s+/g, "_");
  const fileName = `Constancia_${safeName}_${Date.now()}.pdf`;
  const filePath = path.join(outputDir, fileName);

  const headerImg = path.join(__dirname, "assets", "encabezado.jpg");
  const footerImg = path.join(__dirname, "assets", "pie.jpg");

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [60, 140, 60, 100],
    defaultStyle: { font: "Times", fontSize: 12, lineHeight: 1.4 },

    header: function (currentPage, pageCount) {
      return {
        image: headerImg,
        width: 500, 
        alignment: "center",
        margin: [0, 30, 0, 0],
      };
    },

    footer: function (currentPage, pageCount) {
      return {
        image: footerImg,
        width: 500, 
        alignment: "center",
        margin: [0, 0, 0, 20],
      };
    },

    content: [
      {
        text: `Porteña, ${fechaLarga(data.fechaDocumento)}`,
        alignment: "right",
        margin: [0, 20, 0, 40],
      },
      { text: "De nuestra mayor consideración:\n\n", italics: true },
      {
        text: [
          { text: "Por medio de la presente dejamos constancia que el día " },
          { text: fechaLarga(data.fechaFallecimiento), bold: true },
          { text: ", falleció en Porteña el Sr./a " },
          { text: (data.nombreFallecido || "").toUpperCase(), bold: true },
          {
            text: ", cuyos restos fueron velados en la sala de la Cooperativa de Servicios Públicos de Porteña Ltda. y recibieron sepultura el día ",
          },
          { text: fechaLarga(data.fechaSepelio), bold: true },
          { text: ", bajo el mismo servicio.\n\n" },
        ],
        alignment: "justify",
      },
      {
        text: [
          {
            text: "Sin otro particular, se extiende la presente por pedido del SR./A ",
          },
          { text: (data.solicitante || "").toUpperCase(), bold: true },
          { text: ".\n\n" },
        ],
      },
      {
        text: "Para ser presentado ante quien corresponda.\n\n\n",
        margin: [0, 0, 0, 10],
      },
      { text: "Atte.\ P/ COOPERATIVA DE SERVICIOS PÚBLICOS DE PORTEÑA LTDA." },

      {
        stack: [
          {

            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 200,
                y2: 0,
                lineWidth: 0.5,
                dash: { length: 2, space: 2 }, 
              },
            ],
            alignment: "center",
          },
          {
            text: "FRAIRE SEBASTIÁN HUGO\nServicios Sociales",
            alignment: "center",
            margin: [0, 5, 0, 0],
            fontSize: 12,
          },
        ],
        margin: [0, 80, 0, 0], 
      },
    ],
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(filePath));
  pdfDoc.end();

  return filePath;
}

module.exports = { generarConstanciaPDF };
