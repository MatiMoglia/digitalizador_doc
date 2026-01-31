import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ConstanciaForm from '../views/constanciaForm.vue'
import NotaDiarios from '../views/NotaDiarios.vue'
import SolicitudSepelioForm from '../views/SolicitudSepelioForm.vue'
import SolicitudTraslado from '../views/SolicitudTraslado.vue'
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
  },
  {
    path: '/traslado/nuevo',
    name: 'traslado',
    component: SolicitudTraslado
  }
  
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})