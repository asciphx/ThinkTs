const Conf={
  printRoute:true,//打印路由routes
  port:8080,
  DATABASE:"",//启动时匹配ormconfig.js中的database
  TYPE:"",//启动时匹配ormconfig.js中的type
  upload:"upload",//上传文件夹路径
  expiresIn:"10h",//jwt有效期
  noJwt:false,//是否禁用jwt验证，默认不禁用
  staticKey:"اشيخ",//静态公钥，可配crypto.ts中常量c的内部字符
  cipher:0x4F,//秘钥，可配置范围0x25~0x5F
  secret:19+Math.random()*17|0,//2~36,动态私钥，配置无效
  unless:/^\/static\/*|\/user\/register|\/user\/login|\/login.html|\/test.html|\/favicon.ico/,
  jsonLimit:"1mb",
  view:'../views'
} 
const Cache:Object={}
export {Conf,Cache}