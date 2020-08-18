import {getRepository} from "typeorm"
import {Admin} from "../entity/Admin"
import { AdminFace } from '../interface/AdminFace';

export class AdminService implements AdminFace{
  constructor(private admin=getRepository(Admin)){}
  
  async all(){
    return await this.admin.find()
  }
  async one(id:number){
    return await this.admin.findOne(id);
  }
  async save(obj:Admin) {
    return this.admin.save(obj);
  }
  async update(id,obj) {
    return this.admin.update(id,obj);
  }
  async remove(id) {
    let rm = await this.admin.findOne(id);
    return await this.admin.remove(rm);
  }
}
