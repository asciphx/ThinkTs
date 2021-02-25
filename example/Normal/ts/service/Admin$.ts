import { Brackets } from "typeorm"
import { Admin } from "../entity/Admin"
import $, { Inject } from "../think/service";
import P from '../utils/page';
import { Conf } from "../config";
export default class Admin$ extends $ {
  constructor(
    private a=Inject(Admin)
  ) {
    super({
      select:[ 'a.id', 'a.name', 'a.label'],
      where: (query:{name:string}) => new Brackets(qb => {
        if (query.name) qb.where(`name IN (${query.name.replace(/([^,]+)/g,"'$1'")})`)
      }),
      orderBy: { "id": "desc" }
    },"a");
  }
  async sql(query:any){
    const size=Number(query.size)||10,page=Number(query.page)||1;let sql,count
    if(Conf.TYPE==="postgres"){
      sql=`select id,name,label from public.admin limit ${size} offset ${page*size-size}`;
      count=await this.a.query(`select count(*) from public.admin`);
    }else{
      sql=`select id,name,label from ${Conf.DATABASE}.admin limit ${page*size-size},${size}`;
      count=await this.a.query(`select count(*) as count from ${Conf.DATABASE}.admin`)
    }
    return {list:await this.a.query(sql),page:new P(page,size,Number(count[0].count))}
  }
}