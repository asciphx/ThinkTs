import { getRepository } from "typeorm"
import { User } from "../entity/User"
import { UserFace } from "../interface/UserFace"
import { Service } from "../service";

export class UserService extends Service implements UserFace {
  constructor(
    private user = getRepository(User)
  ) { super(User.name) }//确保继承的基础服务类加载增删改查分页方法，也可写成字符串"user"

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
