$.extend($.fn.validatebox.defaults.rules, {
	notnull:{
		validator:function(value,param){	
			var len = $.trim(value).length;
			if (len >= 1) {
				return true;
			} else {
				return false;
			}
		},
		message:'请输入内容.'
	},

	alpha:{
		validator:function(value,param){
			if (value){
				return /^[a-zA-Z\u00A1-\uFFFF]*$/.test($.trim(value));
			} else {
				return true;
			}
		},
		message:'只能输入字母.'
	},

	alphanum:{
		validator:function(value,param){
			if (value){
				return /^([a-zA-Z\u00A1-\uFFFF0-9])*$/.test($.trim(value));
			} else {
				return true;
			}
		},
		message:'只能输入字母和数字.'
	},

	positive_int:{
		validator:function(value,param){
			if (value){
				return /^[0-9]*[0-9][0-9]*$/.test($.trim(value));
			} else {
				return true;
			}
		},
		message:'只能输入整数.'
	},

	numeric:{
		validator:function(value,param){
			if (value){
				return /^[0-9]*(\.[0-9]+)?$/.test($.trim(value));
			} else {
				return true;
			}
		},
		message:'只能输入数字.'
	},

	date:{     
		validator: function(value){     
			if (value){
				return /^[0-9]{4}[-][0-9]{1,2}[-][0-9]{1,2}$/i.test($.trim(value));     
			} else {
				return true;
			}
		},
		message: '日期格式错误,请填写如2012-09-11.'    
	},

	extenddate:{
		validator: function(value){     
			if (value){
				var temp = value.replace(/\//ig, "-");
				return /^[0-9]{4}[-][0-9]{1,2}[-][0-9]{1,2}$/i.test($.trim(temp));     
			} else {
				return true;
			}
		},
		message: '日期格式错误,请填写如2012-9-11或2012/9/11.'    
	},

	chinese:{
		validator:function(value,param){
			if (value){
				return /[^\u4E00-\u9FA5]/g.test($.trim(value));
			} else {
				return true;
			}
		},
		message:'只能输入中文'
	}
});

function myformatter(date){
	var y = date.getFullYear();
	var m = date.getMonth()+1;
	var d = date.getDate();
	return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
};

function myparser(s){
	if (!s) return new Date();
	var ss = (s.split('-'));
	var y = parseInt(ss[0],10);
	var m = parseInt(ss[1],10);
	var d = parseInt(ss[2],10);
	if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
		return new Date(y,m-1,d);
	} else {
		return new Date();
	}
};
document.write("<script type=\"text/javascript\" src=\"/media/js/easyui-lang-zh_CN.js\"></script>");
