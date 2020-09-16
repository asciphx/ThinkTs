import { Brackets, getRepository } from "typeorm"
import { User } from "../entity/User"
import { UserFace } from "../interface/UserFace"
import { Service } from "../service";
import { encryptPwd, checkPwd, NTo10 } from "../utils/cryptoUtil"
import * as jwt from "jsonwebtoken"
import { Config } from "../../config";

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

  async register(user: User) {
    const exist = await this.user.findOne({account:user.account});
    if (exist) return {status:409,massage:"账户已存在"};
    user.pwd = encryptPwd(user.pwd);
    return this.user.save(user);
  }
  async login(account:string,pwd:string) {
    const user = await this.user.findOne({account:account});
    if (!user) return {status:406,mes:"登录账号有误"};
    if (!checkPwd(pwd, user.pwd))return {status:406,mes:"登录密码有误"};
    user.logged=new Date(Date.now());this.user.update(user.id,user);
    return {code: 200, mes: '登录成功',token:
      jwt.sign({account:account},NTo10(account,62).toString(Config.cipher),
      { expiresIn: '2h',algorithm: 'HS256' }
     ),secret:NTo10(account,62).toString(Config.secret)}
  }
}
