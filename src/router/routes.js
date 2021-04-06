
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/PageUsers.vue') },
      { path: '/auth', component: () => import('pages/PageAuth.vue') },
      { path: '/chat/:otherUserID', component: () => import('pages/PageChat.vue') },
      { path: '/user-settings', component: () => import('pages/PageUserSettings.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
