document.body.innerHTML+="<br/>Hello World!"
function NTo10(v,n){if(n>62||n<2)return;if(n<37)v=v.toLowerCase();
  var hexString="0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ",addNumber=0
  for(var i=0;i<v.length;i++){if(hexString.indexOf(v.charAt(i))===-1)return
    for(var h=0;h<hexString.length;h++){
      if(v.charAt(v.length-i-1)===hexString.charAt(h)){
        addNumber=addNumber+h*Math.pow(n,i);
      }
    }
  }
  return addNumber;
}