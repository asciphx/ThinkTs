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
          if (query.name) qb.where(`name IN (${query.name.replace(/([^,]+)/g,'"$1"')})`)
        });
      },
      orderBy: { "id": "desc" }
    },"adm");//http://localhost:8080/admin?name=Tim,jdk,lll 那么查找这三个名字的人
  }
  async sql(query:any){
    const {size=10,current=1}=query;
    const sql=`select id,name,label from ${Conf.DATABASE}.admin limit ${current*size-size},${size}`
    const count=await this.adm.query(`select count(*) as c from (${ sql.replace(/ limit .+/,'') }) $`)
    return {list:await this.adm.query(sql),page:new Page(current,size,count[0].c)}
  }
}