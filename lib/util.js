/**
 * Created by yneos on 2017/2/6.
 */

var util = {
    /**
     * 将02属性浅拷贝到o1,且不拷贝为空的属性
     * @param o1
     * @param o2
     */
    copyIfExist: function (o1, o2) {
        if (!o1) o1 = {};
        if (!o2) return
        for (var key in o2) {
            //只有null,undefined不更新
            if (o2[key] || o2[key] === false || o2[key] === 0 || o2[key] === '') {
                o1[key] = o2[key];
            }
        }
    },
    /**
     * 合并两个字符串表达式，合并后使用“｜”分割
     * @param oldStr
     * @param newStr
     * @returns String
     */
    mergeString: function (oldStr, newStr) {
        if (typeof oldStr !== 'string' || typeof newStr !== 'string') {
            return oldStr;
        }
        if (!oldStr.trim()) return newStr;
        if (!newStr.trim()) return oldStr;

        function isInArray(str, list) {
            for (var i = 0; i < list.length; i++) {
                var s = list[i];
                if (str === s) return true;
            }
            return false;
        }

        var str = oldStr;
        var oldList = oldStr.split('|');
        var newList = newStr.split('|');
        if (newList.length > 0) {
            for (var i = 0; i < newList.length; i++) {
                var s = newList[i];
                if (!isInArray(s, oldList)) {
                    oldList.push(s);
                }
            }
            for (var i = 0; i < oldList.length; i++) {
                var s = oldList[i];
                if (i == 0) {
                    str = s;
                } else {
                    str += '|' + s
                }
            }
        }

        return str
    },
    /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * 例子：
     * new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
     * @param date
     * @param fmt
     * @returns String
     */
    dateFormat: function (date, fmt) {
        if (!fmt) fmt = "yyyy-MM-dd hh:mm:ss.S";
        var o = {
            "M+": date.getMonth() + 1,                 //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },

    /**
     *将时间戳差值转换为用时几天几小时几分钟几秒
     * @param dateTimeStampDiff
     * @returns {string}
     */
    dateDiff: function (dateTimeStampDiff) {
        var days = Math.floor(dateTimeStampDiff / (24 * 3600 * 1000));
        //计算出小时数
        var leave1 = dateTimeStampDiff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));
        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000));
        //计算相差秒数
        var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000);
        var result = days + "天 " + hours + "小时 " + minutes + "分钟 " + seconds + "秒";
        return result;
    },

    /**
     * 时间戳转换为几个月前，几周前，几天前，几分钟前的形式
     * @param dateTimeStamp
     * @returns {string}
     */
    dateEarly: function getDateDiff(dateTimeStamp) {
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var month = day * 30;
        var now = new Date().getTime();
        var diffValue = now - dateTimeStamp;
        if (diffValue < 0) {
            return;
        }
        var monthC = diffValue / month;
        var weekC = diffValue / (7 * day);
        var dayC = diffValue / day;
        var hourC = diffValue / hour;
        var minC = diffValue / minute;
        var result = "";
        if (monthC >= 1) {
            result = "" + parseInt(monthC) + "月前";
        }
        else if (weekC >= 1) {
            result = "" + parseInt(weekC) + "周前";
        }
        else if (dayC >= 1) {
            result = "" + parseInt(dayC) + "天前";
        }
        else if (hourC >= 1) {
            result = "" + parseInt(hourC) + "小时前";
        }
        else if (minC >= 1) {
            result = "" + parseInt(minC) + "分钟前";
        } else
            result = "刚刚";
        return result;
    },
    empetyFunction(){
    }
}

module.exports = util;