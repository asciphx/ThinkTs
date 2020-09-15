import { Page } from "./utils/page";import HashMap = require('hashmap');
import { getRepository, Repository, ObjectLiteral } from "typeorm";
interface _ { where?:Function; orderBy?: {} }
export const container=new HashMap<string, Repository<ObjectLiteral>>();
export const Inject=v=>(t,k,d)=>{if(container.has(v.name)===false)container.set(v.name,getRepository(v))}
//基础服务类
export abstract class Service{
  protected $:string=this.constructor.name.replace(/(\w*)[A-Z]\w*/,"$1");
  private _: _;
  private readonly service:Repository<ObjectLiteral>;
  constructor(_?:_){
    this._=_;
    this.service=container.get(this.$)
  }
  private async save(obj) {
    return this.service.save(obj);
  }
  private async update(id: number, obj) {
    return this.service.update(id, obj);
  }
  private async remove(id: number) {
    let rm = await this.service.findOne(id);
    return this.service.remove(rm);
  }
  private async findOne(id: number) {
    return this.service.findOne(id);
  }
  private async list(query) {
    let { size = 10, current = 1 } = query;//只需接收每页多少与当前页，默认每页10个，当前第一页
    let v=this.service.createQueryBuilder()
      .take(size).skip(current*size-size);
    if(this._){
      if(Object.keys(this._.orderBy).length!==0){
        for (const key in this._.orderBy) {v.addOrderBy(key,this._.orderBy[key].toUpperCase()) }
      }
      if(this._.where){v.where(this._.where(query))}
    }
    return {list:await v.getMany(),page:new Page(current,size,await v.getCount()).get()};
  }
}