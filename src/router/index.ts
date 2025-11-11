import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/builder',
      name: 'builder',
      component: () => import('../views/ContractBuilder.vue')
    },
    {
      path: '/templates',
      name: 'templates',
      component: () => import('../views/Templates.vue')
    },
    {
      path: '/documents',
      name: 'documents', 
      component: () => import('../views/DocumentsView.vue')
    },
    {
      path: '/contribution',
      name: 'contribution',
      component: () => import('../views/ContributionView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/Settings.vue')
    },
    {
      path: '/signature',
      name: 'signature',
      component: () => import('../views/SignatureView.vue')
    },
    {
      path: '/legal',
      name: 'legal',
      component: () => import('../views/LegalView.vue')
    },
    {
      path: '/license',
      name: 'license',
      component: () => import('../views/LicenseView.vue')
    }
  ]
})

export { router }