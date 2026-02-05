<template>
  <div class="container">
    <div class="card">
      <div class="header-row">
        <div class="header-left">
          <div class="header-text">
            <h2 class="page-title">
              Declaración Jurada: Solcitud de Autorización
            </h2>
          </div>
        </div>

        <div class="doc-fecha">
          <label>Fecha: </label>
          <input
            type="date"
            v-model="form.fechaDocumento"
            placeholder="DD/MM/YYYY"
          />
        </div>
      </div>

      <p class="subtitle">
        Complete los datos para generar el documento correspondiente
      </p>
      <h3 class="section-title">DATOS DE QUIEN SUSCRIBE</h3>
      <div class="form-grid">
        <div class="full">
          <label>Nombre del que la/le suscribe</label>
          <input v-model="form.nombreSuscribe" />
        </div>

        <div class="col-2">
          <label>DNI</label>
          <input v-model="form.dniSuscribe" />
        </div>

        <div class="col-2">
          <label>Domicilio</label>
          <input v-model="form.domicilioSuscribe" />
        </div>
      </div>

      <h3 class="section-title">DATOS DEL FALLECIDO</h3>
      <div class="form-grid">
        <div class="full">
          <label>Solicita la cremación del cadáver de</label>
          <input v-model="form.nombreFallecido" />
        </div>

        <div class="col-2">
          <label>Fecha de Fallecimiento</label>
          <input type="date" v-model="form.fechaFallecimiento" />
        </div>
        <div class="col-2">
          <label>Lugar de Fallecimiento</label>
          <input v-model="form.lugarFallecimiento" />
        </div>
        <div class="col-2">
          <label>Causa de Defunción</label>
          <input v-model="form.causaDefuncion" />
        </div>

        <div class="col-2">
          <label>Certificada por el/los Médicos</label>
          <input v-model="form.nombreMedico" />
        </div>

        <div class="col-2">
          <label>Cochería</label>
          <input class="input-blocked" readonly v-model="form.cocheria" />
        </div>

        <div class="full">
          <label>Observaciones</label>
          <input v-model="form.observaciones" />
        </div>
      </div>
      <div class="actions">
        <button class="btn-secondary" @click="$router.push('/')">
          Volver al menú
        </button>

        <button class="btn-primary" @click="generar">Guardar e imprimir</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRaw } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

function hoyISO() {
  return new Date().toISOString().split("T")[0];
}

const form = reactive({
  fechaDocumento: hoyISO(),
  nombreSuscribe: "",
  dniSuscribe: "",
  domicilioSuscribe: "",
  telefono: "", 
  nombreFallecido: "",
  fechaFallecimiento: "",
  lugarFallecimiento: "", 
  causaDefuncion: "",
  nombreMedico: "",
  cocheria: "Coop. de Servicios Públicos de Porteña",
  observaciones: "",
});

async function generar() {
  try {
    const rawData = toRaw(form);

    const fecha = new Date(rawData.fechaDocumento);
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const dataFinal = {
      ...rawData,
      dia: String(fecha.getDate()).padStart(2, '0'),
      mes: meses[fecha.getMonth()],
      anio: String(fecha.getFullYear()).slice(-2)
    };

    const filePath = await window.electron.generarDeclaracion(dataFinal);
    toast.success(`Declaración Jurada generada:\n${filePath}`);

    Object.assign(form, {
      nombreSuscribe: "",
      dniSuscribe: "",
      domicilioSuscribe: "",
      telefono: "",
      nombreFallecido: "",
      causaDefuncion: "",
      nombreMedico: "",
      lugarFallecimiento: "",
      observaciones: "",
    });

  } catch (error) {
    console.error(error);
    toast.error("Error al generar la Declaración Jurada");
  }
}
</script>

<style scoped>
.container {
  max-width: 920px;
  margin: 40px auto;
  padding: 0 15px;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 32px 36px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}
.doc-fecha {
  display: flex;
  align-items: center;
  gap: 8px;
}

.doc-number input,
.doc-fecha input {
  width: 120px;
  padding: 6px 8px;
  text-align: center;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-text {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 26px;
  font-weight: 750;
  letter-spacing: 0.4px;
  white-space: nowrap;
  color: #1e40af;
}

.page-subtitle {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
}

.header-date {
  min-width: 200px;
}

.subtitle {
  margin-top: 6px;
  margin-bottom: 22px;
  font-size: 16px;
  color: #5e6168;
}

.section-title {
  margin-top: 28px;
  margin-bottom: 14px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: #335481;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 6px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px 26px;
}

.col-1 {
  grid-column: span 1;
}

.col-2 {
  grid-column: span 2;
}

.col-3 {
  grid-column: span 3;
}

.full {
  grid-column: 1 / -1;
}
label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

input,
select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
}

input:focus,
select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
}

.input-blocked {
  background-color: #f3f4f6;
  cursor: not-allowed;
  color: #6b7280;
}
.actions {
  margin-top: 36px;
  display: flex;
  justify-content: space-between;
}

.btn-primary {
  background: #2563eb;
  color: #ffffff;
  padding: 12px 26px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover {
  background: #1e40af;
}

.btn-secondary {
  background: #f3f4f6;
  color: #111827;
  padding: 12px 26px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #e5e7eb;
}
</style>
