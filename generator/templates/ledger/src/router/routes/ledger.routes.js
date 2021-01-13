const routes = [
  {
    path: '/ledger',
    component: () => import('@/layouts/drawer/Index.vue'),
    children: [
      {
        path: 'invoices',
        name: 'Invoices',
        meta: { requiresAuth: true },
        components: {
          default: () => import('@/views/invoices/Index.vue'),
          navDrawer: () => import('@/views/drawer/Index.vue')
        }
      },
      {
        path: 'expenses',
        name: 'Expenses',
        meta: { requiresAuth: true },
        components: {
          default: () => import('@/views/expenses/Index.vue'),
          navDrawer: () => import('@/views/drawer/Index.vue')
        }
      },
      {
        path: 'clients',
        name: 'Clients',
        meta: { requiresAuth: true },
        components: {
          default: () => import('@/views/clients/Index.vue'),
          navDrawer: () => import('@/views/drawer/Index.vue')
        }
      },
      {
        path: 'contacts',
        name: 'Contacts',
        meta: { requiresAuth: true },
        components: {
          default: () => import('@/views/contacts/Index.vue'),
          navDrawer: () => import('@/views/drawer/Index.vue')
        }
      }
    ]
  }
]

export default routes
