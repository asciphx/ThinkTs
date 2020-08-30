import {getRepository} from "typeorm"
import {Admin} from "../entity/Admin"
import {User} from "../entity/User"

export class _AdminUserService{
  constructor(
    private admin=getRepository(Admin),
    private user=getRepository(User)
  ){}
  
  async all(){
    let a=await this.admin.find()
    let u=await this.user.find()
    return [...a,...u]
  }
}
