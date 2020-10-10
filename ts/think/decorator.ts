import * as fs from "fs";import * as path from "path";import {Conf} from "../config";
let Routes:Array<any>=[],$b=true,i=0,$once=true,$=null
/**
 * @param v path路径,或者是t
 * @param t curd等方法的Array<string>
 */
const Class=(v:string | Array<string>="" ,t?:string[])=>_=>{let a=[]
  if(v==="")v=null;else if(typeof v!=="string"){t=v;v=null;}
  if(typeof v==="string"){if(v.charAt(0)!=="/")v="/"+v;}if(t!==undefined)
  t.forEach(v=>{
    switch (v) {
      case "add":Routes.push({a:"_add",m:"post",r:""});break;
      case "del":Routes.push({a:"_del",m:"delete",r:"/:id"});break;
      case "fix":Routes.push({a:"_fix",m:"put",r:"/:id"});break;
      case "info":Routes.push({a:"_info",m:"get",r:"/:id"});break;
      case "page":Routes.push({a:"_page",m:"get",r:""});break;
      default:console.error("Wrong entry!");break;
    }
  });
  v=v??_.name.replace(/(\w*)[A-Z]\w*/,"/$1").toLowerCase();if(v==="/"){v="";}
  for (let r=i,l=Routes.length;r<l;r++){
    Routes[r].r=v+Routes[r].r;if(Conf.printRoute)a.push(Routes[r]);
    if(["_add","_del","_fix","_info","_page"].indexOf(Routes[r].a)>-1)
      Routes[r].a=_.prototype[Routes[r].a].bind($[_.prototype["#"]])
    else Routes[r].a=_.prototype[Routes[r].a].bind($);i++
  }
  if(Conf.printRoute){
    if($once){$b=fs.existsSync("./routes/");$once=false}else $b=true
    !$b&&fs.mkdir("./routes/",function(err){
      if (err){return console.error(err);}
      fs.writeFile(path.resolve("./routes",`./${v===""?"$Controller":_.name}.json`),
      JSON.stringify(a,['r','m'],"  "),'utf8',e=>{if(e)console.error(e)});a=null
    });
    if($b){
      fs.writeFile(path.resolve("./routes",`./${v===""?"$Controller":_.name}.json`),
      JSON.stringify(a,['r','m'],"  "),'utf8',e=>{if(e)console.error(e)});a=null;
    }_=$=null
  }else a=_=$=null;
}
const Get=(r="")=>(t,k,d)=>{Routes.push({a:k,m:"get",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)}
const Post=(r="")=>(t,k,d)=>{Routes.push({a:k,m:"post",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)}
const Put=(r="")=>(t,k,d)=>{Routes.push({a:k,m:"put",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)}
const Del=(r="")=>(t,k,d)=>{Routes.push({a:k,m:"delete",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});param(d.value,d)}
const Middle=(...r:Array<Function>)=>(t,k)=>{
  let f=Routes[Routes.length-1];if(f.a!==k){
    console.log(t.constructor.name+":"+k+" use @Middle has to be on the top!")
  }else if(f.w){f.w=[...f.w,...r]}else{f.w=r}f=null
}
const Inject=v=>(t,k)=>{
  if($===null)$={};Object.defineProperty($,k,{enumerable:true,value:new(v)})
  if(t.constructor.name.replace(/(\w*)[A-Z]\w*/,"$1Service")===v.name){t["#"]=k;}
}
const B:Function=(t,k,i:number)=>{t[k].$=i}//ctx.request.body
const P:Function=(t,k,i:number)=>{t[k].params=i}//ctx.params
const Q:Function=(t,k,i:number)=>{t[k].query=i}//ctx.query
const R:Function=(t,k,i:number)=>{t[k].request=i}//ctx.request
const param=(m:Function,d)=>{
  let o=Object.keys(m),num=o.findIndex(v=>v==="$");
  if(o.length){
    switch (o.length) {
      case 1:d.value=num===-1?async function(ctx,next:Function){
          return await m.call(this,ctx[o[0]],next);
        }:async function(ctx,next:Function){
          return await m.call(this,ctx.request.body,next);
        };break
      case 2:d.value=num===-1?async function(ctx,next:Function){
          return await m.call(this,ctx[o[1]],ctx[o[0]],next);
        }:num===0?async function(ctx,next:Function){
          return await m.call(this,ctx[o[1]],ctx.request.body,next);
        }:async function(ctx,next:Function){
          return await m.call(this,ctx.request.body,ctx[o[0]],next);
        };break
      case 3:d.value=num===-1?async function(ctx,next:Function){
          return await m.call(this,ctx[o[2]],ctx[o[1]],ctx[o[0]],next);
        }:num===0?async function(ctx,next:Function){
          return await m.call(this,ctx[o[2]],ctx[o[1]],ctx.request.body,next);
        }:num===1?async function(ctx,next:Function){
          return await m.call(this,ctx[o[2]],ctx.request.body,ctx[o[0]],next);
        }:async function(ctx,next:Function){
          return await m.call(this,ctx.request.body,ctx[o[1]],ctx[o[0]],next);
        };break
      case 4:d.value=num===-1?async function(ctx,next:Function){
        return await m.call(this,ctx[o[3]],ctx[o[2]],ctx[o[1]],ctx[o[0]],next);
        }:num===0?async function(ctx,next:Function){
          return await m.call(this,ctx[o[3]],ctx[o[2]],ctx[o[1]],ctx.request.body,next);
        }:num===1?async function(ctx,next:Function){
          return await m.call(this,ctx[o[3]],ctx[o[2]],ctx.request.body,ctx[o[0]],next);
        }:num===2?async function(ctx,next:Function){
          return await m.call(this,ctx[o[3]],ctx.request.body,ctx[o[1]],ctx[o[0]],next);
        }:async function(ctx,next:Function){
          return await m.call(this,ctx.request.body,ctx[o[2]],ctx[o[1]],ctx[o[0]],next);
        };break
      default:console.error("Wrong parameter!");break;
    }
  }else o=null;d=null
}
export {Routes,Class,Get,Post,Put,Del,Middle,Inject,B,P,Q,R};