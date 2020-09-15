import { Brackets, getRepository } from "typeorm"
import { User } from "../entity/User"
import { UserFace } from "../interface/UserFace"
import { Service } from "../service";

export class UserService extends Service implements UserFace {
  constructor(
    private user=getRepository(User)
  ) {
    super({
      where: query => {
        return new Brackets(qb => {
          if (query.account) qb.where('account like :account', { account: `%${query.account}%` })
          if (query.id) qb.andWhere('id >:id', { id: query.id })
        });
      },
      orderBy: { "id": "desc" }
    })
  }

  async register(user: User) {console.log(await this.user.findOne({id:1}))
    // user.password = this.cryptoUtil.encryptPassword(user.password);
    const existing = await this.user.findOne({account:user.account});
    if (existing) return {status:409,massage:"账户已存在"};
    return this.user.save(user);
  }
  async login(user: User) {

    return "Method not implemented."
  }
}
