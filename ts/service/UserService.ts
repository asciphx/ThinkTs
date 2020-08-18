import {getRepository} from "typeorm"
import {User} from "../entity/User"
import {UserFace} from "../interface/UserFace"

export class UserService implements UserFace{
  constructor(private user=getRepository(User)){}
  async login(user: User) {
    throw new Error("Method not implemented.");
  }
  
  async register(user: User){
    const existing = await this.user.findOne(user.account);
    // if (existing) throw new HttpException('账号已存在', 409);
    // user.password = this.cryptoUtil.encryptPassword(user.password);
    // await this.userRepo.save(this.userRepo.create(user));
  }
  async all(){
    return this.user.find()
  }
  async one(id:number){
    return this.user.findOne(id);
  }
  async save(obj:User) {
    return this.user.save(obj);
  }
  async update(id:number,obj) {
    return this.user.update(id,obj);
  }
  async remove(id:number) {
    let rm = await this.user.findOne(id);
    return this.user.remove(rm);
  }
}
