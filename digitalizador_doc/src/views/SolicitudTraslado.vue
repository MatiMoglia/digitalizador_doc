<template>
  <div class="container">
    <div class="card">
      <div class="title-row">
        <h2 class="page-title">Solicitud de Sepelio (Traslado)</h2>

        <div class="doc-number">
          <label>N°</label>
          <input type="number" v-model="form.nroDoc" />
        </div>
      </div>

      <h3 class="mt-3 mb-2">DATOS DEL TRASLADO:</h3>
      <div class="form-grid">
        <div>
          <label>Nombre del solicitante</label>
          <input v-model="form.solicitante" placeholder="Nombre completo" />
        </div>

        <div>
          <label>Nombre del fallecido</label>
          <input v-model="form.nombreFallecido" placeholder="Nombre completo" />
        </div>

        <div class="full">
          <label>Lugar de salida</label>
          <input v-model="form.salida" placeholder="Ciudad / Hospital / Domicilio" />
        </div>

        <div class="full">
          <label>Lugar de destino</label>
          <input v-model="form.destino" placeholder="Localidad de destino" />
        </div>

        <div>
          <label>Total Kilómetros recorridos</label>
          <input v-model="form.kmRecorridos" placeholder="Ej: 150" />
        </div>

        <div>
          <label>Fecha de Traslado</label>
          <input type="date" v-model="form.fechaTraslado" placeholder="DD/MM/YYYY" />
        </div>
      </div>

      <div class="actions">
        <button class="btn-secondary" @click="$router.push('/')">Volver al menu</button>
        <button class="btn-primary" @click="generar">Guardar e Imprimir</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRaw, onMounted } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

onMounted(async () => {
  form.nroDoc = await window.electron.obtenerNumeroTraslado();
});

function hoyISO() {
  return new Date().toISOString().split("T")[0];
}

const form = reactive({
  nroDoc: 0,
  solicitante: "",
  nombreFallecido: "",
  salida: "",
  destino: "",
  kmRecorridos: "",
  fechaTraslado: hoyISO(),
});

async function generar() {
  const numeroActual = Number(form.nroDoc);

  try {
    const data = {
      ...toRaw(form),
      nroDoc: numeroActual
    };

    const filePath = await window.electron.generarSolicitudTrasladoPDF(data);

    const siguiente = numeroActual + 1;
    await window.electron.guardarNumeroTraslado(siguiente);
    form.nroDoc = siguiente;

    toast.success(`PDF generado:\n${filePath}`);

    Object.assign(form, {
      solicitante: "",
      nombreFallecido: "",
      salida: "",
      destino: "",
      kmRecorridos: "",
      fechaTraslado: "",
    });

  } catch (err) {
    console.error(err);
    toast.error("Error al generar el PDF de traslado.");
  }
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

.title-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;     
}

.page-title {
  font-size: 25px;
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

input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
}

input:focus {
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