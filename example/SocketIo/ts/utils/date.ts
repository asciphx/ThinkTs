const week = {0:"\u65e5",1:"\u4e00",2:"\u4e8c",3:"\u4e09",4:"\u56db",5:"\u4e94",6:"\u516d"};
export default {
  /**简易的获取时间
  * @param time:Date.now()
  */
  formateDate(time:number){
    if(!time) return '';let date = new Date(time)
    const r = date.getFullYear()+'-'+(date.getMonth()+1).toString().padStart(2,'0')+'-'+date.getDate().toString().padStart(2,'0')+' '+date.getHours().toString().padStart(2,'0')+':'+date.getMinutes().toString().padStart(2,'0')+':'+date.getSeconds().toString().padStart(2,'0')
    date = null;return r
  },
  /**
  * date2str("YYYY-MM-DD hh:mm:ss.S",new Date) => 2019-08-02 下午 08:09:04.423 
  * date2str("YYYY-MM-DD EE HH:mm:ss") => 2019-08-10 周六 20:09:04       
  * @param f:其他格式 MM/DD/YYYY HH，MM/DD/YYYY @param date:Date
  */
  date2str(f:string="YYYY-MM-DD EEE hh:mm:ss",date:Date=new Date){
    let o = {"M+":date.getMonth()+1,"D+":date.getDate(),"h+":date.getHours()===12?12:date.getHours()%12,
    "H+":date.getHours(),"m+":date.getMinutes(),"s+":date.getSeconds(),"S":date.getMilliseconds()};
    if(/(Y+)/.test(f))f=f.replace(RegExp.$1,(date.getFullYear()+"").substr(4-RegExp.$1.length));
    if(/(E+)/.test(f))f=f.replace(RegExp.$1,(RegExp.$1.length>2?"\u661f\u671f":RegExp.$1.length>1?"\u5468":"")
      +week[date.getDay()]);
    if(/h+/.test(f))f=f.replace(/(?=h+)/,date.getHours()>12?"\u4E0B\u5348 ":"\u4E0A\u5348 ")
    for(let k in o)
      if(new RegExp("("+ k +")").test(f))
        f=f.replace(RegExp.$1,RegExp.$1.length===1?o[k]:("00"+o[k]).substr((""+o[k]).length));
    o=date=null;return f;
  },
  /**获取在某个日期距离过去到现在时间的表示
  * @param date:dateAgo(new Date(2021,0,19))
  */
  dateAgo(date:Date){
    let s = Math.round((Date.now() - date.getTime())/1000);date=null;
    return s<60?`${Math.round(s)}秒前`:(s/=60)&&s<60?`${Math.round(s)}分钟前`:
      (s/=60)&&s<24?`${Math.round(s)}小时前`:(s/=24)&&s<30?`${Math.round(s)}天前`:
      (s/=30)&&s<12?`${Math.round(s)}月前`:`${Math.round(s/12)}年前`
  }
}
