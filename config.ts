export const Config={
  printRoute:true,//Output routing JSON file in 'dist/routes'
  port:3000,
  upload:"upload",
  expiresIn:"10h",//10个小时内jwt不会过期
  cipher:0x24,//目前是最大值，最小是0x2，建议不与secret一致
  secret:13+Math.random()*23|0,//范围13~35，会比较推荐
  //用|分隔符隔开，正则匹配开销更小
  unless:/^\/static\/*|\/user\/register|\/user\/login|\/login.html|\/favicon.ico/,
  jsonLimit:"1mb",
  view:'./views'
}