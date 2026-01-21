<template>
  <div class="container">
    <div class="card">
      <div class="top-bar">
        <div class="title-row">
          <h2 class="page-title">Nota para Diarios</h2>
        </div>
      </div>

      <div class="form-grid">
        <div>
          <label>Nombre</label>
          <input v-model="form.nombre" />
        </div>

        <div>
          <label>Edad</label>
          <input v-model="form.edad" />
        </div>

        <div>
          <label>Fecha de fallecimiento</label>
          <input type="date" v-model="form.fechaFallecimiento" />
        </div>

        <div>
          <label>Hora de fallecimiento</label>
          <input type="time" v-model="form.horaFallecimiento" />
        </div>

        <div class="full">
          <label>Padres</label>
          <input v-model="form.padres" />
        </div>

        <div class="full">
          <label>Esposa / Esposo</label>
          <input v-model="form.esposa" />
        </div>

        <div class="full">
          <label>Hijos</label>
          <textarea rows="2" v-model="form.hijos"></textarea>
        </div>

        <div class="full">
          <label>Otros familiares</label>
          <textarea rows="2" v-model="form.otros"></textarea>
        </div>

        <div>
          <label>Fecha de sepelio</label>
          <input type="date" v-model="form.fechaSepelio" />
        </div>

        <div>
          <label>Hora de sepelio</label>
          <input type="time" v-model="form.horaSepelio" />
        </div>

        <div class="full">
          <label>Cementerio</label>
          <input v-model="form.cementerio" />
        </div>
      </div>

      <div class="actions">
        <button class="btn-secondary" @click="$router.push('/')">
          Volver al menú
        </button>
        <button class="btn-primary" @click="generar">
          Generar aviso
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { reactive, toRaw } from "vue";

const form = reactive({
  nombre: "",
  edad: "",
  fechaFallecimiento: "",
  horaFallecimiento: "",
  padres: "",
  hijos: "",
  otros: "",
  fechaSepelio: "",
  horaSepelio: "",
  cementerio: "",
});
async function generar() {
  const data = toRaw(form);
  const filePath = await window.electron.generarNotaDiarioPDF(data);
  alert(`PDF generado:\n${filePath}`);
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
  margin-bottom: 18px;
}

.title-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.page-title {
  font-size: 26px;
  font-weight: 750;
  letter-spacing: 0.4px;
  white-space: nowrap;
  color: #1e40af;
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
textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  resize: vertical;
}

input:focus,
textarea:focus {
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
