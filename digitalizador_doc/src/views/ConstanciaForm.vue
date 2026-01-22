<template>
  <div class="container">
    <div class="card">
      <div class="title-row">
        <h2 class="page-title">Constancia de Velatorio</h2>
      </div>

      <p class="subtitle">
        Complete los datos para generar la constancia oficial
      </p>

      <div class="form-grid">
        <div>
          <label>Fecha del documento</label>
          <input type="date" v-model="form.fechaDocumento" />
        </div>

        <div>
          <label>Nombre del fallecido</label>
          <input v-model="form.nombreFallecido" />
        </div>

        <div>
          <label>Fecha de fallecimiento</label>
          <input type="date" v-model="form.fechaFallecimiento" />
        </div>

        <div>
          <label>Fecha de sepelio</label>
          <input type="date" v-model="form.fechaSepelio" />
        </div>

        <div class="full">
          <label>Solicitante</label>
          <input v-model="form.solicitante" />
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
  nombreFallecido: "",
  fechaFallecimiento: "",
  fechaSepelio: "",
  solicitante: "",
});
async function generar() {
  const data = toRaw(form);
  const filePath = await window.electron.generarConstancia(data);
  toast.success(`PDF generado:\n${filePath}`);
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

.title-row {
  display: flex;
  align-items: center;
}
.page-title {
  font-size: 26px;
  font-weight: 750;
  letter-spacing: 0.4px;
  white-space: nowrap;
  color: #1e40af;
}

.subtitle {
  margin-top: 5px;
  margin-bottom: 20px;
  font-size: 16px;
  color: #5e6168;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px 26px;
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
