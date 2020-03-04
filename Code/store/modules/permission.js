import { constantRoutes, componets, pageNotFound } from '@/router'
import Layout from '@/views/layout/Layout'
import store from '@/store'

/**
 * 根据用户的权限菜单生成路由表
 * @param authorisedRoutes
 */
function generateAccessRoutes(authorisedRoutes) {
  return Array.from(authorisedRoutes).map(menu => {
    let route = {}
    route.name = menu.name
    route.path = menu.path
    route.hidden = menu.hidden === undefined ? true : menu.hidden
    if (menu['authorised']) {
      route.redirect = menu.redirect
    } else {
      route.redirect = '/401'
    }
    let component
    if (menu.level === 1) {
      route.component = Layout
    } else {
      component = componets[menu.name]
      if (menu.menuType === 0) {
        store.dispatch('addNeedCachedModule', menu.name)
      }
      if (component) {
        route.component = component
      } else {
        route.component = () => import('@/views/errorPage/404')
      }
    }
    let meta = {}
    meta.title = menu.title
    meta.namespace = menu.namespace.join(',')
    if (menu.icon) {
      meta.icon = menu.icon
    }
    if (menu.needCached) {
      meta.noCache = false
    } else {
      meta.noCache = true
    }
    route.meta = meta
    let children = menu.children
    if (children && children.length > 0) {
      route.children = generateAccessRoutes(children)
    }
    if (menu.menuType === 0) {
      // if (component) {
      //   route.children.push({
      //     path: '',
      //     hidden: true,
      //     name: menu.name + '111',
      //     component,
      //     meta: {
      //       title: menu.title,
      //       noCache: true
      //     }
      //   })
      // }
      let children = route.children
      if (children && children.length > 0) {
        route.alwaysShow = true
      } else {
        route.alwaysShow = false
        route.children = [
          {
            path: '404',
            component: () => import('@/views/errorPage/404'),
            name: 'NOT-FOUND',
            hidden: true,
            meta: {
              title: '无效页面',
              noCache: true
            }
          }
        ]
      }
    }
    if (menu.name === 'DASH-EDGS') {
      route.alwaysShow = false
      route.children.push(...[
        {
          path: '404',
          component: () => import('@/views/errorPage/404'),
          name: 'NOT-FOUND',
          hidden: true,
          meta: {
            title: '无效页面',
            noCache: true
          }
        },
        {
          path: '401',
          component: () => import('@/views/errorPage/401'),
          name: 'NOT-AUTHORITY',
          hidden: true,
          meta: {
            title: '无权限',
            noCache: true
          }
        }
      ])
    }
    return route
  })
}

const permission = {
  state: {
    routers: constantRoutes,
    addRouters: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRouters = routes
      state.routers = constantRoutes.concat(routes)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        let menu = Array.from(data).find(menu => menu.name === 'DASH-EDGS');
        let dashboard = {
          authorised: true,
          hidden: false,
          level: 2,
          menuType: 1,
          icon: "dashboard",
          name: "DASHBOARD",
          namespace: ["DASH-EDGS", "DASHBOARD"],
          needCached: true,
          path: "dashboard",
          title: "我的桌面"
        };
        if (menu) {
          let children = menu.children;
          if (children) {
            children.push(dashboard);
          } else {
            menu.children = [dashboard];
          }
        } else {
          data = [{
            authorised: true,
            children: [dashboard],
            hidden: false,
            icon: "dashboard",
            level: 1,
            menuType: 0,
            name: "DASH-EDGS",
            namespace: ["DASH-EDGS"],
            needCached: true,
            path: "/",
            redirect: "dashboard",
            title: "我的桌面"
          }].concat(data);
        }
        let accessedRoutes = generateAccessRoutes(data)
        accessedRoutes.push(pageNotFound)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
}

export default permission
