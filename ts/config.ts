const Conf={
  printRoute:true,//打印路由routes
  port:8080,
  DATABASE:"",//启动时匹配ormconfig.json中的数据库
  upload:"upload",
  expiresIn:"10h",
  noJwt:false,//启用jwt验证
  cipher:0x24,//0x2~0x24，静态，可配置
  secret:19+Math.random()*17|0,//2~36,动态，配置无效
  unless:/^\/static\/*|\/user\/register|\/user\/login|\/login.html|\/index.html|\/favicon.ico/,
  jsonLimit:"1mb",
  view:'../views'
} 
const Cache:Object={}
const Maps:Object={}
export {Conf,Cache,Maps}