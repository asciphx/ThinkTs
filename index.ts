import "reflect-metadata";import { createConnection } from "typeorm";
import * as Koa from "koa";import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser";
import * as views from "koa-views";import * as fs from "fs";
import * as jwt from "koa-jwt";import { Config } from './config';
import { Routes } from "./src/decorator";

createConnection().then(async connection => {require(__dirname+"/src/controller.ts")//Import to use decorator preprocessing
  await fs.readdirSync(__dirname+"/src/controller").forEach((i)=>{require(__dirname+"/src/controller/"+i)})
  const app = new Koa().use(bodyParser({jsonLimit:Config.jsonLimit,formLimit:"5mb",textLimit:"2mb"}))
  .use(views(require('path').join(__dirname,'./views'),{
    extension: 'html',map: { html: "ejs" }
  })).use(jwt({secret:Config.secret}).unless({path:[/^\/user\/register/,/^\/user\/login/,/^\/login\.html/] }));
  const router = new Router();
  Routes.forEach(r => {
    router[r.m](...r.w?[r.r,...r.w]:[r.r],async(ctx:Koa.Context,next)=>{
      await r.a(ctx,next)
    })
  })
  app.use(router.routes()).use(router.allowedMethods()).listen(Config.port,"0.0.0.0",()=>
    console.log(`ThinkTs run on http://localhost:${Config.port} to see`))
}).catch(error => console.log(error));
