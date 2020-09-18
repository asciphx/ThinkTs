import { Class, Post, Roles, Service, Get } from "../decorator"
import { MenuService } from '../service/MenuService';
import { Controller } from '../controller';
//自动实现curd以及分页
@Class(["add", "del", "info", "fix", "page"])
class MenuController extends Controller {
  @Service(MenuService) readonly menuService: MenuService
}