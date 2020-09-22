import { Parse } from "../entity/Parse";import { getConnection } from 'typeorm';
export class Tag {
  static Map: Object;
  static Repository: any;
  static Init(name: string) {
    this.Map = new Object(); this.Repository = getConnection(name).getRepository(Parse); 
  }
  static async parseHtml(selectValue: string, selectAttValue: string, name: string, type: number, inputName: string, className: string) {
    let html: string = await this.getInputHtml(name, type, inputName, className);
    if (html != null) {
      if (selectValue != "" && type != 2) {
        html = await html.replace("value='" + selectValue + "'", "value='" + selectValue + "' " + selectAttValue);
      } else {
        let sss: Array<string> = selectValue.split(",");
        for (let i in sss) {
          html = await html.replace("value='" + sss[i] + "'", "value='" + sss[i] + "' " + selectAttValue);
        }
      } return html;
    }
  }
  static async getByNumb(numb: string): Promise<Parse> {
    let o = await this.Repository.findOne({ keyword: numb })
    if (o) return o; else return undefined;
  }
  static async getInputHtml(name: string, type: number, inputName: string, className: string): Promise<string> {
    if (type == 1 || type == 2) { } else type = 0;
    let numbFmt: string = name + type;
    let html: string|boolean = this.Map.hasOwnProperty(numbFmt);
    if (!html) {
      if (className != "") { className = "class='" + className + "'"; } else { className = ""; }
      let parameter = await this.getByNumb(name);
      if (parameter != null) {
        if (type == 1) {
          html = this.setRadioCheckbox(parameter, "radio", inputName, className);
        } else if (type == 2) {
          html = this.setRadioCheckbox(parameter, "checkbox", inputName, className);
        } else {
          html = this.setSelect(parameter, inputName, className);
        }
      }
      this.Map[numbFmt]=html;
    }
    return html as string;
  }
  static setSelect(parameter: Parse, inputName: string, className: string):string {
    let sb: string = "<label>" + parameter.parameterName + "</label><select " + className +
      "name='" + inputName + "'><option value=''></option>", vls: Array<string> = parameter.keywordDESC.split(",");
    for (let i in vls) {
      if (i == "remove") continue;
      if (String(vls[i]).indexOf("=") > -1) {
        let vlsKv: Array<string> = String(vls[i]).split("=");
        sb = sb + "<option value='" + vlsKv[0] + "'>" + vlsKv[1] + "</option>";
      } else {
        sb = sb + "<option value='" + vls[i] + "'>" + vls[i] + "</option>";
      }
    } sb = sb + "</select>";
    return sb;
  }
  static setRadioCheckbox(parameter: Parse, type: string, inputName: string, className: string):string {
    let sb: string = "<span " + className + ">" + parameter.parameterName + "：",
      vls: Array<string> = parameter.keywordDESC.split(",");
    for (let i in vls) {
      if (i == "remove") continue;
      if (String(vls[i]).indexOf("=") > -1) {
        let vlsKv: Array<string> = String(vls[i]).split("=");
        sb = sb + vlsKv[1] + "<input type='" + type + "' name='"
          + inputName + "' value='" + vlsKv[0] + "'>&nbsp;";
      } else {
        sb = sb + vls[i] + "<input type='" + type + "' name='"
          + inputName + "' value='" + vls[i] + "'>&nbsp;";
      }
    } sb = sb + "</span>";
    return sb;
  }
}