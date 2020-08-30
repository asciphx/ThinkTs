import "reflect-metadata";import { createConnection } from "typeorm";
import * as Koa from "koa";import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser";import * as koaStatic from "koa-static";
import * as views from "koa-views";import * as fs from "fs";
import * as jwt from "koa-jwt";import { Config } from './config';
import { Routes } from "./ts/decorator";import * as path from "path"

createConnection().then(async connection => {require(__dirname+"/ts/controller.ts")//Import to use decorator preprocessing
  await fs.readdirSync(__dirname+"/ts/controller").forEach((i)=>{require(__dirname+"/ts/controller/"+i)})
  const app = new Koa().use(bodyParser({jsonLimit:Config.jsonLimit,formLimit:"5mb",textLimit:"2mb"}))
  .use(views(require('path').join(__dirname,Config.view),{
    extension: 'html',map: { html: "ejs" }
  })).use(koaStatic(path.join(__dirname,Config.view),{defer:true}))
  //.use(jwt({secret:Config.secret}).unless({path:[/^\/user\/register/,/^\/user\/login/,/^\/login\.html/] }));
  const router = new Router();//console.log(Routes)
  Routes.forEach(r => {
    router[r.m](...r.w?[r.r,...r.w]:[r.r],async(ctx:Koa.Context,next)=>{
      await r.a(ctx,next)
    })
  })
  app.use(router.routes()).use(router.allowedMethods()).listen(Config.port,"0.0.0.0",()=>
    console.log(`ThinkTs run on http://localhost:${Config.port} to see`))
}).catch(error => console.log(error));
