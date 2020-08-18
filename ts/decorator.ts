import * as fs from "fs";import * as path from "path";
import { Config } from '../config';
let Routes:Array<any>=[],$b=true,i=0,$once=true,$

const Class = (v:String="") => _ => {let a=[];if(v==="")v=null;
  v=v??_.name.replace(/(\w*)[A-Z]\w*/,"/$1");if(v==="/")v=""
  for (let r=i,l=Routes.length;r<l;r++){
    Routes[r].a=_.prototype[Routes[r].a].bind($);Routes[r].r=v+Routes[r].r;a.push(Routes[r]);i++
  }
  if(Config.printRoute){
    if($once){$b=fs.existsSync("./routes/");$once=false}else $b=true
    !$b&&fs.mkdir("./routes/",function(err){
      if (err){return console.error(err);}
      fs.writeFile(path.resolve("./routes", `./${_.name}.json`),
      JSON.stringify(a,['r','m'],"\t"),'utf8',e=>{if(e)console.error(e)})
    });
    $b&&fs.writeFile(path.resolve("./routes", `./${v===""?"$Controller":_.name}.json`),
    JSON.stringify(a,['r','m'],"\t"),'utf8',e=>{if(e)console.error(e)})
  }a=_=$=null;
}
const Get = (r="") => (target, key) => {Routes.push({a:key,m:"get",r:r.charAt(0)==="/"?r:r===""?r:"/"+r})}
const Post = (r="") => (target, key) => {Routes.push({a:key,m:"post",r:r.charAt(0)==="/"?r:r===""?r:"/"+r})}
const Put = (r="") => (target, key) => {Routes.push({a:key,m:"put",r:r.charAt(0)==="/"?r:r===""?r:"/"+r})}
const Del = (r="") => (target, key) => {Routes.push({a:key,m:"delete",r:r.charAt(0)==="/"?r:r===""?r:"/"+r})}
const Roles = (...r:Array<Function>) => (target, key) => {
  let f=Routes[Routes.length-1];if(f.a!==key){
    console.log(target.constructor.name+":"+key+" use @Roles has to be on the top!")
  }else if(f.w){f.w=[...f.w,...r]}else{f.w=r}f=null
}
const Service=v=>(target,key)=>{Object.defineProperty($={},key,{enumerable:false,configurable:false,writable:false,value:new(v)})}
export {Routes,Class,Get,Post,Put,Del,Roles,Service};