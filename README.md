基于web的目录浏览demo
==================================

## Goals
- isomorphic react flux express构架
- gulp browserify jest自动化编译与单元测试
- 根据浏览器请求路径返回请求目录下所有子文件列表
- 监测express server执行路径文件变化信息(增删目录, 增删改文件)
- 以socket.io通知浏览器端界面显示变化信息
- 支持过滤非监测文件目录配置

注: 服务器在nodejs 0.10.38上测试通过
    单元测试目前只能在0.10上运行
    客户端在linux下chrome和firefox测试正常

## Setup

Install npm packages
```
  npm install
```

Install bower packages
```
  bower install
```

Install Global Gulp
```
  npm install -g gulp
```

## Run
1. Gulp

```
  gulp
```

2. Express

```
  npm run server
```
3. Unit Test

```
  npm test
```

## Layouts

```
.
├── public/                       # 静态js,css,fonts生成存储位置
├── actions/                      # 触发store改变的动作内容
│   ├── toggle_action.js            # 目录树节点打开,关闭,浏览动作
│   └── watch_action.js             # 服务端文件改动响应动作
├── config/                      
│   └── index.js                    # 过滤监测文件配置信息(默认., node_modules, bower_components开头文件)             
├── constants/                    # 枚举定义列表 
│   ├── flux_const.js               # flux相关的ActionType等常量
│   └── mtree_const.js              # mtree相关的枚举定义
├── dispatcher/                   # flux Dispatcher
│   └── index.js
├── models/                       
│   ├── __tests__/
│   └── mtree.js                  # 树节点基础结构的定义与相关操作函数
├── routes/                       # Express路由实现
│   ├── home.js                     # 主站点路由,返回当前运行目录下所有子文件列表
│   └── folder.js                   # 文件夹返回路由,返回访问路径下所有子文件列表
├── stores/                       # Flux stores
│   └── mtree_store.js            # 树节点存储与响应查看修改等动作
├── styles/                       # 客户端样式
│   ├── app.scss                    # 汇总样式
│   ├── common.scss.scss            # 公用SCSS变量定义
│   ├── mixins.scss                 # mixins函数定义
│   ├── main.scss                   # 树容器样式定义
│   └── mtree-ui                    # modules树节点样式定义
├── utils/                        # 公用函数
│   ├── __tests__/
│   └── globals.js                  # 提供文件枚举和服务运行目录信息
├── views/                        # Express视图,React Components
│   ├── __tests__/
│   ├── error.jsx                   # 服务端错误信息界面
│   ├── html.jsx                    # 服务端响应主界面
│   ├── mtree_app.jsx               # app生成界面
│   └── mtree_ui.jsx                # modules tree生成界面
├── webservices/
│   └── module_watcher.js           # web服务监测目录文件变化,通知客户端 
├── server.js                     # express server 主程序启动脚本
├── gulp/                         # gulp 任务脚本
├── node_modules/                 # 3rd-party npm libraries and utilities
├── bower_components/             # 3rd-party bower libraries and utilities
├── bower.json 
├── gulpfile.js
├── package.json
└── preprocessor.js               # 单元测试jsx预处理脚本 
```

## TODOs
1. 多平台客户端浏览器测试(IOS, Android, IE, Chrome, Firefox)
2. 大量文件同时变化情况下客户端响应测试
3. 多客户端访问测试
4. 提高单元测试覆盖率
5. 提高mtree-ui\mtree可重用性
6. 使用React CCSTransition代替目前的animation


## Refrences
- https://github.com/reactjs/express-react-views
- https://github.com/ikukissa/isomorphic-flux-concept
- https://github.com/scotch-io/react-tweets
- https://github.com/dqdinh/react-flux-coffeescript-browserify-gulp-demo
- https://github.com/aslansky/react-stack-playground
- https://github.com/shidhincr/react-jest-gulp-jspm-seed
- https://github.com/bguiz/browserify-gulp-starter
- https://github.com/buunguyen/octotree
- http://projects.lukehaas.me/css-loaders/
- https://daneden.github.io/animate.css/

## License
MIT
