
const routes = [
  {
    path: '/',
    // component: () => import('layouts/MainLayout.vue'),
    // children: [
    //   { path: '', component: () => import('pages/IndexPage.vue') }
    // ]
    redirect:'/login',
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path:'/login',
    name:'login',
    component: () => import('pages/LoginPage.vue')
  },
  {
    path:'/home',
    
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', name:'home', component: () => import('pages/IndexPage.vue')},
      {path:'delete/:id',props:true, component: () => import('pages/EditItem.vue')},
      {path:'/home/add', component: () => import('pages/AddItem.vue')},
      {path:'/home/check',name:'bill', component: () => import('pages/CheckClient.vue')},
      {path:'/home/buy', name:'buy', component: () => import('pages/CreateBill.vue')},
      
    ]
  },

]

export default routes
