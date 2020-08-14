import * as fs from "fs"
import * as path from "path"
import { Config } from '../config';
let Routes:Array<any>=[],$b=true,i=0,$once=true,$class

const Class = (v?:String) => _class => {
  let a=[];if(v==="")v=null;
  v=v||_class.name.replace(/(\w*)[A-Z]\w*/,"/$1");
  for (let r=i,l=Routes.length;r<l;r++){
    Routes[r].a=(new _class)[Routes[r].a].bind($class);Routes[r].r=v+Routes[r].r;a.push(Routes[r]);i++
  }
  if(Config.printRoute){
    if($once){$b=fs.existsSync("./routes/");$once=false}else $b=true
    !$b&&fs.mkdir("./routes/",function(err){
      if (err){return console.error(err);}
      fs.writeFile(path.resolve("./routes", `./${_class.name}.json`),
      JSON.stringify(a,['r','m'],"\t"),'utf8',e=>{if(e)console.error(e)})
    })
    $b&&v!=="/"&&fs.writeFile(path.resolve("./routes", `./${_class.name}.json`),
    JSON.stringify(a,['r','m'],"\t"),'utf8',e=>{if(e)console.error(e)})
  }a=null;$class=null
}
const Get = (r="") => (target, key) => {Routes.push({a:key,m:"get",r:r})}
const Post = (r="") => (target, key) => {Routes.push({a:key,m:"post",r:r})}
const Put = (r="") => (target, key) => {Routes.push({a:key,m:"put",r:r})}
const Del = (r="") => (target, key) => {Routes.push({a:key,m:"delete",r:r})}
const Roles = (...r:Array<Function>) => (target, key) => {
  let f=Routes[Routes.length-1];if(f.a!==key){
    console.log(target.constructor.name+":"+key+" use @Roles has to be on the top!")
  }else if(f.w){f.w=[...f.w,...r]}else{f.w=r}f=null
}
const Service=v=>(target,key)=>{target[key] = new (v);$class=target}
export {Routes,Class,Get,Post,Put,Del,Roles,Service};