import { Class, Inject, Id } from "../think/decorator";
import { Controller } from '../think/controller';
import { ParseService } from "../service/ParseService";

@Class(["add", "del", "fix", "info", "page"])
@Id("([a-z]{1,9})")
class ParseController extends Controller {
  @Inject(ParseService) readonly parse_: ParseService
}