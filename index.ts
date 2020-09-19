import "reflect-metadata";import { createConnection, getRepository, Repository } from "typeorm";
import * as Koa from "koa";import * as bodyParser from "koa-bodyparser";
import * as Router from "koa-router";import * as koaStatic from "koa-static";
import * as views from "koa-views";import * as fs from "fs";import * as Jwt from "jsonwebtoken"
import { Conf, Maps } from './config';import { encryptPwd, NTo10 } from "./ts/utils/cryptoUtil"
import { User } from './ts/entity/User';import "./ts/view";import * as path from "path";
import { Tag } from "./ts/utils/tag";import { Routes } from "./ts/decorator";
import { Menu } from "./ts/entity/Menu";

createConnection().then(async conn => {Tag.Init(conn.name);//Require to use decorator preprocessing
  await fs.readdirSync(__dirname+"/ts/entity").forEach(i=>{
    const en=require(__dirname+"/ts/entity/"+i);Conf[Object.keys(en)[0]]=getRepository(en[Object.keys(en)[0]])
  });
  await fs.readdirSync(__dirname+"/ts/controller").forEach((i)=>{require(__dirname+"/ts/controller/"+i)})
  const app = new Koa().use(bodyParser({jsonLimit:Conf.jsonLimit,formLimit:"5mb",textLimit:"2mb"}))
  .use(views(path.join(__dirname,Conf.view),{autoRender:false,extension: 'html',map: { html: "ejs" }}))
  .use(koaStatic(path.join(__dirname,Conf.view),{defer:true}))
  .use(async (ctx, next) => {
    if(ctx.url.match(Conf.unless)){await next();return}
    const token:string=ctx.headers.a,s:string=ctx.headers.s?.match(/[^#]+/g)
    if(token&&s){
      try {
        let {payload}=Jwt.verify(token.replace(/^Bearer /,""),
          NTo10(s[0],Number("0x"+s[1])/79).toString(Conf.cipher),{complete:true}) as any;
        let ll:Array<any>=Object.entries(payload)[0];
        let l=ll[1] as Array<string>;//role list
        for (let i = 0; i < l.length; i++) {
          if(Maps.hasOwnProperty(l[i])){
            if(Maps[l[i]].includes(ctx.method+ctx.url.replace(/\/\d+$/,""))){await next();return}continue;
          }
          let m=await (Conf[Menu.name]as Repository<Menu>).createQueryBuilder("m").leftJoin("m.roles","role")
          .select("m.path").where("role.name =:e",{e:l[i]}).getMany();m.forEach((e,i,l)=>{(l[i] as any)=e.path});
          Maps[l[i]]=m;if((m as any).includes(ctx.method+ctx.url.replace(/\/\d+$/,""))){await next();m=null;return}m=null;
        }//权限验证包括方法拼接url
        if(ll[0]==="admin"){await next();return}
        ctx.status=403;ctx.body="Forbidden";l=ll=payload=null
      } catch (e) { console.error(e);e=String(e);
        if(e.includes('TokenExpiredError')){
          ctx.status=401;ctx.body="Jwt Expired";
        }else if(e.includes('QueryFailedError')){
          ctx.status=406;ctx.body=e;
        }else{ctx.status=401;ctx.body=e;}
      }
    }else{
      ctx.status=401;ctx.body="Authentication Error";console.log(ctx.method+ctx.url)
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
  return Conf[User.name].save(new User("admin",encryptPwd("654321")))
    .then(user => {console.log("User has been saved: ", user);
  }).catch(e => {if(String(e).indexOf("ER_DUP_ENTRY")>0)console.error("賬戶已存在！")});
}).catch(e => {console.error(e)});
