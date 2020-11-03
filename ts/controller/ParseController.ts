import { Class, Inject} from "../think/decorator";
import { Controller } from '../think/controller';
import { ParseService } from "../service/ParseService";

@Class(["add", "del", "fix", "info", "page"])
class ParseController extends Controller {
  @Inject(ParseService) readonly parse_: ParseService
}