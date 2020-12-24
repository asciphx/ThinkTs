import { Parse } from "../entity/Parse";import { Repository, getConnection } from 'typeorm';
export default class {
  private static Map: Object; private static Time: number = 10000;//默认缓存10秒，减少sql访问
  private static Repository: Repository<Parse>;
  static Init(name:string, time?:number) {
    this.Map = new Object(); this.Repository = getConnection(name).getRepository(Parse);time&&(this.Time = time);
  }
  static async h(value: string, attr: string, name: string, type: 0|1|2, className: string) {
    if (type === 1 || type === 2) void 0; else type = 0;
    let html: string = await this.getInputHtml(name, type, className);
    if (value !== "" && type !== 2)
      html = await html.replace("value='" + value + "'", "value='" + value + "' " + attr);
    else if(value !== ""){
      let sss: Array<string> = value.split(",");
      for (let i in sss) {
        html = await html.replace("value='" + sss[i] + "'", "value='" + sss[i] + "' " + attr);
      }
    } return html;
  }
  private static async getByNumb(numb: string) {
    let o: Parse = this.Map[numb];
    if (o === undefined||o === null) {
      o=await this.Repository.findOne({keyword:numb});this.Map[numb]=o;
      setTimeout(()=>{this.Map[numb]=null},this.Time);
    }
    return o;
  }
  private static async getInputHtml(name: string, type: number, className: string): Promise<string> {
    if (name === undefined) return "";
    if (className !== "") { className = "class='" + className + "'"; } else { className = ""; }
    let parameter = await this.getByNumb(name),html: string;
    if (type === 1) {
      html = this.setRadioCheckbox(parameter, "radio", name, className);
    } else if (type === 2) {
      html = this.setRadioCheckbox(parameter, "checkbox", name, className);
    } else {
      html = this.setSelect(parameter, name, className);
    }
    return html as string;
  }
  private static setSelect(parameter: Parse, name: string, className: string):string {
    let sb: string = "<label>" + parameter.parameterName + "</label><select " + className +
      "name='" + name + "'><option value=''></option>", vls: Array<string> = parameter.keywordDESC.split(",");
    for (let i in vls) {
      if (i === "remove") continue;
      if (String(vls[i]).indexOf("=") > -1) {
        let vlsKv: Array<string> = String(vls[i]).split("=");
        sb = sb + "<option value='" + vlsKv[0] + "'>" + vlsKv[1] + "</option>";
      } else {
        sb = sb + "<option value='" + vls[i] + "'>" + vls[i] + "</option>";
      }
    } sb = sb + "</select>";
    return sb;
  }
  private static setRadioCheckbox(parameter: Parse, type: string, name: string, className: string):string {
    let sb: string = "<span " + className + ">" + parameter.parameterName + "：",
      vls: Array<string> = parameter.keywordDESC.split(",");
    for (let i in vls) {
      if (i === "remove") continue;
      if (String(vls[i]).indexOf("=") > -1) {
        let vlsKv: Array<string> = String(vls[i]).split("=");
        sb = sb + "<input type='" + type + "' name='"
          + name + "' value='" + vlsKv[0] + "'>&nbsp;" + vlsKv[1];
      } else {
        sb = sb + "<input type='" + type + "' name='"
          + name + "' value='" + vls[i] + "'>&nbsp;" + vls[i];
      }
    } sb = sb + "</span>";
    return sb;
  }
}