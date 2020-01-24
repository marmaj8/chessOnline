
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      //{ path: '/login', component: () => import('pages/Login.vue') },
      { path: '/games', component: () => import('pages/games.vue') },
      { path: '/game', component: () => import('pages/game.vue') },
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
