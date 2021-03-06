import{createConnection}from"typeorm";import * as fs from"fs";import"../view";
import{cleanAll}from"./decorator";import{promise}from"../utils/tool";
import Tag from"../utils/tag";import{Conf}from'../config';

createConnection().then(async conn=>{Tag.Init(conn.name,9000);
  Promise.all((await promise(fs.readdir)(__dirname.slice(0,-6)+"/controller")).map(i => {require("../controller/"+i)}));
  Conf.DATABASE=conn.driver.database;Conf.TYPE=conn.driver.options.type;
  console.log('\x1B[35;47m%s\x1B[49m',"loading router……");cleanAll();
});