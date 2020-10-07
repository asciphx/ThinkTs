import * as fs from "fs";import * as path from "path";import {Conf} from "../config";import { Context } from "koa";
let Routes:Array<any>=[],$b=true,i=0,$once=true,$=null
/**
 * @param v path路径,或者是t
 * @param t curd等方法的Array<string>
 */
const Class = (v:string | Array<string>="" ,t?:string[]) => _ => {let a=[]
  if(v==="")v=null;else if(typeof v!=="string"){t=v;v=null;}
  if(typeof v==="string"){if(v.charAt(0)!=="/")v="/"+v;}if(t!==undefined)
  t.forEach(v=>{
    switch (v) {
      case "add":Routes.push({a:"add",m:"post",r:""});break;
      case "del":Routes.push({a:"del",m:"delete",r:"/:id"});break;
      case "fix":Routes.push({a:"fix",m:"put",r:"/:id"});break;
      case "info":Routes.push({a:"info",m:"get",r:"/:id"});break;
      case "page":Routes.push({a:"page",m:"get",r:""});break;
      default:console.error("Wrong entry!");break;
    }
  });
  v=v??_.name.replace(/(\w*)[A-Z]\w*/,"/$1").toLowerCase();if(v==="/"){v="";}
  for (let r=i,l=Routes.length;r<l;r++){
    Routes[r].r=v+Routes[r].r;if(Conf.printRoute)a.push(Routes[r]);
    if(["add","del","fix","info","page"].indexOf(Routes[r].a)>-1)
      Routes[r].a=_.prototype[Routes[r].a].bind($[_.prototype["#"]])
    else Routes[r].a=_.prototype[Routes[r].a].bind($);i++
  }
  if(Conf.printRoute){
    if($once){$b=fs.existsSync("./routes/");$once=false}else $b=true
    !$b&&fs.mkdir("./routes/",function(err){
      if (err){return console.error(err);}
      fs.writeFile(path.resolve("./routes", `./${v===""?"$Controller":_.name}.json`),
      JSON.stringify(a,['r','m'],"  "),'utf8',e=>{if(e)console.error(e)});a=null
    });
    if($b){
      fs.writeFile(path.resolve("./routes", `./${v===""?"$Controller":_.name}.json`),
      JSON.stringify(a,['r','m'],"  "),'utf8',e=>{if(e)console.error(e)});a=null;
    }_=$=null
  }else a=_=$=null;
}
const Get = (r="") => (t, k, d) => {Routes.push({a:k,m:"get",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});parameter(d.value,d)}
const Post = (r="") => (t, k, d) => {Routes.push({a:k,m:"post",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});parameter(d.value,d)}
const Put = (r="") => (t, k, d) => {Routes.push({a:k,m:"put",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});parameter(d.value,d)}
const Del = (r="") => (t, k, d) => {Routes.push({a:k,m:"delete",r:r.charAt(0)==="/"?r:r===""?r:"/"+r});parameter(d.value,d)}
const P=(t, k, i: number)=>{t[k]["params"]=i}
const Q=(t, k, i: number)=>{t[k]["query"]=i}
const R=(t, k, i: number)=>{t[k]["request"]=i}
const S=(t, k, i: number)=>{t[k]["status"]=i}
const Middle = (...r:Array<Function>) => (t, k) => {
  let f=Routes[Routes.length-1];if(f.a!==k){
    console.log(t.constructor.name+":"+k+" use @Middle has to be on the top!")
  }else if(f.w){f.w=[...f.w,...r]}else{f.w=r}f=null
}
const Service=v=>(t,k)=>{
  if($===null)$={};Object.defineProperty($,k,{enumerable:true,value:new(v)})
  if(t.constructor.name.replace(/(\w*)[A-Z]\w*/,"$1Service")===v.name){t["#"]=k;}
}
const parameter=(oMethod,desc)=>{
  let o=Object.keys(oMethod);
  if(o[0]){o.reverse();
    switch (o.length) {
      case 1:
        desc.value=async function(ctx:Context,next:Function){
          return await oMethod.call(this, ctx[o[0]], next);
        };break
      case 2:
        desc.value=async function(ctx:Context,next:Function){
          return await oMethod.call(this, ctx[o[0]], ctx[o[1]], next);
        };break
      case 3:
        desc.value=async function(ctx:Context,next:Function){
          return await oMethod.call(this, ctx[o[0]], ctx[o[1]], ctx[o[2]], next);
        };break
      case 4:
        desc.value=async function(ctx:Context,next:Function){
          return await oMethod.call(this, ctx[o[0]], ctx[o[1]], ctx[o[2]], ctx[o[3]], next);
        };break
    }
  }else o=null;desc=null
}
export {Routes,Class,Get,Post,Put,Del,Middle,Service,P,Q,R,S};
