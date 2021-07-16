## 微信端开发须知

- `game.js` 和 `game.json` 为小游戏的入口文件和配置文件

## H5端开发须知

- `src/index.js` 和 `src/index.html` 为H5的入口文件和HTML文件

## 注意实现

- `src` 目录为微信端和H5端公用代码库
- `three/build` 目录为微信端three.js库引用(而H5端是从node_modules中打包得到)

## 数据库

  docker-compose -f docker-compose-dev.yml up

#### HOST配置

  127.0.0.1 wx.hiotk.com

#### NGINX配置

  upstream game {
      server 127.0.0.1:8000;
  }
  server {
    listen 80;

    server_name wx.hiotk.com;
    location / {
      proxy_set_header Host $host;
      proxy_pass http://game;
      add_header 'Access-Control-Allow-Origin' '*';
    }
  }

## Todo

1. 完善游戏逻辑

- [x] 玩家构建区域加分
- [x] 玩家构建区域过程中，消灭怪物加分
- [ ] 上传游戏分数

2. 完善剩余界面

- [ ] 排行榜
- [x] 游戏结束场景

3. 加入websocket

- [x] 加入websocket客户端代码
- [ ] 加入消息分发逻辑

4. 增加多人逻辑

- [ ] 邀请多名玩家页面
- [ ] 多名玩家游戏页面


## 单人游戏API

1. 玩家登录
2. 获取玩家所有好友列表和成绩
3. 获取玩家最好历史成绩
4. 上传玩家分数

## 多人游戏API

1. 玩家登录
2. 获取玩家所有好友列表和成绩
3. 获取玩家最好历史成绩
4. 上传所有玩家分数
