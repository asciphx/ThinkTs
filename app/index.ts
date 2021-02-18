import"reflect-metadata";import * as Koa from"koa";import * as path from"path";
import * as koaStatic from"koa-static";import{ROUTER,_}from"./think/decorator";
import * as Jwt from"jsonwebtoken";import * as bodyParser from"koa-bodyparser";
import * as views from"koa-views";import{NTo10}from"./utils/crypto";import"./think/base";
import{Repository}from "typeorm";import{Conf,Cache,Maps,Redis}from'./config';let fristTime={};

const {unless}=Conf,{noJwt}=Conf,CORS='null http://127.0.0.1:3000 http://localhost:8080';
new Koa().use(_([bodyParser({jsonLimit:Conf.jsonLimit,formLimit:"3mb",textLimit:"2mb"}),
  views(path.join(__dirname,Conf.view),{autoRender:false,extension:'html',map:{html:"ejs"}})as Koa.Middleware
  ,koaStatic(path.join(__dirname,Conf.view),{defer:true}),koaStatic(path.join(__dirname,"../"+Conf.upload)),
  async(ctx,next)=>{const {originalUrl}=ctx,{origin}=ctx.request.header;ctx.vary('Origin');
    origin!==undefined&&ctx.set('Access-Control-Allow-Origin',CORS.includes(origin)?origin:"");
    ctx.set('Access-Control-Allow-Headers','content-type,cache-control,x-requested-with,t,s');
    ctx.set('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
    ctx.set('Access-Control-Allow-Credentials',"true");
    if(ctx.method==='OPTIONS'){ctx.body=200;}
    if(noJwt||originalUrl.substr(1,6)==="static"||!!unless.exec(originalUrl)){await next();return}
    const {s}=ctx.headers,TOKEN:string=ctx.headers.t;let S:string[]=s===undefined?void 0:s.match(/[^#]+/g);
    if(TOKEN===undefined||s===void 0){
      ctx.status=401;ctx.body="Headers Error";
    }else{
      try{
        let{payload}=Jwt.verify(TOKEN.replace(/^Bearer /,""),
          String(NTo10(S[0],Number("0x"+S[1])/Conf.cipher)),{complete:true}) as any;S=null;
        let ll:Array<any>=Object.entries(payload)[0],l:Array<string>=ll[1];
        const PATH=ctx.method+ctx.url.replace(/[0-9A-Z_]+|(\w+)\?.+$/,"$1")
        for(let i=0; i<l.length; ++i){const ROLE:string=l[i];
          if(Maps.hasOwnProperty(ROLE)){
            if(Date.now()-(fristTime[ROLE]||0)>Conf.synchronize){fristTime[ROLE]=Date.now()}else{
              if(Maps[ROLE].includes(PATH)){await next();return}continue
          };const URL=await Redis.get(ROLE)
            if(URL.match(PATH)){Maps[ROLE]=URL.split(",");await next();return}else{
              const IDEX=Maps[ROLE].findIndex(v=>v===PATH);IDEX>-1&&Maps[ROLE].splice(IDEX,1);continue;
          }
        }
        let m=await(Cache["Menu"]as Repository<any>).createQueryBuilder("m").leftJoin("m.roles","role")
        .select("m.path").where(`role.name='${ROLE}'`).getMany();
        if(m.length>0){m.forEach((e,i,l)=>{(l[i] as any)=e.path});Maps[ROLE]=m;Redis.set(ROLE,m.toString());}
        if((m as any).includes(PATH)){await next();m=null;return}m=null;
      }
      if(ll[0]==="admin"){await next();return}l=ll=payload=null;
      ctx.status=403;ctx.body=`'${PATH}'request is not authorized`;
    }catch(e){const ERR=String(e);
        if(ERR.includes('TokenExpiredError')){ctx.status=401;ctx.body="Jwt Expired";
      }else if(ERR.includes('QueryFailedError')){ctx.status=406;ctx.body=e;
      }else{console.error(e);if(ERR==="Error: Connection is closed."){ctx.status=401;
        ctx.body="Redis is reconnecting,please try again in a few seconds";Redis.connect();}
        else{ctx.status=401;ctx.body="Authentication Error";}}
    }
  }
},ROUTER.routes(),ROUTER.allowedMethods()])).listen(Conf.port,"0.0.0.0",()=>{
  console.log('\x1B[36;1m%s\x1B[22m',`ThinkTs run on http://localhost:${Conf.port}/test.html`)});
setInterval(()=>{Conf.secret=11+Math.random()*25|0;},1414);