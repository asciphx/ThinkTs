import { Class, Inject, Id } from "../think/decorator";
import { Controller } from '../think/controller';
import { ParseService } from "../service/ParseService";

@Class(["add", "del", "fix", "info", "page"])
@Id("([a-z]{1,9})")//表示只允许字母(1-9位无视大小写)，[降低无效请求带来的性能开销]
class ParseController extends Controller {
  @Inject(ParseService) readonly parse_: ParseService
}