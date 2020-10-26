import "reflect-metadata";import { createConnection, getRepository, Repository } from "typeorm";
import * as Koa from "koa";import * as bodyParser from "koa-bodyparser";import * as fs from "fs";
import * as Router from "koa-router";import * as koaStatic from "koa-static";
import * as views from "koa-views";import * as Jwt from "jsonwebtoken";import * as path from "path"
import { Conf, Cache, Maps, Redis } from './config';import { Routes } from "./think/decorator";
import { User } from './entity/User';import "./view";import { Menu } from "./entity/Menu";
import { Tag } from "./utils/tag"; import { encrypt, NTo10 } from "./utils/crypto"

createConnection().then(async conn => {Tag.Init(conn.name);//Require to use decorator preprocessing
  await fs.readdirSync(__dirname+"/entity").forEach(i=>{
    let en=require(__dirname+"/entity/"+i),key=Object.keys(en)[0];Cache[key]=getRepository(en[key]);en=null
  });let fristTime={};
  await fs.readdirSync(__dirname+"/controller").forEach((i)=>{require(__dirname+"/controller/"+i)})
  const app = new Koa().use(bodyParser({ jsonLimit: Conf.jsonLimit, formLimit: "3mb", textLimit: "2mb" }))
  .use(views(path.join(__dirname,Conf.view),{autoRender:false,extension: 'html',map: { html: "ejs" }}))
  .use(koaStatic(path.join(__dirname,Conf.view),{defer:true}))
  .use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin',ctx.headers.origin);
    ctx.set('Access-Control-Allow-Headers','content-type');
    ctx.set('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
    ctx.set('Access-Control-Allow-Credentials',"true");
    if (ctx.method === 'OPTIONS') { ctx.body=200; }
    if(ctx.url.match(Conf.unless)||Conf.noJwt){await next();return}
    const token:string=ctx.headers.a,s:string=ctx.headers.s?ctx.headers.s.match(/[^#]+/g):null;
    if(token&&s){
      try {
        let {payload}=Jwt.verify(token.replace(/^Bearer /,""),
          NTo10(s[0],Number("0x"+s[1])/0x4F).toString(Conf.cipher),{complete:true}) as any;
        let ll:Array<any>=Object.entries(payload)[0], l=ll[1] as Array<string>;//role list
        const path=ctx.url.replace(/\d+|(\w+)\?.+$/,"$1")
        for (let i = 0; i < l.length; i++) {
          if(Maps.hasOwnProperty(l[i])){
            if(Maps[l[i]].includes(ctx.method+path)){await next();return}//每15秒最小间隔若没匹配权限，才会去redis上取出放到Map
            if(Date.now()-(fristTime[l[i]]||0)>15000){fristTime[l[i]]=Date.now()}else continue;const url=await Redis.get(l[i])
            if(url.match(ctx.method+path)){Maps[l[i]]=url.split(",");await next();return}continue;
          }
          let m=await (Cache[Menu.name]as Repository<Menu>).createQueryBuilder("m").leftJoin("m.roles","role")
          .select("m.path").where(`role.name ="${l[i]}"`).getMany();
          if(m.length>0){m.forEach((e,i,l)=>{(l[i] as any)=e.path});Maps[l[i]]=m;Redis.set(l[i],m.toString());}
          if((m as any).includes(ctx.method+path)){await next();m=null;return}m=null;
        }
        if(ll[0]==="admin"){await next();return}
        ctx.status=403;ctx.body=`'${ctx.method+path}' request is not authorized`;l=ll=payload=null
      } catch (e) {
        if(String(e).includes('TokenExpiredError')){ ctx.status=401;ctx.body="Jwt Expired";
        }else if(String(e).includes('QueryFailedError')){ctx.status=406;ctx.body=e;
        }else{console.error(e);ctx.status=401;ctx.body="Authentication Error";}
      }
    }else{ctx.status=401;ctx.body="Headers Error";}
  });
  setInterval(()=>{Conf.secret=11+Math.random()*25|0;},1414);//每1.414秒换一次私钥
  Conf.DATABASE = conn.driver.database;const router = new Router();//console.log(Routes)
  Routes.forEach(r => {
    router[r.m](...r.w?[r.r,r.w]:[r.r],async(ctx:Koa.Context,next)=>{
      ctx.body=await r.a(ctx,next);
    })
  })
  app.use(router.routes()).use(router.allowedMethods()).listen(Conf.port,"0.0.0.0",()=>
    console.log(`ThinkTs run on http://localhost:${Conf.port}/test.html`))
  const exist = await Cache[User.name].findOne({account:"admin"});
  if (exist) {console.error("董事长已存在!");return;} else
  return Cache[User.name].save(
    new User({account:"admin",pwd:encrypt("654321","shake256","base64",28)} as User))
    .then(user => {console.log("User has been saved: ", user);
  })
})//.catch(e => {console.error(e)});
