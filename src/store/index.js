import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        socket: null,
        data: '',
        backData: ''
    },
    mutations: {
        sendData(state, data) {
            state.socket.send(data);
        },
        openSocket(state) {
            state.socket = new WebSocket("ws://localhost:5555");
            state.socket.onopen = () => {
                console.log('socket 已打开')
            }
            state.socket.onmessage = (t) => {
                console.log('socket 传递数据')
                state.backData = t.data
            }
            state.socket.onclose = () => {
                console.log('socket 已关闭')
            }
        },
        closeSocket(state) {
            if (state.socket) {
                state.socket.close()
            }
        }
    },
})