import P from "../utils/page";import { getRepository, ObjectLiteral,EntityTarget } from "typeorm";import { vType } from "../config";
interface _{orderBy?:{};groupBy?:string;leftJoin?:{e:Function|string,a:string,c?:string,p?:ObjectLiteral;};where?:Function;
addLeftJoin?:{e:Function|string,a:string,c?:string,p?:ObjectLiteral;};select?:string|string[]|any;addSelect?:string|string[]|any}
//基础服务类，$默认是实体类小写，如有变请在super第二个参数传入，直接return;此时默认的状态码是204，意思是No Content
const Entity={};
export default abstract class Service{
  private _: _;
  private $:string=this.constructor.name.replace(/(\w*)[A-Z$]\w*/,"$1").toLowerCase();
  constructor(_?:_,$?:string){
    this._=_;if($){vType[$]=vType[this.$];delete vType[this.$];this.$=$;}
  }
  private*save(obj) {
    return this[this.$].save(obj);
  }
  private*update(id: number, obj) {
    return this[this.$].update(id, obj);
  }
  private async*remove(id: number) {
    const v = await this[this.$].findOne(id);
    if (!v) { return; } return this[this.$].remove(v);
  }
  private*findOne(id: number) {
    return this[this.$].findOne(id);
  }
  private async*list(query) {
    const size=Number(query.size)||10,page=Number(query.page)||1;
    let v=this[this.$].createQueryBuilder(this.$).take(size).skip(page*size-size);
    if(this._!==undefined){
      if(this._.leftJoin!==undefined){v.leftJoin(this._.leftJoin.e,this._.leftJoin.a,this._.leftJoin.c,this._.leftJoin.p);}
      if(this._.addLeftJoin!==undefined){v.leftJoin(this._.addLeftJoin.e,this._.addLeftJoin.a,this._.addLeftJoin.c,this._.addLeftJoin.p);}
      if(this._.select!==undefined){v.select(this._.select)}
      if(this._.addSelect!==undefined){v.addSelect(this._.addSelect)}
      if(this._.where!==undefined){v.where(this._.where(query))}
      if(this._.orderBy!==undefined&&Object.getOwnPropertyNames(this._.orderBy).toString()!==""){
        for (const key in this._.orderBy) {v.addOrderBy(key,this._.orderBy[key].toUpperCase()) }
      }
      if(this._.groupBy!==undefined){v.groupBy(this._.groupBy)}
    }
    const [list,count]=await v.cache(true).getManyAndCount();v=null;return {list:list,page:new P(page,size,count).get()};
  }
}
export const Inject=(e:EntityTarget<any>&{name:string})=>{
  if(Entity[e.name]===undefined){Entity[e.name]=getRepository(e);vType[e.name]={};
    Entity[e.name].metadata.ownColumns.forEach(r=>{let t=r.type;
      Object.defineProperty(vType[e.name],r.propertyName,{enumerable:true,writable:true,//@ts-ignore
      value:t==="datetime"?26:t.name==="Number"?9:t.name==="Boolean"?5:t==="tinyint"?2:t==="smallint"?4:
      t==="mediumint"?6:t==="bigint"?18:r.length===""?255:Number(r.length)});typeof t==="string"?void 0:t=null;
    });}return Entity[e.name]
}