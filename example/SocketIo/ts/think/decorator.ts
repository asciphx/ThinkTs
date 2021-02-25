import * as fs from "fs";import * as path from "path";import {Conf} from "../config";
import * as _ from "koa-compose";import * as Router from "koa-router";
const ROUTER=new Router(),Server={};let Routes=[],$b=true,$once=true,$=null,$Override=[];
const B:Function=(t,k,i:number)=>{t[k][i]="$"}//ctx.request.body
const P:Function=(t,k,i:number)=>{t[k][i]="params"}//ctx.params
const Q:Function=(t,k,i:number)=>{t[k][i]="query"}//ctx.query
const R:Function=(t,k,i:number)=>{t[k][i]="response"}//ctx.response
const S:Function=(t,k,i:number)=>{t[k][i]="querystring"}//ctx.querystring
const T:Function=(t,k,i:number)=>{t[k][i]="request"}//ctx.request
const app = {
  get:(r="")=>(t,k,d)=>{Routes.push({a:k,m:"get",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)},
  post:(r="")=>(t,k,d)=>{Routes.push({a:k,m:"post",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)},
  put:(r="")=>(t,k,d)=>{Routes.push({a:k,m:"put",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)},
  del:(r="")=>(t,k,d)=>{Routes.push({a:k,m:"delete",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)}
}
export {ROUTER,B,P,Q,R,S,T,app,_,Class,Id,Get,Post,Put,Del,Middle,Inject,cleanAll};
/**  @param v path路径,或者是t  @param t curd等方法的Array<string>*/
let Class=(v:string|Array<"add"|"del"|"fix"|"info"|"page">="",t?:Array<"add"|"del"|"fix"|"info"|"page">)=>_=>{
  if(v==="")v=null;else if(typeof v!=="string"){t=v;v=null;}let $a:Array<{r:string,m,a,f:number}>=[];
  const V=_.name.replace(/([A-Z][a-z]+)[A-Z_]?\w*/,()=>(_.name==="View"?"":RegExp.$1));v=v??V.toLowerCase();
  if(typeof v==="string"){if(v.charAt(0)!=="/")v="/"+v;if(v==="/"){v="";}}
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
    Routes[r].r=v+Routes[r].r;if(Conf.printRoute)$a.push(Routes[r]);let A
    const M=Routes[r].m,W=Routes[r].w?[Routes[r].r,Routes[r].w]:[Routes[r].r]
    if($Override.indexOf(Routes[r].a)>-1)A=_.prototype[Routes[r].a].bind($);else 
    A=_.prototype[Routes[r].a].bind(v===""?$:$[_.prototype["#"]]);
    ROUTER[M](...W,async(ctx,next)=>{ctx.body=await A(ctx,next)});
  }
  if(Conf.printRoute){let VA:string="",ID:string,FIELD:string;
    if($once){$b=fs.existsSync("./routes/");$once=false}else $b=true
    !$b&&fs.mkdir("./routes/",function(err){
      if (err){return console.error(err);}
      fs.writeFile(path.resolve("./routes",`./${v===""?"$":v}.ts`),`//@ts-ignore
import axios from '../utils/axios';\nexport default {${$a.map((v,i)=>{if(VA===v.a)VA=VA+i;else VA=v.a;
  switch (VA) {
    case "add":ID="";FIELD="params";break;
    case "del":ID="id";FIELD="";break;
    case "fix":ID="id";FIELD="params";break;
    case "info":ID="id";FIELD="";break;
    case "page":ID="params:object";FIELD="";break;
    default:switch (v.m) {
      case "post":ID="";FIELD="params";break;
      case "put":ID="id";FIELD="params";break;
      case "delete":ID="id";FIELD="";break;
      default:ID=v.f===1?"params:object":v.f===2?"field:string":"";FIELD="";break;
    }break;
  }
  return `\n  ${VA+V}(${ID==="id"?_["_#"]==="string"?"id:string":"id:number":ID}${ID===""?FIELD===""?"":FIELD+
  ":object":FIELD===""?"":", "+FIELD+":object"}):Promise<any>{\n    return axios.${v.m}('${v.r.replace(/\/:.+/,"/'+")}${ID==="params:object"?
    "',{ params }":ID==="field:string"?"?'+field":ID===""?"'":ID}${FIELD===""?"":", "+FIELD});
  }`})}\n}`,'utf8',e=>{if(e)console.error(e)});$a=null
    });
    if($b){
      fs.writeFile(path.resolve("./routes",`./${v===""?"$":v}.ts`),`//@ts-ignore
import axios from '../utils/axios';\nexport default {${$a.map((v,i)=>{if(VA===v.a)VA=VA+i;else VA=v.a;
  switch (VA) {
    case "add":ID="";FIELD="params";break;
    case "del":ID="id";FIELD="";break;
    case "fix":ID="id";FIELD="params";break;
    case "info":ID="id";FIELD="";break;
    case "page":ID="params:object";FIELD="";break;
    default:switch (v.m) {
      case "post":ID="";FIELD="params";break;
      case "put":ID="id";FIELD="params";break;
      case "delete":ID="id";FIELD="";break;
      default:ID=v.f===1?"params:object":v.f===2?"field:string":"";FIELD="";break;
    }break;
  }
  return `\n  ${VA+V}(${ID==="id"?_["_#"]==="string"?"id:string":"id:number":ID}${ID===""?FIELD===""?"":FIELD+
  ":object":FIELD===""?"":", "+FIELD+":object"}):Promise<any>{\n    return axios.${v.m}('${v.r.replace(/\/:.+/,"/'+")}${ID==="params:object"?
    "',{ params }":ID==="field:string"?"?'+field":ID===""?"'":ID}${FIELD===""?"":", "+FIELD});
  }`})}\n}`,'utf8',e=>{if(e)console.error(e)});$a=null
    }_=$=null;
  }else $a=_=$=null;$Override.length=Routes.length=0;
}/**@param v 正则匹配主键  @param t 匹配后的主键类型是：字符串、还是数字（默认字符串）*/
let Id=(v,t:"string"|"number"="string")=>_=>{if($===null)throw new Error("@Class needs to be implemented later.");_["##"]=v;_["_#"]=t;}
let Get=(r="")=>(t,k,d)=>{Routes.push({a:k,m:"get",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)}
let Post=(r="")=>(t,k,d)=>{Routes.push({a:k,m:"post",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)}
let Put=(r="")=>(t,k,d)=>{Routes.push({a:k,m:"put",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)}
let Del=(r="")=>(t,k,d)=>{Routes.push({a:k,m:"delete",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)}
let Middle=(...r:Array<_.Middleware<any>>)=>(t,k)=>{
  let f=Routes[Routes.length-1];if(f.a!==k){ throw new Error(t.constructor.name+":"+k+" use @Middle has to be on the top!");
  }else if(f.w){throw new Error("@Middle can only be used once!")}else{f.w=r.length===1?r[0]:_(r)}f=null
}
let Inject=v=>(t,k)=>{
  if(t.constructor.name.replace(/([A-Z][a-z]+)[A-Z_]\w*/,"$1")===v.name.replace(/(\w*)[A-Z$]\w*/,"$1")){t["#"]=k;}
  if(Server[v.name]===undefined){Server[v.name]=new(v)}if($===null)$={};Object.defineProperty($,k,{enumerable:true,value:Server[v.name]})
}
let param=(m:Function,d)=>{
  let o=Object.keys(m),num=-1;for (let p in m){
    switch (m[p]) {
      case "$":num=Number(p);break;
      case "query":Routes[Routes.length-1].f=1;break;
      case "querystring":Routes[Routes.length-1].f=2;break;
      default:break;
    }
  };
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