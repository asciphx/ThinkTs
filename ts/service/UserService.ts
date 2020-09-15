import { Brackets } from "typeorm"
import { User } from "../entity/User"
import { UserFace } from "../interface/UserFace"
import { Service, Inject, container } from "../service";

export class UserService extends Service implements UserFace {
  constructor(
    @Inject(User) private user=container.get(User.name)
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

  async register(user: User) {
    const existing = await this.user.findOne(user.account);
    // if (existing) throw new HttpException('账号已存在', 409);
    // user.password = this.cryptoUtil.encryptPassword(user.password);
    // await this.userRepo.save(this.userRepo.create(user));
  }
  async login(user: User) {

    return "Method not implemented."
  }
}
