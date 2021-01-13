const routes = [
  {
    path: '/',
    component: () => import('@/layouts/drawer/Index.vue'),
    children: [
      {
        path: 'ledger-invoices',
        name: 'Invoices',
        meta: { requiresAuth: true },
        components: {
          default: () => import('@/views/invoices/Index.vue'),
          navDrawer: () => import('@/views/drawer/Index.vue')
        }
      },
      {
        path: 'ledger-expenses',
        name: 'Expenses',
        meta: { requiresAuth: true },
        components: {
          default: () => import('@/views/expenses/Index.vue'),
          navDrawer: () => import('@/views/drawer/Index.vue')
        }
      },
      {
        path: 'ledger-clients',
        name: 'Clients',
        meta: { requiresAuth: true },
        components: {
          default: () => import('@/views/clients/Index.vue'),
          navDrawer: () => import('@/views/drawer/Index.vue')
        }
      },
      {
        path: 'ledger-contacts',
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
