import { Brackets, getRepository } from "typeorm"
import { Admin } from "../entity/Admin"
import { Service } from "../service";

export class AdminService extends Service {
  constructor(
    private adm=getRepository(Admin)
  ) {
    super({
      where: (query:{name:string}) => {
        return new Brackets(qb => {
          if (query.name) qb.where("name IN (:...arr)", { arr: query.name.split(',') })
        });
      },
      orderBy: { "id": "desc" },
      select:[ 'adm.id', 'adm.name', 'adm.label']
    },"adm");//http://localhost:3000/admin?name=Tim,jdk,lll 那么查找这三个名字的人
  }
}
