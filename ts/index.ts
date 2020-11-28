import "reflect-metadata";import { createConnection, getRepository, Repository } from "typeorm";
import * as Koa from "koa";import * as bodyParser from "koa-bodyparser";import * as fs from "fs";
import * as koaStatic from "koa-static";import { ROUTER, cleanRoutes } from "./think/decorator";
import * as path from "path";import { Conf, Cache, Maps, Redis } from './config';import "./view";
import * as Jwt from "jsonwebtoken";import * as views from "koa-views";
import { User } from './entity/User';import { Menu } from "./entity/Menu";
import { encrypt, NTo10 } from "./utils/crypto";import { Tag } from "./utils/tag";

createConnection().then(async conn => {Tag.Init(conn.name,9000);let fristTime={};
  fs.readdir(__dirname + "/entity", async (e, f) => {
    for (let i of f){let en=require(__dirname+"/entity/"+i),key=Object.keys(en)[0];Cache[key]=getRepository(en[key]);en=null;}
    const EXIST = await Cache[User.name].findOne({account:"admin"});
    if (EXIST) {console.error('\x1B[34;1m%s\x1B[22m', "董事长已存在!");return;} else
    return Cache[User.name].save(new User({account:"admin",pwd:encrypt("654321","shake256","latin1",50)} as User))
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
        let {payload}=Jwt.verify(TOKEN.replace(/^Bearer /,""),
          NTo10(S[0],Number("0x"+S[1])/0x4F).toString(Conf.cipher),{complete:true}) as any;
        let ll:Array<any>=Object.entries(payload)[0],l:Array<string>=ll[1];
        const PATH=ctx.method+ctx.url.replace(/\d+|(\w+)\?.+$/,"$1")
        for (let i = 0; i < l.length; i++) {const ROLE:string=l[i];
          if(Maps.hasOwnProperty(ROLE)){
            if(Date.now()-(fristTime[ROLE]||0)>Conf.synchronize){fristTime[ROLE]=Date.now()}else{
              if(Maps[ROLE].includes(PATH)){await next();return}continue
            };const URL=await Redis.get(ROLE)
            if(URL.match(PATH)){Maps[ROLE]=URL.split(",");await next();return}else{
              const IDEX=Maps[ROLE].findIndex(v=>v===PATH);IDEX>-1&&Maps[ROLE].splice(IDEX,1);continue;
            }
          }
          let m=await (Cache[Menu.name]as Repository<Menu>).createQueryBuilder("m").leftJoin("m.roles","role")
          .select("m.path").where(`role.name ='${ROLE}'`).getMany();
          if(m.length>0){m.forEach((e,i,l)=>{(l[i] as any)=e.path});Maps[ROLE]=m;Redis.set(ROLE,m.toString());}
          if((m as any).includes(PATH)){await next();m=null;return}m=null;
        }
        if(ll[0]==="admin"){await next();return}l=ll=payload=null;
        ctx.status=403;ctx.body=`'${PATH}' request is not authorized`;
      } catch (e) {
        if(String(e).includes('TokenExpiredError')){ ctx.status=401;ctx.body="Jwt Expired";
        }else if(String(e).includes('QueryFailedError')){ctx.status=406;ctx.body=e;
        }else{console.error(e);ctx.status=401;ctx.body="Authentication Error";}
      }
    }else{ctx.status=401;ctx.body="Headers Error";}
  });
  setInterval(()=>{Conf.secret=11+Math.random()*25|0;},1414);
  APP.use(ROUTER.routes()).use(ROUTER.allowedMethods()).listen(Conf.port,"0.0.0.0",()=>{
    console.log('\x1B[35;47m%s\x1B[49m', "loading router……")})
  fs.readdir(__dirname+"/controller",(e, f)=>{for(let i of f)require(__dirname+"/controller/"+i);
    console.log('\x1B[36;1m%s\x1B[22m',`ThinkTs run on http://localhost:${Conf.port}/test.html`);cleanRoutes()});
})