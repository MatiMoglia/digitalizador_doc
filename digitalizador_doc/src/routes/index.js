import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ConstanciaForm from '../views/constanciaForm.vue'
import NotaDiarios from '../views/NotaDiarios.vue'
import SolicitudSepelioForm from '../views/SolicitudSepelioForm.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/constancia/nuevo',
    name: 'Constancia',
    component: ConstanciaForm
  },
  {
    path: '/nota/nuevo',
    name: 'Nota',
    component: NotaDiarios
  },
  {
    path: '/solicitud/nuevo',
    name: 'Solicitud',
    component: SolicitudSepelioForm
  }
  
]

export default createRouter({
  history: createWebHistory(),
  routes
})