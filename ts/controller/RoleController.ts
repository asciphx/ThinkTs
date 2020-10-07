import { Class, Service, Put, Get, Q, R, P } from "../think/decorator"
import { RoleService } from '../service/RoleService';
import { Controller } from '../think/controller';

@Class(["del", "info", "page", "add"])
class RoleController extends Controller {
  @Service(RoleService) readonly role_: RoleService

  @Put(":id")
  async $(@P p,@R r){
    return await this.role_.fix(p.id,r.body);
  }
  @Get("/perm")//http://localhost:3000/role/perm?roles=admin,normal,……
  async perm(@Q q){
    return await this.role_.perm(q.roles);
  }
}