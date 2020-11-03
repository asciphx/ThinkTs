import { Brackets, Repository } from "typeorm"
import { User } from "../entity/User"
import { UserFace } from "../interface/UserFace"
import { Service } from "../think/service";
import { T, H, encrypt, checkPwd, NTo10 } from "../utils/crypto"
import * as jwt from "jsonwebtoken"
import { Conf, Cache } from "../config";
import { Role } from '../entity/Role';

const type:T = "shake256", digest:H = "base64", length=28;
export class UserService extends Service implements UserFace {
  constructor(
    private user:Repository<User>=Cache[User.name],
    private role:Repository<Role>=Cache[Role.name]
  ) {
    super({
      leftJoin:{e:"user.roles",a:'role'},
      addSelect:['role.id','role.name'],
      where: query => {
        return new Brackets(qb => {
          if (query.account) qb.where(`account like "%${query.account}%"`)
          if (query.id) qb.andWhere(`id >"${query.id}"`)
        });
      },
      orderBy: { "user.id": "desc" }
    })
  }

  async register(user: User):Promise<any>{
    const exist = await this.user.findOne({account:user.account});
    if (exist) return { code: 409, message: "账户已存在" };
    user.pwd=encrypt(user.pwd,type,digest,length)
    return this.user.insert(new User(user));
  }
  async login(account:string,pwd:string) {
    const user = await this.user.createQueryBuilder()
    .addSelect("User.pwd").where(`account ="${account}"`).getOne()
    if (!user) return {code:406,message:"登录账号有误"};
    if (!checkPwd(pwd, user.pwd,type,digest,length))return {code:406,message:"登录密码有误"};
    user.logged=new Date(Date.now());this.user.update(user.id,user);
    const roles=await this.role.createQueryBuilder("r").select("r.name")
    .leftJoin("r.users","user").where("user.id =:u",{u:user.id}).getMany();
    roles.forEach((e,i,l) => {(l[i] as any)=e.name});
    return {role:roles,token:jwt.sign(Object.defineProperty({},account,{enumerable:true,value:roles}),
      NTo10(account,62).toString(Conf.cipher),{expiresIn:Conf.expiresIn,algorithm:'HS256'}),
    secret:NTo10(account,62).toString(Conf.secret)+`#${(Conf.secret*0x4F).toString(16)}`}
  }
  async fix(id: number, user: User) {
    user.pwd&&(user.pwd=encrypt(user.pwd,type,digest,length));
    return this.user.update(id, user)
  }
}