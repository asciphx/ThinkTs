import { Brackets, getRepository } from "typeorm"
import { User } from "../entity/User"
import { UserFace } from "../interface/UserFace"
import { Service } from "../service";
import { encryptPwd, checkPwd, NTo10 } from "../utils/cryptoUtil"
import * as jwt from "jsonwebtoken"
import { Config } from "../../config";
import { Admin } from "../entity/Admin";

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
      orderBy: { "id": "desc" },//下面select相当于select查询语句，写了的键就有
      // select:[ 'user.account', 'user.name', 'user.photo', 'user.status'],
      addSelect:"user.pwd"//因密码设置了select为false，必须加上这个条件才能额外筛选密码这列,或者在上面加入'user.pwd'也可
    })
  }

  async register(user: User):Promise<any>{//insert用于新增比save快
    const exist = await this.user.findOne({account:user.account});
    if (exist) return {status:409,mes:"账户已存在"};
    return this.user.insert(new User(user.account,encryptPwd(user.pwd)));
  }
  async login(account:string,pwd:string) {//entity设置pwd是select:false，就只有addSelect表示增加拿取
    const user = await this.user.createQueryBuilder()//createQueryBuilder如不传参，别名是User，实体类名字
    .addSelect("User.pwd").where("account =:account",{account:account}).getOne()//这已经额外选了pwd键
    if (!user) return {status:406,mes:"登录账号有误"};
    if (!checkPwd(pwd, user.pwd))return {status:406,mes:"登录密码有误"};
    user.logged=new Date(Date.now());this.user.update(user.id,user);//这里的update实际上是全覆盖
    return {code: 200, mes: '登录成功',token:
      jwt.sign({account:account},
        NTo10(account,62).toString(Config.cipher),
      { expiresIn: '2h',algorithm: 'HS256' }
     ),secret:NTo10(account,62).toString(Config.secret)}
  }
  async fix(id: number,user: User){//只有put请求可以仅update一个键
    user.pwd = encryptPwd(user.pwd);
    return this.user.update(id,user);
  }
}
