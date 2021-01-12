import "reflect-metadata";import {createConnection,getRepository,Repository,ObjectLiteral} from "typeorm";
import * as Koa from "koa";import * as bodyParser from "koa-bodyparser";import * as fs from "fs";
import * as koaStatic from "koa-static";import { ROUTER, cleanRoutes } from "./think/decorator";
import Tag from "./utils/tag";import * as Jwt from "jsonwebtoken";import * as path from "path";
import {Conf,Cache,socket,vType} from './config';import { encrypt, NTo10 } from "./utils/crypto";
import * as views from "koa-views";import { User } from './entity/User';import "./view";

createConnection().then(async conn => {Tag.Init(conn.name,9000);
  fs.readdir(__dirname + "/entity", async (e, f) => {
    for (let i of f){let en=require(__dirname+"/entity/"+i),key=Object.keys(en)[0];Cache[key]=getRepository(en[key]);en=null;
      let res=(Cache[key] as Repository<ObjectLiteral>).metadata.ownColumns;key=key.toLocaleLowerCase();vType[key]={};
      res.forEach(r=>{let t=r.type;Object.defineProperty(vType[key],r.propertyName,{enumerable:true,//@ts-ignore
      value:t==="datetime"?26:t.name==="Number"?10:t.name==="Boolean"?5:t==="tinyint"?3:t==="smallint"?5:
      t==="mediumint"?7:t==="bigint"?19:r.length===""?255:Number(r.length)});});//稳定版，富含参数校验
    }
    const EXIST = await Cache["User"].findOne({account:"admin"});
    if (EXIST) {console.error('\x1B[34;1m%s\x1B[22m', "董事长已存在!");return;} else
    return Cache["User"].save(new User({account:"admin",pwd:encrypt("654321","shake256","latin1",50)} as User))
      .then(user => {console.log("User has been saved: ", user);
    })
  });Conf.DATABASE = conn.driver.database;Conf.TYPE=conn.driver.options.type;
  const APP = new Koa().use(bodyParser({ jsonLimit: Conf.jsonLimit, formLimit: "3mb", textLimit: "2mb" }))
  .use(views(path.join(__dirname,Conf.view),{autoRender:false,extension: 'html',map: { html: "ejs" }}))
  .use(koaStatic(path.join(__dirname,Conf.view),{defer:true})).use(koaStatic(path.join(__dirname,"../ts")))
  .use(koaStatic(path.join(__dirname,"../"+Conf.upload)))
  .use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin',ctx.headers.origin);
    ctx.set('Access-Control-Allow-Headers','content-type');
    ctx.set('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
    ctx.set('Access-Control-Allow-Credentials',"true");
    if (ctx.method === 'OPTIONS') { ctx.body=200; }
    if(ctx.url.match(Conf.unless)||Conf.noJwt){await next();return}
    const TOKEN:string=ctx.headers.a,S:string=ctx.headers.s?ctx.headers.s.match(/[^#]+/g):null;
    if(TOKEN&&S){
      try {
        Jwt.verify(TOKEN.replace(/^Bearer /,""),String(NTo10(S[0],Number("0x"+S[1])/Conf.cipher)),{complete:false});await next();
        // console.log(ctx.method+ctx.url.replace(/[0-9A-Z_]+|(\w+)\?.+$/,"$1"));
      } catch (e) {
        if(String(e).includes('TokenExpiredError')){ ctx.status=401;ctx.body="Jwt Expired";
        }else if(String(e).includes('QueryFailedError')){ctx.status=406;ctx.body=e;
        }else{console.error(e);ctx.status=401;ctx.body="Authentication Error";}
      }
    }else{ctx.status=401;ctx.body="Headers Error";}
  });
  setInterval(()=>{Conf.secret=11+Math.random()*25|0;},1414);
  const SocketIo=require('http').createServer(APP.callback());socket.init(SocketIo);
  SocketIo.listen(Conf.port,()=>{console.log(`listening on *:${Conf.port}`);});
  APP.use(ROUTER.routes()).use(ROUTER.allowedMethods()).listen(Conf.port,"0.0.0.0",()=>{
    console.log('\x1B[35;47m%s\x1B[49m', "loading router……")});
  fs.readdir(__dirname+"/controller",(e, f)=>{for(let i of f)require(__dirname+"/controller/"+i);
    console.log('\x1B[36;1m%s\x1B[22m',`ThinkTs run on http://localhost:${Conf.port}/test.html`);cleanRoutes()});
})