import {getRepository} from "typeorm"
import {User} from "../entity/User"

export class UserService{
  user=getRepository(User)
  async all(){
    return this.user.find()
    // const existing = this.findOneByAccount(user.account);
    // if (existing) throw new HttpException('账号已存在', 409);
  }
  /** search one
   * @param id
   */
  async one(id:number){
    return this.user.findOne(id);
  }
  /** save one
   * @param obj
   */
  async save(obj:User) {
    return this.user.save(obj);
  }
  /** update one
   * @param id
   * @param obj
   */
  async update(id:number,obj) {
    return this.user.update(id,obj);
  }
  /** remove one
   * @param id
   */
  async remove(id:number) {
    let rm = await this.user.findOne(id);
    return this.user.remove(rm);
  }
}
