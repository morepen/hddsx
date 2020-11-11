const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 时间戳转化为年 月 日 时 分 秒
 * ts: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
function formatTime(timestamp, format) {

  const formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  let returnArr = [];

  let date = new Date(timestamp);
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  returnArr.push(year, month, day, hour, minute, second);

  returnArr = returnArr.map(formatNumber);

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
function onetime(){
        var date=new Date();
        var year=date.getFullYear(); 
        var mon=date.getMonth()+1;
        var day=date.getDate();
        var h=date.getHours(); 
        var m=date.getMinutes();
        var s=date.getSeconds(); 
        var submitTime = "";
        submitTime += year;
        if(mon >= 10) {
          submitTime += mon;
        }else {
          submitTime += "0" + mon;
        }
        if(day >= 10) {
          submitTime += day;
        }else {
          submitTime += "0" + day;
        }
        if(h >= 10) {
          submitTime += h;
        }else {
          submitTime += "0" + h;
        }
        if(m >= 10) {
          submitTime += m;
        }else {
          submitTime += "0" + m;
        }
        if(s >= 10) {
          submitTime += s;
        }else {
          submitTime += "0" + s;
        }
        return submitTime;
}
module.exports = {
  　　formatTime: formatTime,
      onetime:onetime
}