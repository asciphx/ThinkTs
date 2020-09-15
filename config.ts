export const Config={
  printRoute:true,//Output routing JSON file in 'dist/routes'
  port:3000,
  upload:"upload",
  unless:['/user/login','/user/register','/login.html',"/favicon.ico"],
  jsonLimit:"1mb",
  view:'./views'
}