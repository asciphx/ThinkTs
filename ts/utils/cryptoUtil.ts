import { createHash } from 'crypto';
/**
 * 加密登录密码
 * @param password 登录密码
 */
const encryptPassword = (password: string): string => {
  return createHash('shake256', { outputLength: 40 }).update(password).digest('latin1');
}
/**
 * 检查登录密码是否正确
 * @param password 登录密码
 * @param encryptedPassword 加密后的密码
 */
const checkPassword = (password: string, encryptedPassword): boolean => {
  const currentPass = encryptPassword(password);
  if (currentPass === encryptedPassword) {
    return true;
  }
  return false;
}
/**
 * 编码中文
 * @param string 中文
 */
const utf8_encode = (string: string) => {
  string = string.replace(/\r\n/g, "\n");
  var utftext = "";
  for (var n = 0; n < string.length; n++) {
    var c = string.charCodeAt(n);
    if (c < 128) {
      utftext += String.fromCharCode(c);
    } else if (c > 127 && c < 2048) {
      utftext += String.fromCharCode(c >> 6 | 192);
      utftext += String.fromCharCode(c & 63 | 128);
    } else {
      utftext += String.fromCharCode(c >> 12 | 224);
      utftext += String.fromCharCode(c >> 6 & 63 | 128);
      utftext += String.fromCharCode(c & 63 | 128);
    }

  }
  return utftext;
}
/**
 * 解码utf8
 * @param utf8 utf8字符
 */
const utf8_decode = (utf8: string) => {
  let string = "", i = 0, c = 0;
  while (i < utf8.length) {
    c = utf8.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i++;
    } else if (c > 191 && c < 224) {
      string += String.fromCharCode((c & 31) << 6 | (utf8.charCodeAt(i + 1) & 63));
      i += 2;
    } else {
      string += String.fromCharCode((c & 15) << 12 | (utf8.charCodeAt(i + 1) & 63) << 6 | (utf8.charCodeAt(i + 2)
        & 63));
      i += 3;
    }
  }
  return string;
}
const TenToN=(v:number,n):string=>{
  if(n>62||n<2||v>9007199254740991)return;
  const hexString="0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ";let num="",mod
  for(let i=1;i<54;i++){mod=v%n;v=Math.floor(v/n);
    if(v>0){num=hexString.charAt(mod)+num
    }else return hexString.charAt(mod)+num;
  }
}
const NTo10=(v:string,n):number=>{if(n>62||n<2)return;if(n<37)v=v.toLowerCase();
  const hexString="0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ";let addNumber=0
  for(let i=0;i<v.length;i++){if(hexString.indexOf(v.charAt(i))===-1)return
    for(let h=0;h<hexString.length;h++){
      if(v.charAt(v.length-i-1)===hexString.charAt(h)){
        addNumber=addNumber+h*Math.pow(n,i);
      }
    }
  }
  return addNumber;
}
export { encryptPassword, checkPassword, utf8_encode, utf8_decode, TenToN, NTo10 }