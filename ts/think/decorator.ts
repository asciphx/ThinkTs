import * as fs from "fs";import * as path from "path";import {Conf} from "../config";
import * as _ from "koa-compose";import * as Router from "koa-router";
const ROUTER=new Router();let Routes:Array<any>=[],$b=true,$once=true,$=null,$Override=[];
const B:Function=(t,k,i:number)=>{t[k][i]="$"}//ctx.request.body
const P:Function=(t,k,i:number)=>{t[k][i]="params"}//ctx.params
const Q:Function=(t,k,i:number)=>{t[k][i]="query"}//ctx.query
const R:Function=(t,k,i:number)=>{t[k][i]="response"}//ctx.response
const S:Function=(t,k,i:number)=>{t[k][i]="querystring"}//ctx.querystring
const app = {
  get:(r="")=>(t,k,d)=>{Routes.push({a:k,m:"get",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)},
  post:(r="")=>(t,k,d)=>{Routes.push({a:k,m:"post",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)},
  put:(r="")=>(t,k,d)=>{Routes.push({a:k,m:"put",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)},
  del:(r="")=>(t,k,d)=>{Routes.push({a:k,m:"delete",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)}
}
export {ROUTER,B,P,Q,R,S,app,Class,Id,Get,Post,Put,Del,Middle,Inject,cleanAll};
/**  @param v path路径,或者是t  @param t curd等方法的Array<string>*/
let Class=(v:string|Array<"add"|"del"|"fix"|"info"|"page">="",t?:Array<"add"|"del"|"fix"|"info"|"page">)=>_=>{
  if(v==="")v=null;else if(typeof v!=="string"){t=v;v=null;}let a=[]
  if(typeof v==="string"){if(v.charAt(0)!=="/")v="/"+v;}
  v=v??_.name.replace(/(\w*)[A-Z]\w*/,"/$1").toLowerCase();if(v==="/"){v="";}
  v!==""&&Object.getOwnPropertyNames(_.prototype).forEach(k=>{
    if(typeof _.prototype[k]==="function")$Override.push(k);
  });
  if(t!==undefined)t.filter(p=>!$Override.includes(p)).forEach(p=>{
    switch (p) {
      case "add":Routes.push({a:p,m:"post",r:""});break;
      case "del":Routes.push({a:p,m:"delete",r:"/:id"+(_["##"]||"(\\d+)")});break;
      case "fix":Routes.push({a:p,m:"put",r:"/:id"+(_["##"]||"(\\d+)")});break;
      case "info":Routes.push({a:p,m:"get",r:"/:id"+(_["##"]||"(\\d+)")});break;
      case "page":Routes.push({a:p,m:"get",r:""});break;
      default:throw new Error("Wrong entry!");
    }
  });
  for (let r=0,l=Routes.length;r<l;++r){
    Routes[r].r=v+Routes[r].r;if(Conf.printRoute)a.push(Routes[r]);let A
    const M=Routes[r].m,W=Routes[r].w?[Routes[r].r,Routes[r].w]:[Routes[r].r]
    if($Override.indexOf(Routes[r].a)>-1)A=_.prototype[Routes[r].a].bind($);else 
    A=_.prototype[Routes[r].a].bind(v===""?$:$[_.prototype["#"]]);
    ROUTER[M](...W,async(ctx,next)=>{ctx.body=await A(ctx,next)});
  }
  if(Conf.printRoute){
    if($once){$b=fs.existsSync("./routes/");$once=false}else $b=true
    !$b&&fs.mkdir("./routes/",function(err){
      if (err){return console.error(err);}
      fs.writeFile(path.resolve("./routes",`./${v}.json`),
      JSON.stringify(a,['r','m','a'],"  "),'utf8',e=>{if(e)console.error(e)});a=null
    });
    if($b){
      fs.writeFile(path.resolve("./routes",`./${v}.json`),
      JSON.stringify(a,['r','m','a'],"  "),'utf8',e=>{if(e)console.error(e)});a=null;
    }_=$=null;
  }else a=_=$=null;$Override.length=Routes.length=0;
}
let Id=v=>_=>{if($===null)throw new Error("@Class needs to be implemented later.");_["##"]=v}
let Get=(r="")=>(t,k,d)=>{Routes.push({a:k,m:"get",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)}
let Post=(r="")=>(t,k,d)=>{Routes.push({a:k,m:"post",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)}
let Put=(r="")=>(t,k,d)=>{Routes.push({a:k,m:"put",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)}
let Del=(r="")=>(t,k,d)=>{Routes.push({a:k,m:"delete",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)}
let Middle=(...r:Array<_.Middleware<any>>)=>(t,k)=>{
  let f=Routes[Routes.length-1];if(f.a!==k){
    throw new Error(t.constructor.name+":"+k+" use @Middle has to be on the top!");
  }else if(f.w){f.w=_([...f.w,...r])}else{f.w=r.length===1?r[0]:_(r)}f=null
}
let Inject=v=>(t,k)=>{
  if($===null)$={};Object.defineProperty($,k,{enumerable:true,value:new(v)})
  if(t.constructor.name.replace(/(\w*)[A-Z]\w*/,"$1Service")===v.name){t["#"]=k;}
}
let param=(m:Function,d)=>{
  let o=Object.keys(m),num=-1;for (let p in m)m[p]==="$"&&(num=Number(p));
  if(o.length){
    switch (o.length) {
      case 1:d.value=num===-1?async function(ctx,next:Function){
          return await m.call(this,ctx[m[0]],next);
        }:async function(ctx,next:Function){
          return await m.call(this,ctx.request.body,next);
        };break
      case 2:d.value=num===-1?async function(ctx,next:Function){
          return await m.call(this,ctx[m[0]],ctx[m[1]],next);
        }:num===0?async function(ctx,next:Function){
          return await m.call(this,ctx.request.body,ctx[m[1]],next);
        }:async function(ctx,next:Function){
          return await m.call(this,ctx[m[0]],ctx.request.body,next);
        };break
      case 3:d.value=num===-1?async function(ctx,next:Function){
          return await m.call(this,ctx[m[0]],ctx[m[1]],ctx[m[2]],next);
        }:num===0?async function(ctx,next:Function){
          return await m.call(this,ctx.request.body,ctx[m[1]],ctx[m[2]],next);
        }:num===1?async function(ctx,next:Function){
          return await m.call(this,ctx[m[0]],ctx.request.body,ctx[m[2]],next);
        }:async function(ctx,next:Function){
          return await m.call(this,ctx[m[0]],ctx[m[1]],ctx.request.body,next);
        };break
      case 4:d.value=num===-1?async function(ctx,next:Function){
        return await m.call(this,ctx[m[0]],ctx[m[1]],ctx[m[2]],ctx[m[3]],next);
        }:num===0?async function(ctx,next:Function){
          return await m.call(this,ctx.request.body,ctx[m[1]],ctx[m[2]],ctx[m[3]],next);
        }:num===1?async function(ctx,next:Function){
          return await m.call(this,ctx[m[0]],ctx.request.body,ctx[m[2]],ctx[m[3]],next);
        }:num===2?async function(ctx,next:Function){
          return await m.call(this,ctx[m[0]],ctx[m[1]],ctx.request.body,ctx[m[3]],next);
        }:async function(ctx,next:Function){
          return await m.call(this,ctx[m[0]],ctx[m[1]],ctx[m[2]],ctx.request.body,next);
        };break
      default:throw new Error("Wrong parameter!");
    }
  }o=d=null;
}
let cleanAll=()=>{Routes=$Override=cleanAll=Class=Id=param=Get=Post=Put=Del=Middle=Inject=null;}