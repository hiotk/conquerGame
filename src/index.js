import './styles/index.less'

// polyfill
window.THREE = require('three');
require('../three/build/JDLoader.min.js')
require('./scripts/utils/ws.js')
require('./scripts/utils/wsclient.js')
function initWS(options){
    WIS.Init(options)
    return WIS
}
window.MainWIS = initWS({
    dmsHost: 'game.hiotk.com',
    useSSL: true,
    room: 'testroom'
});
// TODO 发送消息范例
// MainWIS.SyncData({cmd: 'move', data: {left: 1}})
var _history = require('./router').default
import { getToken, setToken } from '@/utils/auth'
import { login } from '@/api/user'
import { saveJson } from '@/utils/store'
// import currentScene from './router'
import {getQueryString} from '@/utils/index.js'

import Application from './core/application/Application'; // 应用模块
import Store from './core/store/store'; // 数据存储
import Units from './scripts/units'; // 数据存储单元

window.app = new Application({
    history: _history,
    store: new Store(),
    units: Units,
    platform: Application.Platform.H5
});


app.start();
// /**
//  * 修改unit数据示例
//  */
// app.store.dispatch({
//     type: 'enemy/unitAction',
//     payload: {
//         cmd: 'createEnemy',
//         data: {
//             position: { x: 10, y: 10 }
//         }
//     }
// })


    // var token = getToken()
    // var code = getQueryString('code');
    // if(!token && !code){
    //   location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx60ce9c6ddb68e54c&redirect_uri=http://wx.hiotk.com&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect'
    // }else if(code){
    //   //发送请求给后端
    //   login({
    //     code: code
    //   }).then(response => {
    //     console.log(response)
    //     if(response.data.status == 'success'){
    //         setToken(response.headers.token)
    //         saveJson('uerInfo', response.data.data)
    //     }
    //     _history.current.scene.Init(canvas)
    //     document.body.appendChild(canvas);
    //   }).catch((e) => {
    //     _history.current.scene.Init(canvas)
    //     document.body.appendChild(canvas);
    //   })
    // }else{
    //     _history.current.scene.Init(canvas)
    //     document.body.appendChild(canvas);
    // }

    //}

