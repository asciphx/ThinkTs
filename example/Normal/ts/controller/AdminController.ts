import { Class, app, Inject, Q, Middle } from "../think/decorator";
import { AdminService } from "../service/AdminService";
import { Controller } from '../think/controller';
import { Context } from "koa";import { html } from "../utils/tool";
import Tag from "../utils/tag";import { W } from "../weblogic";

@Class(["add", "del", "info", "fix", "page"])
class AdminController extends Controller {
  @Inject(AdminService) readonly adm_: AdminService
  
  @app.get()
  page(@Q q){
    return this.adm_.sql(q);
  }

  @Middle(W.Log)
  @app.get("index.html")
  async $index(ctx:Context){
    return html(ctx,{path:"admin",STATUS:await Tag.h("0","selected","STATUS",0,"input-text"),
        ID_TYPE:await Tag.h("0","checked","ID_TYPE",1,"input-radius"),
        USER_TYPE:await Tag.h("0,P,T","checked","USER_TYPE",2,"input-text")})
  }
}