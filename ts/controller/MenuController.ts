import { Class, Post, Roles, Service, Get } from "../decorator"
import { MenuService } from '../service/MenuService';
import { Controller } from '../controller';

@Class(["add", "del", "info", "fix", "page"])
class MenuController extends Controller {
  @Service(MenuService) readonly menu: MenuService
}