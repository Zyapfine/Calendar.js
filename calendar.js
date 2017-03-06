/**
 * 签到日历
 * @param int year  年份
 * @param int month 月份
 */
var Calendar = function(year, month) {
    this._dofy = 366;
    this.year = year;
    this.month = month;
    /**
     * 获取指定月份的天数
     * @return int 返回指定月份天数
     */
    Calendar.prototype.getDateofMonth = function() {
        m = this.month - 1;
        for (var i = 1; i <= this._dofy; i++) {
            var date = new Date(this.year, m, i);
            var d2 = new Date(this.year, m, i+1);
            var x = d2.getDate();
            if (x == 1) {
                dofm = i;
                break;
            }
        }
        return dofm;
    };

    /**
     * 创建日历
     * @param  Array signList 签到日期数组
     * @return object       返回日历的 HTML 及当前年份月份
     */
    Calendar.prototype.createCalendar = function(signList = new Array()) {
        var day = this.getDateofMonth(this.year, this.month);
        var d = new Date(this.year, this.month - 1, 1);
        var dfw = d.getDay();
        arr = new Array();
        var tem = 0;
        for (var i = 1; i <= 6; i++) {
            arr[i] = new Array();
            for (var j = 0; j <= 6; j++) {
                tem++;
                arr[i][j] = new Array();
                if (signList.length > 0 && signList.constructor == Array) {
                    for (var k = 0; k < signList.length; k++) {
                        if (tem - dfw > 0 && tem - dfw <= day) {
                            if (signList.indexOf((tem - dfw)) > -1) {
                                arr[i][j]['d'] = tem - dfw;
                                arr[i][j]['signed'] = true;
                            } else {
                                arr[i][j]['d'] = tem - dfw;
                                arr[i][j]['signed'] = false;
                            }
                        } else {
                            arr[i][j]['d'] = '';
                            arr[i][j]['signed'] = '';
                        }
                    }
                } else {
                    if (tem - dfw > 0 && tem - dfw <= day) {
                        arr[i][j]['d'] = tem - dfw;
                        arr[i][j]['signed'] = false;
                    } else {
                        arr[i][j]['d'] = '';
                        arr[i][j]['signed'] = '';
                    }
                }
            }
        }
        var str = '';
        for (var i = 1; i < arr.length; i++) {
            if (arr[i][0]['d'] == '' && i > 1) {
                break;
            }
            str += "<ul>";
            for (var j = 0; j < arr[i].length; j++) {
                if (arr[i][j]['signed']) {
                    if (j == 0 || j == 6) {
                        str += "<li class='sign_already weekend'>"+arr[i][j]['d']+"</li>";
                    } else {
                        str += "<li class='sign_already'>"+arr[i][j]['d']+"</li>";
                    }
                } else {
                    if (j == 0 || j == 6) {
                        str += "<li class='weekend'>"+arr[i][j]['d']+"</li>";
                    } else {
                        str += "<li>"+arr[i][j]['d']+"</li>";
                    }
                }
            }
            str += "</ul>";
        }
        if (this.month == 0) {
            cmonth = 12;
            cyear = parseInt(this.year) - 1;
        } else if (this.month == 13) {
            cmonth = 1;
            cyear = parseInt(this.year) + 1;
        } else {
            cmonth = this.month;
            cyear = this.year;
        }
        var result = {calendar:str, year:cyear, month:cmonth};
        return result;
    };
    /**
     * 获取签到日期
     * @param  String link   Ajax 后端 URL
     * @return Array       已签到日期
     */
    Calendar.prototype.getSignDay = function(link) {
        var result = '';
        $.ajax({
            url : link,
            data : {
                year : this.year,
                month : this.month,
            },
            async : false,
            dataType : 'json',
            success : function(msg) {
                result = msg;
            },
            fail : function() {
                result = '';
            }
        });
        return result;
    };
}
