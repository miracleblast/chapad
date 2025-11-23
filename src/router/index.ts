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
      path: '/select-type',
      name: 'select-type', 
      component: () => import('../views/ContractTypeSelector.vue')
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
    },
    // FIXED: Removed extra comma and fixed these routes
    {
      path: '/contract-preview/:shareId',
      name: 'ContractPreview',
      component: () => import('../components/contracts/ContractPreview.vue')
    },
    {
      path: '/sign-contract/:shareId', 
      name: 'SignContract',
      component: () => import('../views/SignatureView.vue')
    }
  ]
})

// Add error handling for route navigation
router.onError((error) => {
  console.error('Router error:', error)
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    window.location.reload()
  }
})

export { router }