export const Config={
  printRoute:true,//Output routing JSON file in 'dist/routes'
  port:3000,
  upload:"upload",
  secret:Math.random()*20+17,//最大36，最小17，建议数值越大，会节省Headers
  //用|分隔符隔开，正则匹配开销更小
  unless:/^\/static\/*|\/user\/register|\/user\/login|\/login.html|\/favicon.ico/,
  jsonLimit:"1mb",
  view:'./views'
}