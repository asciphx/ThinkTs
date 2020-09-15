import { Page } from "./utils/page";
import { Repository, ObjectLiteral } from "typeorm";
interface _ { where?:Function; orderBy?: {} }
//基础服务类
export abstract class Service{
  protected $:string=this.constructor.name.replace(/(\w*)[A-Z]\w*/,"$1").toLowerCase();
  private _: _;
  constructor(_?:_,$?:string){
    this._=_;if($)this.$=$;
  }
  private async save(obj) {
    return this[this.$].save(obj);
  }
  private async update(id: number, obj) {
    return this[this.$].update(id, obj);
  }
  private async remove(id: number) {
    let rm = await this[this.$].findOne(id);
    return this[this.$].remove(rm);
  }
  private async findOne(id: number) {
    return this[this.$].findOne(id);
  }
  private async list(query) {
    let { size = 10, current = 1 } = query;//只需接收每页多少与当前页，默认每页10个，当前第一页
    let v=(this[this.$]as Repository<ObjectLiteral>).createQueryBuilder()
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