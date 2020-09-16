import "reflect-metadata";import { createConnection } from "typeorm";
import * as Koa from "koa";import * as bodyParser from "koa-bodyparser";
import * as Router from "koa-router";import * as koaStatic from "koa-static";
import * as views from "koa-views";import * as fs from "fs";import * as Jwt from "jsonwebtoken"
import { Config } from './config';import { encryptPwd, NTo10 } from "./ts/utils/cryptoUtil"
import { User } from './ts/entity/User';import "./ts/view";import * as path from "path";
import { Tag } from "./ts/utils/tag";import { Routes } from "./ts/decorator";

createConnection().then(async connection => {Tag.Init(connection.name);//Require to use decorator preprocessing
  await fs.readdirSync(__dirname+"/ts/controller").forEach((i)=>{require(__dirname+"/ts/controller/"+i)})
  const app = new Koa().use(bodyParser({jsonLimit:Config.jsonLimit,formLimit:"5mb",textLimit:"2mb"}))
  .use(views(path.join(__dirname,Config.view),{
    extension: 'html',map: { html: "ejs" }
  })).use(koaStatic(path.join(__dirname,Config.view),{defer:true}))
  .use(async (ctx, next) => {
    if(ctx.url.match(Config.unless)){await next();return}
    const token:string = ctx.headers.authorization;
    if(token){
      try {
        Jwt.verify(token.replace(/^Bearer /,""),
        NTo10(ctx.headers.secret,Config.secret).toString(Config.cipher),
        {complete:true});await next();
      } catch (e) {
        ctx.status=401;ctx.body=String(e);
      }
    }else{
      ctx.status=401;ctx.body="Authentication Error";console.log(ctx.url)
    }
  })//动态随机secret，范围在Config.secret,每次服务启动都是随机的，现在由后端在用户登录时提供
  const router = new Router();//console.log(Routes)
  Routes.forEach(r => {
    router[r.m](...r.w?[r.r,...r.w]:[r.r],async(ctx:Koa.Context,next)=>{
      await r.a(ctx,next)
    })
  })
  app.use(router.routes()).use(router.allowedMethods()).listen(Config.port,"0.0.0.0",()=>
    console.log(`ThinkTs run on http://localhost:${Config.port} to see`))
  return connection.getRepository(User).save(new User("asciphx",encryptPwd("654321")))
    .then(user => {console.log("User has been saved: ", user);
  }).catch(e => {if(String(e).indexOf("ER_DUP_ENTRY")>0)console.error("賬戶已存在！")});
}).catch(e => {console.error(e)});
