import IORedis=require ("ioredis");
const Conf={
  printRoute:true,//打印路由routes
  port:8080,
  DATABASE:"",//启动时匹配ormconfig.json中的database
  TYPE:"",//启动时匹配ormconfig.json中的type
  upload:"upload",//上传文件夹路径
  expiresIn:"10h",//jwt有效期
  noJwt:false,//是否禁用jwt验证，默认不禁用
  cipher:0x24,//0x2~0x24，静态公钥，可配置
  secret:19+Math.random()*17|0,//2~36,动态私钥，配置无效
  unless:/^\/static\/*|\/user\/register|\/user\/login|\/login.html|\/test.html|\/favicon.ico/,
  jsonLimit:"1mb",
  view:'../views',
  synchronize:6000//同步间隔毫秒,也就是说一个就等于6个redis，不过延迟6秒(这里是打比方)
} 
const Cache:Object={}
const Maps:Object={}
const Redis=new IORedis({
    port: 6379,
    host: "127.0.0.1",
    family: 4,
    password: "6543210",
    db:0
  });
export {Conf,Cache,Maps,Redis}