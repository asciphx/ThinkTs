import "reflect-metadata";import { createConnection } from "typeorm";
import * as Koa from "koa";import * as bodyParser from "koa-bodyparser";
import * as Router from "koa-router";import * as koaStatic from "koa-static";
import * as views from "koa-views";import * as fs from "fs";import * as Jwt from "jsonwebtoken"
import { Config } from './config';import { Routes } from "./ts/decorator";import * as path from "path";
import { User } from './ts/entity/User';import "./ts/view";
import { Tag } from "./ts/utils/tag";import {encryptPassword} from "./ts/utils/cryptoUtil"

createConnection().then(async connection => {Tag.Init(connection.name);//Require to use decorator preprocessing
  await fs.readdirSync(__dirname+"/ts/controller").forEach((i)=>{require(__dirname+"/ts/controller/"+i)})
  const app = new Koa().use(bodyParser({jsonLimit:Config.jsonLimit,formLimit:"5mb",textLimit:"2mb"}))
  .use(views(path.join(__dirname,Config.view),{
    extension: 'html',map: { html: "ejs" }
  })).use(koaStatic(path.join(__dirname,Config.view),{defer:true}))
  .use(async (ctx, next) => {
    if(Config.unless.includes(ctx.url)||ctx.url.match(/^\/static\/*/)){await next();return}
    const token = ctx.headers.authorization;
    if(token){
      try {
        Jwt.verify(token.split(' ')[1],ctx.headers.secret,{complete:true});await next();
      } catch (e) {
        ctx.status=401;ctx.body=String(e);
      }
    }else{
      ctx.status=401;ctx.body="Authentication Error";console.log(ctx.url)
    }
  })//上面的方法是鉴权，由于koa-jwt只能允许静态的secret便移除了，而现在允许前后端协调动态secret
  const router = new Router();//console.log(Routes)
  Routes.forEach(r => {
    router[r.m](...r.w?[r.r,...r.w]:[r.r],async(ctx:Koa.Context,next)=>{
      await r.a(ctx,next)
    })
  })
  app.use(router.routes()).use(router.allowedMethods()).listen(Config.port,"0.0.0.0",()=>
    console.log(`ThinkTs run on http://localhost:${Config.port} to see`))
  return connection.getRepository(User).save(new User("asciphx",encryptPassword("654321")))
    .then(user => {console.log("User has been saved: ", user);
  }).catch(e => {if(String(e).indexOf("ER_DUP_ENTRY")>0)console.error("賬戶已存在！")});
}).catch(e => {console.error(e)});
