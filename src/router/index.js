import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const commonRoutes = [
    {
        path: '/login',
        name: 'login',
        meta: { title: '登录' },
        component: () => import('../components/Login.vue'),
    },
    {
        path: '/404',
        name: '404',
        meta: { title: '404' },
        component: () => import('../components/404.vue'),
    },
    { path: '/', redirect: '/home' },
]

// 本地所有的页面 需要配合后台返回的数据生成页面
export const asyncRoutes = {
    home: {
        path: 'home',
        name: 'home',
        meta: { title: '主页' },
        component: () => import('../views/Home.vue'),
    },
    userlist: {
        path: 'userlist',
        name: 'userlist',
        meta: { title: '用户列表' },
        component: () => import('../views/userManage/UserList.vue'),
    },
    factory: {
        path: 'factory',
        name: 'factory',
        meta: { title: '厂家管理' },
        component: () => import('../views/userManage/Factory.vue'),
    },
    usergroup: {
        path: 'usergroup',
        name: 'usergroup',
        meta: {title: '用户组管理'},
        component: () => import('../views/authManage/UserGroup.vue'),
    },
    role: {
        path: 'role',
        name: 'role',
        meta: {title: '角色管理'},
        component: () => import('../views/authManage/Role.vue'),
    },
    resource: {
        path: 'resource',
        name: 'resource',
        meta: {title: '权限管理'},
        component: () => import('../views/authManage/Resource.vue'),
    },
    operationlog: {
        path: 'operationlog',
        name: 'operationlog',
        meta: {title: '后台操作日志'},
        component: () => import('../views/logManage/OperationLog.vue')
    },
    eqinfo: {
        path: 'eqinfo',
        name: 'eqinfo',
        meta: {title: '设备信息'},
        component: () => import('../views/equipManage/EqInfo.vue')
    },
    eqmap: {
        path: 'eqmap',
        name: 'eqmap',
        meta: {title: '设备地图'},
        component: () => import('../views/equipManage/EqMap.vue')
    },
    paramrecord: {
        path: 'paramrecord',
        name: 'paramrecord',
        meta: {title: '参数修改记录'},
        component: () => import('../views/equipManage/ParamRecord.vue')
    },
    rtdata: {
        path: 'rtdata',
        name: 'rtdata',
        meta: {title: '实时数据'},
        component: () => import('../views/dataAnalysis/RtData.vue')
    },
    hisdata: {
        path: 'hisdata',
        name: 'hisdata',
        meta: {title: '历史数据'},
        component: () => import('../views/dataAnalysis/HisData.vue')
    },
    cycledata: {
        path: 'cycledata',
        name: 'cycledata',
        meta: {title: '周期数据'},
        component: () => import('../views/dataAnalysis/CycleData.vue')
    },
    normaldist: {
        path: 'normaldist',
        name: 'normaldist',
        meta: {title: '正太分布'},
        component: () => import('../views/dataAnalysis/NormalDist.vue')
    },
    attachmanage: {
        path: 'attachmanage',
        name: 'attachmanage',
        meta: {title: '附件管理'},
        component: () => import('../views/dataManage/AttachManage.vue')
    },
    datamanage: {
        path: 'datamanage',
        name: 'datamanage',
        meta: {title: '数据管理'},
        component: () => import('../views/dataManage/DataManage.vue')
    },
    productmanage:{
        path: 'productmanage',
        name: 'productmanage',
        meta:{title: '阴极板列表'},
        component: () => import('../views/productManage/ProductManage.vue')
    },
    productcodecheck:{
        path:'productcodecheck',
        name:'productcodecheck',
        meta:{title:'编码检测'},
        component: () => import('../views/productManage/ProductCodeCheck.vue')
    },
    messagemanage:{
        path: 'messagemanage',
        name: 'messagemanage',
        meta:{title: '消息管理'},
        component: () => import('../views/messageManage/MessageManage.vue')
    },
    projectlist:{
        path:'projectlist',
        name:'projectlist',
        meta:{title:'项目列表'},
        component:()=>import('../views/projectManage/ProjectList.vue')
    },
    orderlist:{
        path:'orderlist',
        name:'orderlist',
        meta:{title:'订单列表'},
        component:()=>import('../views/projectManage/OrderList.vue')
    },
}

const createRouter = () => new Router({
    mode: 'history',
    routes: commonRoutes,
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export default router