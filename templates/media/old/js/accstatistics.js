$(document).ready(function(){
	var curr_time = new Date();   
	$("#daystart").datebox("setValue",myformatter(curr_time));
	$("#dayend").datebox("setValue",myformatter(curr_time));
	findAcc();
});

function findAcc(){  
	if($("#daystart").datebox('isValid') && $("#dayend").datebox('isValid')) {
		$('#dg').datagrid('load',{  
				dayStart:$('#daystart').datebox("getValue"),
				dayEnd:$('#dayend').datebox("getValue")
			}  
		);  
	} else {
		errorMsg = "请填写有效数据！"
		$.messager.show({
			title: '提示',
			msg: errorMsg
		});
	}
}

function exportAcc(){  
	if($("#daystart").datebox('isValid') && $("#dayend").datebox('isValid')) {
		var dayStart = $('#daystart').datebox("getValue");
		var dayEnd = $('#dayend').datebox("getValue");
		window.open('/export/accfile?dayStart='+dayStart+'&dayEnd='+dayEnd);
	} else {
		errorMsg = "请填写有效数据！"
		$.messager.show({
			title: '提示',
			msg: errorMsg
		});
	}
	
}
