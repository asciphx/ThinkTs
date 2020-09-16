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
      orderBy: { "id": "desc" }//, select:[ 'user.account', 'user.name', 'user.photo', 'user.status']
      
    })
  }

  async register(user: User):Promise<any>{//entity设置pwd是select:false，就只有select指定才能拿到
    const exist = await this.user.createQueryBuilder()
    .select("User.account").addSelect("User.pwd")
    .where("account =:account",{account:user.account}).getOne()
    if (exist) return {status:409,mes:"账户已存在"};
    return this.user.insert(new User(user.account,encryptPwd(user.pwd),user.name));//insert用于新增比save快
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
  async fix(id: number,user: User){
    user.pwd = encryptPwd(user.pwd);
    return this.user.update(id,user);
  }
}
