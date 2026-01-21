<template>
  <div class="container">
    <div class="card">
      <div class="title-row">
        <h2 class="page-title">Solicitud del Servicio de Sepelio</h2>

        <div class="doc-number">
          <label>N°</label>
          <input type="number" v-model="form.numeroDocumento" />
        </div>
        <div class="doc-fecha">
          <label>Fecha</label>
          <input type="date" v-model="form.fechaDocumento" />
        </div>
      </div>

      <h3 class="mt-3 mb-2">SOLICITANTE DEUDOR RESPONSABLE:</h3>
      <div class="form-grid">
        <div>
          <label>Nombre y apellido</label>
          <input v-model="form.solicitanteNombre" />
        </div>

        <div>
          <label>DNI</label>
          <input v-model="form.solicitanteDni" />
        </div>

        <div>
          <label>Domicilio</label>
          <input v-model="form.domicilio" />
        </div>
        <div>
          <label>localidad</label>
          <input v-model="form.domicilioLOC" />
        </div>
      </div>

      <h3 class="mt-3 mb-2">DATOS DEL FALLECIDO:</h3>
      <div class="form-grid">
        <div>
          <label>Nombre</label>
          <input v-model="form.nombreFallecido" />
        </div>

        <div>
          <label>Casa mortuoria</label>
          <input v-model="form.casaMortuoria" />
        </div>

        <div>
          <label>Fecha sepelio</label>
          <input type="date" v-model="form.fechaSepelio" />
        </div>

        <div>
          <label>Hora</label>
          <input type="time" v-model="form.horaSepelio" />
        </div>

        <div class="full">
          <label>Cementerio</label>
          <input v-model="form.cementerio" />
        </div>
      </div>

      <h3 class="mt-3 mb-2">TIPOS DE SERVICIOS:</h3>
      <div class="form-grid">
        <div>
          <label>Tipo de servicio</label>
          <select v-model="form.tipoServicio">
            <option value="">Seleccione el que corresponda</option>
            <option>NORMALIZADO para Asociados con Ataud</option>
            <option>Para Asociados con Ataud</option>
            <option>Para asociados con Ataud</option>
            <option>A cargo Mutal</option>
            <option>Otros</option>
          </select>
        </div>
        <div>
          <label>Monto</label>
          <input type="number" v-model="form.monto" placeholder="$$$" />
        </div>
        <template v-if="esServicioConAtaud">
          <div>
            <label>Ataúd (tipo)</label>
            <input v-model="form.ataudTipo" />
          </div>

          <div>
            <label>Observación (opcional)</label>
            <input v-model="form.observacion" />
          </div>
        </template>
        <template v-else-if="form.tipoServicio === 'A cargo Mutal'">
          <div>
            <label>Nombre mutual</label>
            <input v-model="form.nombreMutual" />
          </div>

          <div>
            <label>Ataúd (tipo)</label>
            <input v-model="form.ataudTipo" />
          </div>

          <div class="full">
            <label>Observación (opcional)</label>
            <input v-model="form.observacion" />
          </div>
        </template>

        <template v-else-if="form.tipoServicio === 'Otros'">
          <div class="full">
            <label>Observación</label>
            <input v-model="form.observacion" />
          </div>
        </template>
      </div>
      <div class="actions">
        <button class="btn-secondary" @click="$router.push('/')">Volver al menu</button>
        <button class="btn-primary" @click="generar">Guardar e Imprimir</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch, toRaw, onMounted } from "vue";
onMounted(async () => {
  form.numeroDocumento = await window.electron.obtenerNumero()
})
function hoyISO() {
  return new Date().toISOString().split("T")[0];
}
const form = reactive({
  solicitanteNombre: "",
  solicitanteDni: "",
  domicilio: "",
  domicilioLOC: "",
  nombreFallecido: "",
  casaMortuoria: "",
  fechaSepelio: "",
  horaSepelio: "",
  cementerio: "",
  tipoServicio: "",
  monto: "",
  nombreMutual: "",
  ataudTipo: "",
  observacion: "",
  numeroDocumento: 2737,
  fechaDocumento: hoyISO(),
});
const esServicioConAtaud = computed(() => {
  return [
    "NORMALIZADO para Asociados con Ataud",
    "Para Asociados con Ataud",
    "Para asociados con Ataud",
  ].includes(form.tipoServicio);
});

watch(
  () => form.tipoServicio,
  () => {
    form.nombreMutual = "";
    form.ataudTipo = "";
    form.observacion = "";
  },
);
async function generar() {
  const numeroActual = form.numeroDocumento

  const data = {
    ...toRaw(form),
    numeroDocumento: numeroActual
  }

  const filePath = await window.electron.generarSolicitudSepelio(data)

  const siguiente = Number(numeroActual) + 1
  form.numeroDocumento = siguiente

  await window.electron.guardarNumero(siguiente)

  alert(`PDF generado:\n${filePath}`)
}
</script>

<style scoped>
.container {
  max-width: 1100px;
  margin: 20px auto;
  padding: 0 15px;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 32px 36px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.top-bar {
  margin-bottom: 15px;
}

.title-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;     
}

.page-title {
  font-size: 26px;
  font-weight: 750;
  letter-spacing: 0.4px;
  color: #1e40af;
  flex: 1 1 auto;         
  min-width: 260px;
}
.doc-number,
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

h3 {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: #335481;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 6px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px 24px;
}

.full {
  grid-column: 1 / -1;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #374151;
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

.actions {
  margin-top: 36px;
  display: flex;
  justify-content: space-between;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
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
