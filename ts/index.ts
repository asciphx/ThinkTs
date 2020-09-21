import "reflect-metadata";import { createConnection, getRepository, Repository } from "typeorm";
import * as Koa from "koa";import * as bodyParser from "koa-bodyparser";import * as fs from "fs";
import * as Router from "koa-router";import * as koaStatic from "koa-static";
import * as views from "koa-views";import * as Jwt from "jsonwebtoken";import * as path from "path"
import { Conf, Cache, Maps } from './config';import { Routes } from "./think/decorator";
import { User } from './entity/User';import "./view";import { Menu } from "./entity/Menu";
import { Tag } from "./utils/tag";import { encryptPwd, NTo10 } from "./utils/cryptoUtil"

createConnection().then(async conn => {Tag.Init(conn.name);//Require to use decorator preprocessing
  await fs.readdirSync(__dirname+"/entity").forEach(i=>{
    const en=require(__dirname+"/entity/"+i),key=Object.keys(en)[0];Cache[key]=getRepository(en[key])
  });
  await fs.readdirSync(__dirname+"/controller").forEach((i)=>{require(__dirname+"/controller/"+i)})
  const app = new Koa().use(bodyParser({jsonLimit:Conf.jsonLimit,formLimit:"5mb",textLimit:"2mb"}))
  .use(views(path.join(__dirname,Conf.view),{autoRender:false,extension: 'html',map: { html: "ejs" }}))
  .use(koaStatic(path.join(__dirname,Conf.view),{defer:true}))
  .use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method === 'OPTIONS') { ctx.status=ctx.body=200; }
    if(ctx.url.match(Conf.unless)){await next();return}
    const token:string=ctx.headers.a,s:string=ctx.headers.s?.match(/[^#]+/g)
    if(token&&s){
      try {
        let {payload}=Jwt.verify(token.replace(/^Bearer /,""),
          NTo10(s[0],Number("0x"+s[1])/0x4F).toString(Conf.cipher),{complete:true}) as any;
        let ll:Array<any>=Object.entries(payload)[0], l=ll[1] as Array<string>;//role list
        const path=ctx.url.replace(/\d+|(\w+)\?.+$/,"$1")
        for (let i = 0; i < l.length; i++) {
          if(Maps.hasOwnProperty(l[i])){
            if(Maps[l[i]].includes(ctx.method+path)){await next();return}continue;
          }
          let m=await (Cache[Menu.name]as Repository<Menu>).createQueryBuilder("m").leftJoin("m.roles","role")
          .select("m.path").where(`role.name ="${l[i]}"`).getMany();
          if(m.length>0){m.forEach((e,i,l)=>{(l[i] as any)=e.path});Maps[l[i]]=m;}
          if((m as any).includes(ctx.method+path)){await next();m=null;return}m=null;
        }
        if(ll[0]==="admin"){await next();return}
        ctx.status=403;ctx.body=`'${ctx.method+path}' request is not authorized`;l=ll=payload=null
      } catch (e) {e=String(e);
        if(e.includes('TokenExpiredError')){ ctx.status=401;ctx.body="Jwt Expired";
        }else if(e.includes('QueryFailedError')){ ctx.status=406;ctx.body=e;
        }else{ctx.status=401;ctx.body="Authentication Error";}
      }
    }else{ ctx.status=401;ctx.body="Headers Error"; }
  });
  setInterval(()=>{Conf.secret=11+Math.random()*25|0;},15000);
  Conf.DATABASE=conn.driver.database;const router = new Router();//console.log(Routes)
  Routes.forEach(r => {
    router[r.m](...r.w?[r.r,...r.w]:[r.r],async(ctx:Koa.Context,next)=>{
      await r.a(ctx,next)
    })
  })
  app.use(router.routes()).use(router.allowedMethods()).listen(Conf.port,"0.0.0.0",()=>
    console.log(`ThinkTs run on http://localhost:${Conf.port} to see`))
  return Cache[User.name].save(new User("admin",encryptPwd("654321")))
    .then(user => {console.log("User has been saved: ", user);
  }).catch(e => {if(String(e).indexOf("ER_DUP_ENTRY")>0)console.error("賬戶已存在！")});
}).catch(e => {console.error(e)});
