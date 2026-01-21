<template>
  <div class="home-container">
    <h1 class="title">Sistema de Digitalización</h1>
    <p class="subtitle">Seleccione el tipo de documento que desea completar</p>

    <div class="cards-container">
      <div class="card" @click="goTo('constancia')">
        <i class="bi bi-file-earmark-text card-icon"></i>
        <h2>Constancia de Velatorio</h2>
        <p>Certificación del servicio realizado.</p>
      </div>

      <div class="card" @click="goTo('solicitud')">
        <i class="bi bi-clipboard-check card-icon"></i>
        <h2>Solicitud de Sepelio</h2>
        <p>Formulario completo de solicitud del servicio.</p>
      </div>

      <div class="card" @click="goTo('aviso')">
        <i class="bi bi-newspaper card-icon"></i>
        <h2>Nota para Diarios</h2>
        <p>Aviso fúnebre para publicación.</p>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function goTo(tipo) {
  const routes = {
    constancia: '/constancia/nuevo',
    solicitud: '/solicitud/nuevo',
    aviso: '/nota/nuevo'
  }

  router.push(routes[tipo])
}
</script>

<style scoped>

.home-container {
  min-height: 100vh;
  padding: 40px;
  background-color: #f4f6f8;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 32px;
  margin-bottom: 8px;
  color: #1f2933;
}

.subtitle {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 40px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 900px;
}

.card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 30px 24px;
  cursor: pointer;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.card-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.card h2 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #111827;
}

.card p {
  font-size: 14px;
  color: #6b7280;
}
</style>
