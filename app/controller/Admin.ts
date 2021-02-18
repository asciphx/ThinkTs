import { Class, app, Inject, Q, Middle, R } from "../think/decorator";
import Admin$ from "../service/Admin$";
import { Controller } from '../think/controller';
import { Context, Response } from "koa";import { html } from "../utils/tool";
import T from "../utils/tag";import { W } from "../weblogic";

@Class(["add", "del", "info", "fix", "page"])
class Admin extends Controller {
  @Inject(Admin$) readonly adm_: Admin$
  
  @app.get("sql")
  sql(@Q q,@R r:Response){
    r.status=202;//设置状态码
    return this.adm_.sql(q);
  }
  @Middle(W.Log)
  @app.get("index.html")
  async index(ctx:Context){
    return html(ctx,{path:"admin",STATUS:await T.h("0","selected","STATUS",0,"input-text"),
        ID_TYPE:await T.h("0","checked","ID_TYPE",1,"input-radius"),
        USER_TYPE:await T.h("0,P,T","checked","USER_TYPE",2,"input-text")}).next().value;
  }
}