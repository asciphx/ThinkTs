import * as fs from "fs";import * as path from "path";import {Config} from '../config';import * as util from "util"
let Routes:Array<any>=[],$b=true,i=0,$once=true,$=null
const Class = (v:string | Array<string>="" ,t?:string[]) => _ => {let a=[];
  if(v==="")v=null;else if(typeof v!=="string"){t=v;v=null;} 
  if(typeof v==="string"){if(v.charAt(0)!=="/")v="/"+v;}
  if(t!==undefined)t=["add","delete","modify","search"].filter(k=>!t.includes(k));
  v=v??_.name.replace(/(\w*)[A-Z]\w*/,"/$1");if(v==="/"){v="";}//console.log(util.inspect(_,true,1,true))
  for (let r=i,l=Routes.length;r<l;r++){
    if(t?.length!==0&&t?.indexOf(Routes[r].a)>-1){t.splice(t.indexOf(Routes[r].a),1);Routes.splice(r--, 1);i--;continue}
    if(Routes[r]===undefined)break;Routes[r].r=v+Routes[r].r;if(Config.printRoute)a.push(Routes[r]);
    if(["add","delete","modify","search"].indexOf(Routes[r].a)>-1)
      Routes[r].a=_.prototype[Routes[r].a].bind($[Object.keys($)[0]])
    else Routes[r].a=_.prototype[Routes[r].a].bind($);i++
  }
  if(Config.printRoute){
    if($once){$b=fs.existsSync("./routes/");$once=false}else $b=true
    !$b&&fs.mkdir("./routes/",function(err){
      if (err){return console.error(err);}
      fs.writeFile(path.resolve("./routes", `./${v===""?"$Controller":_.name}.json`),
      JSON.stringify(a,['r','m'],"\t"),'utf8',e=>{if(e)console.error(e)});a=null
    });
    if($b){
      fs.writeFile(path.resolve("./routes", `./${v===""?"$Controller":_.name}.json`),
      JSON.stringify(a,['r','m'],"\t"),'utf8',e=>{if(e)console.error(e)});a=null;
    }_=$=null
  }else a=_=$=null;
}
const Get = (r="") => (t, k) => {Routes.push({a:k,m:"get",r:r.charAt(0)==="/"?r:r===""?r:"/"+r})}
const Post = (r="") => (t, k) => {Routes.push({a:k,m:"post",r:r.charAt(0)==="/"?r:r===""?r:"/"+r})}
const Put = (r="") => (t, k) => {Routes.push({a:k,m:"put",r:r.charAt(0)==="/"?r:r===""?r:"/"+r})}
const Del = (r="") => (t, k) => {Routes.push({a:k,m:"delete",r:r.charAt(0)==="/"?r:r===""?r:"/"+r})}
const Roles = (...r:Array<Function>) => (t, k) => {
  let f=Routes[Routes.length-1];if(f.a!==k){
    console.log(t.constructor.name+":"+k+" use @Roles has to be on the top!")
  }else if(f.w){f.w=[...f.w,...r]}else{f.w=r}f=null
}
const Service=v=>(t,k)=>{if($===null)$={};Object.defineProperty($,k,{enumerable:true,configurable:false,writable:false,value:new(v)})}

export {Routes,Class,Get,Post,Put,Del,Roles,Service};