import { Class, app, Inject, Q, Middle, Id } from "../think/decorator";
import { AdminService } from "../service/AdminService";
import { Controller } from '../think/controller';
import { Context } from "koa";import { html } from "../utils/tool";
import { Tag } from "../utils/tag";import { W } from "../weblogic";

@Class(["add", "del", "info", "fix", "page"])
@Id("(\\d+)")//路由主键拦截，中间填的默认参数，此时可去掉该装饰器，不会影响
class AdminController extends Controller {
  @Inject(AdminService) readonly adm_: AdminService
  
  @app.get("sql")//可直接引入app，为像python那样，并且最上面import也能方便少写
  sql(@Q q){
    return this.adm_.sql(q);
  }

  @Middle(W.Log)
  @app.get("index.html")//允许后端模板渲染Tag。
  async index(ctx:Context){
    return html(ctx,{path:"admin",STATUS:await Tag.h("0","selected","STATUS",0,"input-text"),
        ID_TYPE:await Tag.h("0","checked","ID_TYPE",1,"input-radius"),
        USER_TYPE:await Tag.h("0,P,T","checked","USER_TYPE",2,"input-text")})
  }
}