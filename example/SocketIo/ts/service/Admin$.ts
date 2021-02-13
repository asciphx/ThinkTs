import { Brackets, Repository } from "typeorm"
import { Admin } from "../entity/Admin"
import $ from "../think/service";
import { Page } from '../utils/page';
import { Conf, Cache } from "../config";

export default class Admin$ extends $ {
  constructor(
    private adm:Repository<Admin>=Cache["Admin"]
  ) {
    super({
      select:[ 'adm.id', 'adm.name', 'adm.label'],
      where: (query:{name:string}) => {
        return new Brackets(qb => {
          if (query.name) qb.where(`name IN (${query.name.replace(/([^,]+)/g,"'$1'")})`)
        });
      },
      orderBy: { "id": "desc" }
    },"adm");
  }
  async sql(query:any){
    const size=Number(query.size)||10,page=Number(query.page)||1;let sql,count
    if(Conf.TYPE==="postgres"){
      sql=`select id,name,label from public.admin limit ${size} offset ${page*size-size}`;
      count=await this.adm.query(`select count(*) from public.admin`);
    }else{
      sql=`select id,name,label from ${Conf.DATABASE}.admin limit ${page*size-size},${size}`;
      count=await this.adm.query(`select count(*) as count from ${Conf.DATABASE}.admin`)
    }
    return {list:await this.adm.query(sql),page:new Page(page,size,Number(count[0].count))}
  }
}