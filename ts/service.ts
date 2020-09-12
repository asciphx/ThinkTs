import { Repository, ObjectLiteral } from "typeorm"
export abstract class Service{
  protected svc:Repository<ObjectLiteral>;
  constructor(svc){this.svc=svc;}
  async findOne(id: number) {
    return this.svc.findOne(id);
  }
  async save(obj) {
    return this.svc.save(obj);
  }
  async update(id: number, obj) {
    return this.svc.update(id, obj);
  }
  async remove(id: number) {
    let rm = await this.svc.findOne(id);
    return this.svc.remove(rm);
  }
}