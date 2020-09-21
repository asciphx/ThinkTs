import { Class, Service, Put, Get } from "../think/decorator"
import { RoleService } from '../service/RoleService';
import { Controller } from '../think/controller';
import { Context } from "koa";

@Class(["del", "info", "page", "add"])
class RoleController extends Controller {
  @Service(RoleService) readonly role_: RoleService

  @Put(":id")
  async $(ctx:Context){
    ctx.body = await this.role_.fix(ctx.params.id,ctx.request.body);
  }
  @Get("/perm")//http://localhost:3000/role/perm?roles=admin,normal,……
  async perm(ctx:Context){
    ctx.body = await this.role_.perm(ctx.query.roles);
  }
}