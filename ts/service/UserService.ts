import { getRepository } from "typeorm"
import { User } from "../entity/User"
import { UserFace } from "../interface/UserFace"
import { Service } from "../service";
import { Brackets } from "typeorm";

export class UserService extends Service implements UserFace {
  constructor(
    private user = getRepository(User)
  ) {
    super({
      where: query => {
        return new Brackets(qb => {
          if (query.account) qb.where('account like :account', { account: `%${query.account}%` })//模糊查询
          if (query.id) qb.andWhere('id >:id', { id: query.id })//取id大于某个范围的
        });
      },
      orderBy: { "id": "desc" }
    })
  }

  async register(user: User) {
    const existing = await this.user.findOne(user.account);
    // if (existing) throw new HttpException('账号已存在', 409);
    // user.password = this.cryptoUtil.encryptPassword(user.password);
    // await this.userRepo.save(this.userRepo.create(user));
  }
  async login(user: User) {
    throw new Error("Method not implemented.");
  }
}
