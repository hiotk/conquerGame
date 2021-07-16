## Application类

Application类的实例为应用的入口。

#### 构造方法

- constructor({ history, store, units, platform })

    history：RouteHistory路由对象

    store：Store类实例

    units：Unit类实例集合

    platform: Application.Platform枚举变量

#### 静态变量

Application.Platform 平台类型

#### 方法

- start 启动实例

#### 代码示例

    import Application from './core/application/Application'; // 应用模块
    import Store from './core/store/store'; // 数据存储
    import Units from './scripts/units'; // 数据存储单元
    import _history from './router'; // 场景路由

    var app = new Application({
        history: _history,
        store: new Store(),
        units: Units,
        platform: Application.Platform.H5
    });

    app.start();

源代码路径: [application/Application.js](../application/Application.js)

## Scene类

## WebglScene类

## BabylonScene类

## Controller类

## Model类

## RouteHistory


## SoundManager类

## SoundListener类

## SoundSpeaker类

## Store类

## Unit类

## Component类

## CText类

## CImage类

## CLayout类

## CRect类

## CGroup类

## CButton类

## CToggleButton类

## CScrollView类

## Preload类
