import { Brackets } from "typeorm"
import { Admin } from "../entity/Admin"
import { Service } from "../service";
import { Page } from '../utils/page';
import { Conf } from "../../config";

export class AdminService extends Service {
  constructor(
    private adm=Conf[Admin.name]
  ) {
    super({
      where: (query:{name:string}) => {
        return new Brackets(qb => {
          if (query.name) qb.where("name IN (:...arr)", { arr: query.name.match(/[^,]+/g) })
        });
      },
      orderBy: { "id": "desc" },
      select:[ 'adm.id', 'adm.name', 'adm.label']
    },"adm");//http://localhost:3000/admin?name=Tim,jdk,lll 那么查找这三个名字的人
  }
  async sql(query:any){
    const {size=10,current=1}=query;
    const sql=`select id,name,label from ${Conf.DATABASE}.admin limit ${current*size-size},${size}`
    const count=await this.adm.query(`select count(*) as c from (${ sql.replace(/ limit .+/,'') }) $`)
    return {list:await this.adm.query(sql),page:new Page(current,size,count[0].c)}
  }
}
