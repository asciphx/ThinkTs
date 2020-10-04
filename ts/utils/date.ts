const week = {"0" : "\u65e5","1" : "\u4e00","2" : "\u4e8c",
"3" : "\u4e09","4" : "\u56db","5" : "\u4e94","6" : "\u516d"};
export default {
    //time:new Date().getTime(),简易的获取时间
    formateDate(time:number){
        if(!time) return '';
        let date = new Date(time)
        return date.getFullYear() + '-' + (date.getMonth()+1).toString().padStart(2,'0')+'-'+date.getDate().toString().padStart(2,'0')+'  '+date.getHours().toString().padStart(2,'0')+':'+date.getMinutes().toString().padStart(2,'0')+':'+date.getSeconds().toString().padStart(2,'0') 
    },
    /* new Date().pattern("yyyy-MM-dd hh:mm:ss.S") => 2019-08-02 08:09:04.423 
    * new Date().pattern("yyyy-MM-dd EE hh:mm:ss") => 2019-08-10 周六 08:09:04       
    * new Date().pattern("yyyy-MM-dd EEE hh:mm:ss") => 2019-08-10 星期六 08:09:04       
    * 其他格式 MM/dd/yyyy HH  MM/dd/yyyy */
    date2str(date:Date,fmt:string){
      let o = {"M+" : date.getMonth()+1,"d+" : date.getDate(),
      "h+" : date.getHours()%12 === 0 ? 12 : date.getHours()%12,
      "H+" : date.getHours(),"m+" : date.getMinutes(),
      "s+" : date.getSeconds(),"q+" : Math.floor((date.getMonth()+3)/3),
      "S" : date.getMilliseconds()};
      if(/(y+)/.test(fmt)){fmt=fmt.replace(RegExp.$1,(date.getFullYear()+"").substr(4 - RegExp.$1.length));}
      if(/(E+)/.test(fmt)){fmt=fmt.replace(RegExp.$1,(RegExp.$1.length>1 ?
        (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")
        +unescape(week[date.getDay()+""]));}
      for(let k in o){
        if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ?
          o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
      }return fmt;
    }
}
