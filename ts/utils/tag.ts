import { Parse } from "../entity/Parse";import { getConnection } from 'typeorm';
export class Tag {
  private static Map: Object; private static Time: number = 10000;//缓存10秒，减少sql访问
  private static Repository: any;
  static Init(name: string) {
    this.Map = new Object(); this.Repository = getConnection(name).getRepository(Parse); 
  }
  static async h(value: string, attr: string, name: string, type: 0|1|2, className: string) {
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
  private static async getByNumb(numb: string): Promise<Parse> {
    let o = await this.Repository.findOne({ keyword: numb });
    if (o) return o; else return void 0;
  }
  private static async getInputHtml(name: string, type: number, className: string): Promise<string> {
    if (type === 1 || type === 2) void 0; else type = 0;
    let numbFmt: string = name + type;
    let html: string = this.Map[numbFmt];
    if (html===undefined||html===null) {
      if (className !== "") { className = "class='" + className + "'"; } else { className = ""; }
      let parameter = await this.getByNumb(name);
      if (parameter !== undefined) {
        if (type === 1) {
          html = this.setRadioCheckbox(parameter, "radio", name, className);
        } else if (type === 2) {
          html = this.setRadioCheckbox(parameter, "checkbox", name, className);
        } else {
          html = this.setSelect(parameter, name, className);
        }
      }else return ""
      this.Map[numbFmt] = html;
      setTimeout(()=>this.Map[numbFmt]=null,this.Time)
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