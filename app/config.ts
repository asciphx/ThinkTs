import { Redis as Red } from "ioredis"; const $port = Number(process.env.PORT) || 3002;
const Conf = {
  printRoute: true,//打印路由routes
  port: $port !== 3002 ? $port : 8080,//3002是nodemon的默认端口,需判断
  DATABASE: "",//启动时匹配ormconfig.js中的database
  TYPE: "",//启动时匹配ormconfig.js中的type
  upload: "upload",//上传文件夹目录
  expiresIn: "10h",//jwt有效期
  noJwt: true,//是否禁用jwt验证，默认禁用[方便开发]
  staticKey: "اشيخ",//静态公钥，可配crypto.ts中常量c的内部字符
  cipher: 0x4F,//秘钥，可配置范围0x25~0x5F
  secret: 19 + Math.random() * 17 | 0,//2~36,动态私钥，配置无效
  unless: /\/user\/register|\/user\/login|\/login.html|\/test.html|\/favicon.ico/,
  jsonLimit: "1mb",
  view: '../dist',//静态文件相对路径,现方便前端打包拿来即用
  synchronize: 6000//同步间隔毫秒,也就是说一个就等于6个redis，不过延迟6秒(这里是打比方)
}//数据库的配置在ormconfig.js文件
const Maps: Object = {}, vType: Object = {};
const Redis = new Red({
  port: 6379,
  host: "127.0.0.1",
  family: 4,
  // password: "6543210",
  db: 0,
  retryStrategy() { return null }
});
export { Conf, Maps, Redis, vType }