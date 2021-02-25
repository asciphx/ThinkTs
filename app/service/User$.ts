import { Brackets, Repository } from "typeorm"
import { User } from "../entity/User"
import F from "../interface/UserFace"
import $, { Inject } from "../think/service";
import { T, H, encrypt, checkPwd, NTo10 } from "../utils/crypto"
import * as jwt from "jsonwebtoken"
import { Conf } from "../config";
import { Role } from '../entity/Role';

const type:T = "shake256", digest:H = "latin1", length=50;
export default class User$ extends $ implements F {
  constructor(
    private u:Repository<User>=Inject(User),
    private r:Repository<Role>=Inject(Role)
  ) {
    super({
      leftJoin:{e:"u.roles",a:'Role'},
      select:['u.id','u.name','u.account','u.photo'],
      addSelect:['Role.id','Role.name'],
      where: query => new Brackets(qb => {
        if (query.account) qb.where(`account like '%${query.account}%'`)
        if (query.id) qb.andWhere(`u.id >'${query.id}'`)
      }),
      orderBy: { "u.id": "desc" }
    },"u");
    u.findOne({account:"admin"}).then(v=>{if(v===undefined){u.save(new User({
      account:"admin",pwd:encrypt("654321","shake256","latin1",50)}as User)).then(user=>{console.log("User has been saved:",user);})}
    else console.error('\x1B[33;1m%s\x1B[22m',"董事长已存在!\x1B[37m");return;})//创建默认账户admin
  }

  async register(user: User):Promise<any>{
    const exist = await this.u.findOne({account:user.account});
    if (exist) return { code: 409, message: "账户已存在" };
    user.pwd=encrypt(user.pwd,type,digest,length);
    return this.u.insert(new User(user));
  }
  async login(account:string,pwd:string) {
    const user = await this.u.createQueryBuilder()
    .addSelect("User.pwd").where(`account ='${account}'`).getOne()
    if (!user) return {code:406,message:"登录账号有误"};
    if (!checkPwd(pwd, user.pwd,type,digest,length))return {code:406,message:"登录密码有误"};
    user.logged=new Date(Date.now());this.u.update(user.id,user);
    const roles=await this.r.createQueryBuilder("r").select("r.name")
    .leftJoin("r.users","user").where(`user.id ='${user.id}'`).getMany();
    roles.forEach((e,i,l) => {(l[i] as any)=e.name});
    return {role:roles,token:jwt.sign(Object.defineProperty({},account,{enumerable:true,value:roles}),
      String(NTo10(account+Conf.staticKey,66)),{expiresIn:Conf.expiresIn,algorithm:'HS256'}),
    secret:NTo10(account+Conf.staticKey,66).toString(Conf.secret)+`#${(Conf.secret*Conf.cipher).toString(16)}`}
  }
  async fix(id: number, user: User) {
    user.pwd!==undefined&&(user.pwd=encrypt(user.pwd,type,digest,length));//@ts-ignore
    (user.status==1||user.status==="true")&&(user.status=true);
    return this.u.update(id, user)
  }
}