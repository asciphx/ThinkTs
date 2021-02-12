import "reflect-metadata";import * as Koa from "koa";import * as bodyParser from "koa-bodyparser";
import * as Jwt from "jsonwebtoken";import * as path from "path";import * as views from "koa-views";
import * as koaStatic from "koa-static";import { ROUTER } from "./think/decorator";import "./view";
import { Conf } from './config';import { NTo10 } from "./utils/crypto";import"./conn";

const {unless}=Conf,{noJwt}=Conf,CORS='null http://127.0.0.1:3000';
const APP = new Koa().use(bodyParser({ jsonLimit: Conf.jsonLimit, formLimit: "3mb", textLimit: "2mb" }))
  .use(views(path.join(__dirname,Conf.view),{autoRender:false,extension:'html',map:{html:"ejs"}})as Koa.Middleware)
  .use(koaStatic(path.join(__dirname,Conf.view),{defer:true}))
  .use(koaStatic(path.join(__dirname,"../"+Conf.upload)))
  .use(async (ctx, next) => {const {originalUrl}=ctx,{origin}=ctx.request.header;ctx.vary('Origin');
    origin!==undefined&&ctx.set('Access-Control-Allow-Origin',CORS.includes(origin)?origin:"");
    ctx.set('Access-Control-Allow-Headers','content-type,cache-control,x-requested-with,t,s');
    ctx.set('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
    ctx.set('Access-Control-Allow-Credentials',"true");
    if (ctx.method === 'OPTIONS') { ctx.body=200; }
    if(noJwt||originalUrl.substr(1,6)==="static"||!!unless.exec(originalUrl)){await next();return}
    const {s}=ctx.headers,TOKEN:string=ctx.headers.t;let S:string[]=s===undefined?void 0:s.match(/[^#]+/g);
    if(TOKEN===undefined||S===void 0){
      ctx.status=401;ctx.body="Headers Error";
    }else{
      try {
        Jwt.verify(TOKEN.replace(/^Bearer /,""),String(NTo10(S[0],Number("0x"+S[1])/Conf.cipher)),{complete:false});
        S=null;await next();// console.log(ctx.method+ctx.url.replace(/[0-9A-Z_]+|(\w+)\?.+$/,"$1"));
      } catch (e) {const ERR=String(e);
        if(ERR.includes('TokenExpiredError')){ ctx.status=401;ctx.body="Jwt Expired";
        }else if(ERR.includes('QueryFailedError')){ctx.status=406;ctx.body=e;
        }else{console.error(e);ctx.status=401;ctx.body="Authentication Error";}
      }
    }
});
setInterval(()=>{Conf.secret=11+Math.random()*25|0;},1414);
APP.use(ROUTER.routes()).use(ROUTER.allowedMethods()).listen(Conf.port,"0.0.0.0",()=>{
  console.log('\x1B[36;1m%s\x1B[22m',`ThinkTs run on http://localhost:${Conf.port}/test.html`)});