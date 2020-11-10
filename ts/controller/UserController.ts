import { Class, Post, Middle, Inject, Put, B, P } from "../think/decorator";
import { UserService } from "../service/UserService";
import { Controller } from '../think/controller';
import { U, W } from '../weblogic';
import { Conf } from "../config";

@Class("user",["del", "info", "page"])
class UserController extends Controller {
  @Inject(UserService) readonly u_: UserService
  
  @Middle(W.Log,W.V_B("account#3~10|1","pwd#6~23|1","name#1~15"))
  @Post("register")
  register(@B b) {
    return this.u_.register(b).then(r=>r.code?r.message:`第${Conf.TYPE==="postgres"?r.raw[0].id:r.raw.insertId}位注册成功`)
  }
  @Middle(W.Log,W.V_B("pwd#6~23|1","account|1#3~10"))
  @Post("login")
  login(@B b) {
    return this.u_.login(b.account,b.pwd)
  }
  @Middle(U.single("avatar"),W.pic("photo"),
    W.V_B("pwd#6~23","name#1~15","status","phone#12","photo"))
  @Put(":id")
  fix(@B b,@P p) {
    if(b.__proto__===undefined)Object.setPrototypeOf(b, new Object());
    return this.u_.fix(p.id,b).then(r=>r.raw.changedRows?'已修改':'未修改')
  }
}