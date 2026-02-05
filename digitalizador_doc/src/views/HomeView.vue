<template>
  <div class="home-container">
    <div class="welcome-section">
      <h1 class="title">Sistema de Digitalización</h1>
      <p class="subtitle">
        Seleccione el tipo de documento que desea completar
      </p>
    </div>

    <div class="cards-grid">
      <div class="card" @click="goTo('constancia')">
        <div class="icon-wrapper blue">
          <i class="bi bi-file-earmark-text"></i>
        </div>
        <h2>Constancia de Velatorio</h2>
        <p>Certificación del servicio realizado.</p>
      </div>

      <div class="card" @click="goTo('solicitud')">
        <div class="icon-wrapper green">
          <i class="bi bi-clipboard-check"></i>
        </div>
        <h2>Solicitud de Sepelio</h2>
        <p>Formulario completo de solicitud del servicio.</p>
      </div>

      <div class="card" @click="goTo('aviso')">
        <div class="icon-wrapper orange">
          <i class="bi bi-newspaper"></i>
        </div>
        <h2>Nota para Diarios</h2>
        <p>Aviso fúnebre para publicación.</p>
      </div>

      <div class="card" @click="goTo('traslado')">
        <div class="icon-wrapper purple">
          <i class="bi bi-car-front-fill"></i>
        </div>
        <h2>Solicitud de Sepelio (Traslado)</h2>
        <p>Nota correspondiente para Administración.</p>
      </div>

      <div class="card card-highlight" @click="goTo('declaracion')">
        <div class="icon-wrapper indigo">
          <i class="bi bi-journal-bookmark-fill"></i>
        </div>
        <h2>Declaración Jurada</h2>
        <p>Solicitud de autorización – Aires de Paz.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

function goTo(tipo) {
  const routes = {
    constancia: "/constancia/nuevo",
    solicitud: "/solicitud/nuevo",
    aviso: "/nota/nuevo",
    traslado: "/traslado/nuevo",
    declaracion: "/declaracion/nuevo"
  };
  router.push(routes[tipo]);
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  padding: 60px 20px;
  background: #f1f5f9;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome-section {
  text-align: center;
  margin-bottom: 48px;
}

.title {
  font-size: 34px;
  font-weight: 800;
  color: #1e3a8a;
}

.subtitle {
  font-size: 17px;
  color: #64748b;
  margin-top: 8px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  width: 100%;
  max-width: 1000px;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 28px 22px;
  cursor: pointer;
  text-align: center;
  border: 1px solid #e5e7eb;
  transition: all 0.25s ease;
}

.card:hover {
  transform: translateY(-6px);
  border-color: #93c5fd;
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.08);
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  font-size: 26px;
  color: #ffffff;
}

.blue    { background: #2563eb; }
.green   { background: #059669; }
.orange  { background: #d97706; }
.purple  { background: #7c3aed; }
.indigo  { background: #4338ca; }

.card h2 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1e293b;
}

.card p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.4;
}

@media (max-width: 900px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>