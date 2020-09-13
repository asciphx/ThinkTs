import { Context } from "koa";import { Page } from "./utils/page";
import { Repository, ObjectLiteral } from "typeorm";
import { _ }from "./controller"
//基础服务类
export abstract class Service{
  protected service:string;
  constructor(v:string){this.service=v.toLowerCase();}
  async save(obj) {
    return this[this.service].save(obj);
  }
  async update(id: number, obj) {
    return this[this.service].update(id, obj);
  }
  async remove(id: number) {
    let rm = await this[this.service].findOne(id);
    return this[this.service].remove(rm);
  }
  async findOne(id: number) {
    return this[this.service].findOne(id);
  }
  async list(ctx: Context,_:_) {
    let { pageNum = 10, current = 1 } = ctx.query;
    let v=(this[this.service]as Repository<ObjectLiteral>).createQueryBuilder()
      .take(pageNum).skip(current*pageNum-pageNum);
    if(_){
      if(Object.keys(_.orderBy).length!==0){
        for (const key in _.orderBy) {v.addOrderBy(key,_.orderBy[key].toUpperCase()) }
      }
      if(_.where){let w=_.where(ctx.query);w&&v.where(w)}
    }
    return {list:await v.getMany(),
      page:new Page(current,pageNum,await v.getCount(),current*pageNum-pageNum).get()};
  }
}