var url;

$(document).ready(function(){ 
 //定义双击事件 
 	var today = new Date();
	var callDate = new Date();
	callDate.setDate(callDate.getDate() - 30);
	$("#daystart").datebox("setValue",myformatter(callDate));
	$("#dayend").datebox("setValue",myformatter(today));
	findAcc();
}); 

function findAcc(){  
	$('#dg').datagrid('load',{  
			accName:$('#accName').combobox('getValue'),
			dayStart:$('#daystart').datebox("getValue"),
			dayEnd:$('#dayend').datebox("getValue")
		}  
	);  
}

//easyUI combobox中不要使用onChange来做读取数据库操作，有很多BUG，建议使用loader
var btsloader = function(param,success,error){

	//获取输入的值
	var q = param.q || "";

	//此处q的length代表输入多少个字符后开始查询
	if(q.length <= 0) return false;
	$.ajax({
		url:"/dfapi?api=101&page=1&rows=1500",
		type:"post",
		data:{
			//传值，还是JSON数据
			accName:q
		},

		//重要，如果写jsonp会报转换错误，此处不写都可以
		dataType:"json",
		success:function(data){
			//关键步骤，遍历一个MAP对象
			var items = $.map(data.rows, function(item){
				return {
					id:item.accName,
					name:item.accCommonName + ' ' + item.accName 
						+ ' ' + item.accIDNumber + ' ' + item.accType
				};
			});
			//执行loader的success方法
				success(items);
		},
			//异常处理
		error:function(xml, text, msg){
			error.apply(this, arguments);
		}
	});
};
