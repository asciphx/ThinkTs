import { Class, Inject, Id } from "../think/decorator";
import { Controller } from '../think/controller';
import Parse$ from "../service/Parse$";

@Class(["add", "del", "fix", "info", "page"])
@Id("([A-Z_]{1,9})")
class Parse extends Controller {
  @Inject(Parse$) readonly parse_: Parse$
}