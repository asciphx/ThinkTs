import { Brackets, Repository } from "typeorm"
import { Parse } from "../entity/Parse";
import { Service } from "../think/service";
import { Cache } from "../config"

export class ParseService extends Service {
  constructor(
    private parse:Repository<Parse>=Cache["Parse"]
  ) {
    super({
      where: (query:{keyword:string}) => {
        return new Brackets(qb => {
          if (query.keyword) qb.where(`keyword like "%${query.keyword}%"`)
        });
      },
      orderBy: { "keyword": "desc" }
    });
  }
}