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
    "Notas-Diarios",
  );
}

function formatearFecha(fecha) {
  if (!fecha) return "";
  const f = new Date(fecha);
  return f.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function filaDato(label, value, extraLabel = "", extraValue = "") {
  const colums = [
    { text: label.toUpperCase(), bold: true, width: "auto" },
    { text: (value || "").toUpperCase(), margin: [5, 0, 0, 0], width: "*" },
  ];

  if (extraLabel) {
    colums.push({
      text: extraLabel.toUpperCase(),
      bold: true,
      width: "auto",
      margin: [15, 0, 0, 0],
    });
    colums.push({
      text: (extraValue || "").toUpperCase(),
      margin: [5, 0, 0, 0],
      width: "auto",
    });
  }

  return {
    columns: colums,
    margin: [0, 12, 0, 0],
  };
}

async function generarNotaDiarioPDF(data) {
  const outputDir = downloadsDir();
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const fileName = `Nota_Diario_${data.nombre.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
  const filePath = path.join(outputDir, fileName);

  const headerImg = path.join(__dirname, "assets", "encabezado.jpg");
  const footerImg = path.join(__dirname, "assets", "pie.jpg");

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [60, 140, 60, 100],
    defaultStyle: { font: "Times", fontSize: 12, lineHeight: 1.2 },

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
      filaDato("NOMBRE:", data.nombre),
      lineaPuntos(475), 

      filaDato(
        "FALLECIO:",
        formatearFecha(data.fechaFallecimiento),
        "HORAS:",
        data.horaFallecimiento,
      ),
      lineaPuntos(475),

      filaDato("EDAD:", data.edad ? `${data.edad} AÑOS` : ""),
      lineaPuntos(475),

      filaDato(
        "SEPELIO:",
        formatearFecha(data.fechaSepelio),
        "HORAS:",
        data.horaSepelio,
      ),
      lineaPuntos(475),

      filaDato("PADRES:", data.padres),
      lineaPuntos(475),

      filaDato("ESPOSA/O:", data.esposa),
      lineaPuntos(475),

      filaDato("HIJOS:", data.hijos),
      lineaPuntos(475),

      filaDato("OTROS FAMILIARES:", data.otros),
      lineaPuntos(475),

      {
        text: "OFICIO RELIGIOSO: Parroquia San Isidro Labrador.",
        bold: true,
        margin: [0, 30, 0, 5],
        fontSize: 13,
      },

      filaDato("CEMENTERIO:", data.cementerio),
    ],
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(filePath));
  pdfDoc.end();

  return filePath;
}

// Función auxiliar de línea ajustada al margen
function lineaPuntos(ancho) {
  return {
    canvas: [
      {
        type: "line",
        x1: 0,
        y1: 2,
        x2: ancho,
        y2: 2,
        lineWidth: 0.5,
        dash: { length: 1, space: 2 },
      },
    ],
    margin: [0, 0, 0, 5],
  };
}
module.exports = { generarNotaDiarioPDF };
