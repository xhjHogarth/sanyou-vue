import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        isShowLoading: false, // 全局 loading
        // 左侧菜单栏数据
        menuItems: [
            {
                name: 'home', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'md-home', // icon类型
                text: '主页', // 文本内容
            },
            // {
            //     name: 'other', // 要跳转的路由名称 不是路径
            //     size: 18, // icon大小
            //     type: 'ios-egg-outline', // icon类型
            //     text: '单独的路由', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            // },
            // {
            //     size: 18, // icon大小
            //     type: 'md-arrow-forward', // icon类型
            //     text: '外链',
            //     url: 'https://www.baidu.com',
            //     isExternal: true, // 外链 跳到一个外部的 URL 页面
            // },
            {
                text: '用户管理',
                type: 'ios-paper',
                children: [
                    {
                        type: 'ios-grid',
                        name: 'userlist',
                        text: '用户列表',
                        // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                        // hidden: true,
                    },
                    {
                        type: 'ios-grid',
                        name: 'factory',
                        text: '厂家管理',
                    },
                    // {
                    //     size: 18, // icon大小
                    //     type: 'md-arrow-forward', // icon类型
                    //     text: '外链',
                    //     url: 'https://www.baidu.com',
                    //     isExternal: true, // 外链 跳到一个外部的 URL 页面
                    // },
                    // {
                    //     text: '三级菜单',
                    //     type: 'ios-paper',
                    //     children: [
                    //         {
                    //             type: 'ios-notifications-outline',
                    //             name: 'msg',
                    //             text: '查看消息',
                    //         },
                    //         {
                    //             type: 'md-lock',
                    //             name: 'password',
                    //             text: '修改密码',
                    //         },
                    //         {
                    //             type: 'md-person',
                    //             name: 'userinfo',
                    //             text: '基本资料',
                    //         },
                    //         // {
                    //         //     size: 18, // icon大小
                    //         //     type: 'md-arrow-forward', // icon类型
                    //         //     text: '外链',
                    //         //     url: 'https://www.baidu.com',
                    //         //     isExternal: true, // 外链 跳到一个外部的 URL 页面
                    //         // },
                    //     ],
                    // },
                ],
            },
            {
                text: '权限管理',
                type: 'ios-paper',
                children: [
                    {
                        type: 'ios-grid',
                        name: 'usergroup',
                        text: '用户组管理',
                    },
                    {
                        type: 'ios-grid',
                        name: 'role',
                        text: '角色管理',
                    },
                    {
                        type: 'ios-grid',
                        name: 'resource',
                        text: '权限管理',
                    }
                ]
            },
            {
                text: '操作日志',
                type: 'ios-paper',
                children: [
                    {
                        type: 'ios-grid',
                        name: 'operationlog',
                        text: '后台操作日志',
                    }
                ]
            },
            {
                text: '设备管理',
                type: 'ios-paper',
                children: [
                    {
                        type: 'ios-grid',
                        name: 'eqinfo',
                        text: '设备信息',
                    },
                    {
                        type: 'ios-grid',
                        name: 'eqmap',
                        text: '设备地图',
                    },
                    {
                        type: 'ios-grid',
                        name: 'paramrecord',
                        text: '参数修改记录',
                    }
                ],
              
            },
            {
                text: '数据分析',
                type: 'ios-paper',
                children: [
                    {
                        type: 'ios-grid',
                        name: 'rtdata',
                        text: '实时数据',
                    },
                    {
                        type: 'ios-grid',
                        name: 'hisdata',
                        text: '历史数据',
                    },
                    {
                        type: 'ios-grid',
                        name: 'cycledata',
                        text: '周期数据',
                    },
                    {
                        type: 'ios-grid',
                        name: 'normaldist',
                        text: '正太分布',
                    }
                ],
            },
            {
                text: '数据管理',
                type: 'ios-paper',
                children: [
                    // {
                    //     type: 'ios-grid',
                    //     name: 'attachmanage',
                    //     text: '附件管理',
                    // },
                    {
                        type: 'ios-grid',
                        name: 'datamanage',
                        text: '数据管理',
                    }
                ]
            },
            {
                text: '项目管理',
                type:'ios-paper',
                children:[
                    {
                        type: 'ios-grid',
                        name: 'projectlist',
                        text: '项目列表',
                    },
                    {
                        type: 'ios-grid',
                        name: 'orderlist',
                        text: '订单列表',
                    }
                ]
            },
            {
                text: '阴极板管理',
                type: 'ios-paper',
                children: [
                    {
                        type: 'ios-grid',
                        name: 'productmanage',
                        text: '阴极板列表',
                    },
                    {
                        type:'ios-grid',
                        name:'productcodecheck',
                        text:'编码检测'
                    }
                ]
            },
            {
                text: '消息管理',
                type: 'ios-paper',
                children: [
                    {
                        type: 'ios-grid',
                        name: 'messagemanage',
                        text: '消息管理',
                    }
                ]
            }
            
        ],
    },
    mutations: {
        setMenus(state, items) {
            state.menuItems = [...items]
        },
        setLoading(state, isShowLoading) {
            state.isShowLoading = isShowLoading
        },
    },
})

export default store