import "reflect-metadata";import { createConnection } from "typeorm";
import * as Koa from "koa";import * as bodyParser from "koa-bodyparser";
import * as Router from "koa-router";import * as koaStatic from "koa-static";
import * as views from "koa-views";import * as fs from "fs";import * as Jwt from "jsonwebtoken"
import { Conf } from './config';import { encryptPwd, NTo10 } from "./ts/utils/cryptoUtil"
import { User } from './ts/entity/User';import "./ts/view";import * as path from "path";
import { Tag } from "./ts/utils/tag";import { Routes } from "./ts/decorator";

createConnection().then(async conn => {Tag.Init(conn.name);//Require to use decorator preprocessing
  await fs.readdirSync(__dirname+"/ts/controller").forEach((i)=>{require(__dirname+"/ts/controller/"+i)})
  const app = new Koa().use(bodyParser({jsonLimit:Conf.jsonLimit,formLimit:"5mb",textLimit:"2mb"}))
  .use(views(path.join(__dirname,Conf.view),{autoRender:false,extension: 'html',map: { html: "ejs" }}))
  .use(koaStatic(path.join(__dirname,Conf.view),{defer:true}))
  .use(async (ctx, next) => {
    if(ctx.url.match(Conf.unless)){await next();return}
    const token:string=ctx.headers.a,s:string=ctx.headers.s?.match(/[^#]+/g)
    if(token&&s){
      try {
        Jwt.verify(token.replace(/^Bearer /,""),
        NTo10(s[0],Number("0x"+s[1])/79).toString(Conf.cipher),
        {complete:true});await next();
      } catch (e) { e=String(e);
        if(e.includes('TokenExpiredError')){
          ctx.status=401;ctx.body="Jwt Expired";
        }else if(e.includes('QueryFailedError')){
          ctx.status=406;ctx.body="ER_NO_DEFAULT_FOR_FIELD";
        }else{ctx.status=401;ctx.body=e;}
      }
    }else{
      ctx.status=401;ctx.body="Authentication Error";console.log(ctx.url)
    }
  })
  Conf.DATABASE=conn.driver.database;
  const router = new Router();//console.log(Routes)
  Routes.forEach(r => {
    router[r.m](...r.w?[r.r,...r.w]:[r.r],async(ctx:Koa.Context,next)=>{
      await r.a(ctx,next)
    })
  })
  app.use(router.routes()).use(router.allowedMethods()).listen(Conf.port,"0.0.0.0",()=>
    console.log(`ThinkTs run on http://localhost:${Conf.port} to see`))
  return conn.getRepository(User).save(new User("asciphx",encryptPwd("654321")))
    .then(user => {console.log("User has been saved: ", user);
  }).catch(e => {if(String(e).indexOf("ER_DUP_ENTRY")>0)console.error("賬戶已存在！")});
}).catch(e => {console.error(e)});
