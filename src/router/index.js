import Vue from 'vue'
import VueRouter from 'vue-router'
import MainPage from '../views/main.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'MainPage',
        component: MainPage
    },
    {
        path: '/shexiangtou',
        name: 'shexiangtou',
        component: () =>
            import ('../components/shexiangtou.vue')
    },
    {
        path: '/share',
        name: 'share',
        component: () =>
            import ('../components/share.vue')
    },
    {
        path: '/useHttpShare',
        name: 'useHttpShare',
        component: () =>
            import ('../components/useHttpShare.vue')
    },
    {
        path: '/canvas',
        name: 'canvas',
        component: () =>
            import ('../components/canvas.vue')
    },
    {
        path: '/copyCanvas',
        name: 'copyCanvas',
        component: () =>
            import ('../components/copyCanvas.vue')
    },
    {
        path: '/fenbianlv',
        name: 'fenbianlv',
        component: () =>
            import ('../components/fenbianlv.vue')
    },
    {
        path: '/record',
        name: 'record',
        component: () =>
            import ('../components/record.vue')
    },
    {
        path: '/copy',
        name: 'copy',
        component: () =>
            import ('../components/video_to_video.vue')
    },
    {
        path: '/peer',
        name: 'peer',
        component: () =>
            import ('../components/peer.vue')
    },
    {
        path: '/add',
        name: 'add',
        component: () =>
            import ('../components/addMore.vue')
    },
    {
        path: '/sendText',
        name: 'sendText',
        component: () =>
            import ('../components/sendText.vue')
    },
    {
        path: '/sendFile',
        name: 'sendFile',
        component: () =>
            import ('../components/sendFile.vue')
    },
    {
        path: '/luping',
        name: 'luping',
        component: () =>
            import ('../components/luping.vue')
    },



]

const router = new VueRouter({
    routes
})

export default router