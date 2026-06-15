import { createConnection } from "typeorm"; import * as fs from "fs"; import * as path from "path"; import "../view";
import { cleanAll } from "./decorator"; import { promise } from "../utils/tool";
import Tag from "../utils/tag"; import { Conf } from '../config';

createConnection().then(async conn => {
  Tag.Init(conn.name, 9000);
  const controllerDir = path.join(__dirname, '..', 'controller');
  Promise.all((await promise(fs.readdir)(controllerDir)).map(i => { require(path.join('..', 'controller', i)) }));
  Conf.DATABASE = conn.driver.database; Conf.TYPE = conn.driver.options.type;
  console.log('\x1B[35;47m%s\x1B[49m', "loading router……"); cleanAll();
});
