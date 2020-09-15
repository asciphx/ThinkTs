import { Brackets } from "typeorm"
import { Admin } from "../entity/Admin"
import { Service, Inject, container } from "../service";

export class AdminService extends Service {
  constructor(
    @Inject(Admin) private ad=container.get(Admin.name)
  ) {
    super({
      where: query => {
        return new Brackets(qb => {
          if (query.account) qb.where('account like :account', { account: `%${query.account}%` })
          if (query.id) qb.andWhere('id >:id', { id: query.id })
        });
      },
      orderBy: { "id": "desc" }
    });
  }
}
