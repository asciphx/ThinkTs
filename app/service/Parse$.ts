import { Brackets, Repository } from "typeorm"
import { Parse } from "../entity/Parse";
import $ from "../think/service";
import { Cache } from "../config"

export default class Parse$ extends $ {
  constructor(
    private parse:Repository<Parse>=Cache["Parse"]
  ) {
    super({
      where: (query:{keyword:string}) => new Brackets(qb => {
        if (query.keyword) qb.where(`keyword like '%${query.keyword}%'`)
      })
    });
  }
}