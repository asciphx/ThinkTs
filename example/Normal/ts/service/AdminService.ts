import { Brackets, Repository } from "typeorm"
import { Admin } from "../entity/Admin"
import { Service } from "../think/service";
import { Page } from '../utils/page';
import { Conf, Cache } from "../config";

export class AdminService extends Service {
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
    const { size = 10, current = 1 } = query;let sql,count
    if(Conf.TYPE==="postgres"){
      sql=`select id,name,label from public.admin limit ${size} offset ${current*size-size}`;
      count=await this.adm.query(`select count(*) from public.admin`);
    }else{
      sql=`select id,name,label from ${Conf.DATABASE}.admin limit ${current*size-size},${size}`;
      count=await this.adm.query(`select count(*) as count from ${Conf.DATABASE}.admin`)
    }
    return {list:await this.adm.query(sql),page:new Page(current,size,count[0].count)}
  }
}