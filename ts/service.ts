import { Page } from "./utils/page";import { Repository, ObjectLiteral } from "typeorm";
interface _ {
    where?: Function;
    orderBy?: {};
}
//基础服务类
export abstract class Service{
  protected static service:string;
  protected static _: _;
  constructor(_:_){
    Service.service=this.constructor.name.replace(/(\w*)[A-Z]\w*/,"$1").toLowerCase();
    Service._=_;
  }
  async save(obj) {
    return this[Service.service].save(obj);
  }
  async update(id: number, obj) {
    return this[Service.service].update(id, obj);
  }
  async remove(id: number) {
    let rm = await this[Service.service].findOne(id);
    return this[Service.service].remove(rm);
  }
  async findOne(id: number) {
    return this[Service.service].findOne(id);
  }
  async list(query) {
    let { pageNum = 10, current = 1 } = query;//只需接收每页多少与当前页，默认每页10个，当前第一页
    let v=(this[Service.service]as Repository<ObjectLiteral>).createQueryBuilder()
      .take(pageNum).skip(current*pageNum-pageNum);
    if(Service._){
      if(Object.keys(Service._.orderBy).length!==0){
        for (const key in Service._.orderBy) {v.addOrderBy(key,Service._.orderBy[key].toUpperCase()) }
      }
      if(Service._.where){v.where(Service._.where(query))}
    }
    return {list:await v.getMany(),
      page:new Page(current,pageNum,await v.getCount(),current*pageNum-pageNum).get()};
  }
}