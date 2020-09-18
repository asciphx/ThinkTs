import { Brackets } from "typeorm"
import { User } from "../entity/User"
import { UserFace } from "../interface/UserFace"
import { Service } from "../service";
import { encryptPwd, checkPwd, NTo10 } from "../utils/cryptoUtil"
import * as jwt from "jsonwebtoken"
import { Conf } from "../../config";

export class UserService extends Service implements UserFace {
  constructor(
    private user=Conf[User.name]
  ) {
    super({
      leftJoin:{e:"user.roles",a:'role'},
      // select:[ 'user.id','user.account', 'role.id','role.name', 'user.photo', 'user.status'],
      addSelect:['role.id','role.name'],
      where: query => {
        return new Brackets(qb => {
          if (query.account) qb.where('account like :v', { v: `%${query.account}%` })
          if (query.id) qb.andWhere('id >:i', { i: query.id })
        });
      },
      orderBy: { "user.id": "desc" }
    })
  }

  async register(user: User):Promise<any>{
    const exist = await this.user.findOne({account:user.account});
    if (exist) return {status:409,mes:"账户已存在"};
    return this.user.insert(new User(user.account,encryptPwd(user.pwd)));
  }
  async login(account:string,pwd:string) {
    const user = await this.user.createQueryBuilder()
    .addSelect("User.pwd").where("account =:ac",{ac:account}).getOne()
    if (!user) return {status:406,mes:"登录账号有误"};
    if (!checkPwd(pwd, user.pwd))return {status:406,mes:"登录密码有误"};
    user.logged=new Date(Date.now());this.user.update(user.id,user);
    return {code: 200, mes: '登录成功',
    token:jwt.sign({account:account},NTo10(account,62).toString(Conf.cipher),{expiresIn:Conf.expiresIn,algorithm:'HS256'}),
    secret:NTo10(account,62).toString(Conf.secret)+`#${(Conf.secret*0x4F).toString(16)}`}
  }
  async fix(id: number,user: User){
    user.pwd = encryptPwd(user.pwd);
    return this.user.update(id,user);
  }
}
