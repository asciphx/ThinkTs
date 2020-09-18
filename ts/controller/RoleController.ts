import { Class, Post, Roles, Service, Get } from "../decorator"
import { RoleService } from '../service/RoleService';
import { Controller } from '../controller';
//自动实现curd以及分页
@Class(["add", "del", "info", "fix", "page"])
class RoleController extends Controller {
  @Service(RoleService) readonly role_: RoleService
}