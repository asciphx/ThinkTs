export const Config={
  printRoute:true,//Output routing JSON file in 'dist/routes'
  port:3000,
  DATABASE:"",//服务器启动时会填ormconfig.json中配置的数据库名
  upload:"upload",
  expiresIn:"10h",//10个小时内jwt不会过期
  cipher:0x24,//目前是最大值，最小是0x2
  secret:19+Math.random()*17|0,//范围19~35
  //用|分隔符隔开，正则匹配开销更小
  unless:/^\/static\/*|\/user\/register|\/user\/login|\/login.html|\/favicon.ico/,
  jsonLimit:"1mb",
  view:'./views'
}