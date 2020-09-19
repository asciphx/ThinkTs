const Conf={
  printRoute:true,//打印路由到routes目录
  port:3000,
  DATABASE:"",//启动时会匹配ormconfig.json中的数据库
  upload:"upload",
  expiresIn:"10h",//10个小时内jwt不会过期
  cipher:0x24,//最大值0x24，最小是0x2
  secret:19+Math.random()*17|0,//19~35
  unless:/^\/static\/*|\/user\/register|\/user\/login|\/login.html|\/favicon.ico/,
  jsonLimit:"1mb",
  view:'./views'
} 
const Maps:Object={}
export {Conf,Maps}