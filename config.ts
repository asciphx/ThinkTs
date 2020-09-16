export const Config={
  printRoute:true,//Output routing JSON file in 'dist/routes'
  port:3000,
  upload:"upload",
  cipher:0x24,//目前是最大值，最小是0x2，不能与secret相同
  secret:13+Math.random()*23|0,//最小13，最大35，建议数值越大，会节省Headers
  //用|分隔符隔开，正则匹配开销更小
  unless:/^\/static\/*|\/user\/register|\/user\/login|\/login.html|\/favicon.ico/,
  jsonLimit:"1mb",
  view:'./views'
}