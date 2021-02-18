import{createConnection,getRepository,Repository,ObjectLiteral}from"typeorm";import * as fs from"fs";import"../view";
import{encrypt}from"../utils/crypto";import{cleanAll}from"./decorator";import{promise}from"../utils/tool";
import{User}from'../entity/User';import Tag from"../utils/tag";import{Conf,Cache,vType}from'../config';

createConnection().then(async conn=>{Tag.Init(conn.name,9000);let S=Conf.CtrlSuf;//建议用最简短的方式命名
  if(S==="")void 0;else if(/^[A-Z_]\w*/.test(S))void 0;else throw new Error("Wrong CtrlSuffix!");
  process.env.NODE_ENV==='production'?S+=".js":S+=".ts";
  Promise.all((await promise(fs.readdir)(__dirname.slice(0,-6)+"/entity")).map(i => {let en=require("../entity/"+i),
    key=Object.keys(en)[0];Cache[key]=getRepository(en[key]);en=null;require("../controller/"+key+S)
    let res=(Cache[key] as Repository<ObjectLiteral>).metadata.ownColumns;key=key.toLocaleLowerCase();vType[key]={};
    res.forEach(r=>{let t=r.type;Object.defineProperty(vType[key],r.propertyName,{enumerable:true,writable:true,//@ts-ignore
    value:t==="datetime"?26:t.name==="Number"?9:t.name==="Boolean"?5:t==="tinyint"?2:t==="smallint"?4:
    t==="mediumint"?6:t==="bigint"?18:r.length===""?255:Number(r.length)});});
  }));
  Conf.DATABASE=conn.driver.database;Conf.TYPE=conn.driver.options.type;
  console.log('\x1B[35;47m%s\x1B[49m',"loading router……");cleanAll();
  const EXIST=await Cache["User"].findOne({account:"admin"});
  if(EXIST){console.error('\x1B[33;1m%s\x1B[22m',"董事长已存在!\x1B[37m");return;}else
  return Cache["User"].save(new User({account:"admin",pwd:encrypt("654321","shake256","latin1",50)}as User))
    .then(user=>{console.log("User has been saved:",user);})
});