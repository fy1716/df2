var url;

$(document).ready(function(){
	//定义双击事件
	$('#dg').datagrid({
		onDblClickRow: function(index, field){
			editCarInfo();
		}
	});
});

function newCarInfo(){
	$('#fmid').textbox('readonly', false);
	$('#dlg').dialog('open').dialog('setTitle','新增车辆信息');
	$("#hideID").css("display", "none");
	$('#fm').form('clear');
	url = '/dfapi?api=202';
}

function editCarInfo(){
	var row = $('#dg').datagrid('getSelected');
	if (row){
		$('#dlg').dialog('open').dialog('setTitle','编辑车辆信息');
		$('#fm').form('load',row);
		$('#fmid').textbox('readonly', false);
		$("#hideID").css("display", "none");
		url = '/dfapi?api=203';
	} else {
		errorMsg = "请点击一条数据进行编辑！"
		$.messager.show({
			title: '提示',
			msg: errorMsg
		});
	}
}

function saveCarInfo(){
	$('#fm').form('submit',{
		url: url,
		method:'post',
		onSubmit: function(){
			return $(this).form('validate');
		},
		success: function(result){
			var result = eval('('+result+')');
			if (result.errorMsg){
				$.messager.show({
					title: '错误',
					msg: result.errorMsg
				});
			} else {
				$('#dlg').dialog('close');		// close the dialog
				$('#dg').datagrid('reload', result);	// reload the user data
			}
		}
	});
}

function destroyCarInfo(){
	var row = $('#dg').datagrid('getSelected');
	if (row){
		$.messager.confirm('Confirm','你确定要删除这条配件信息吗？',function(r){
			if (r){
				$.post('/dfapi?api=204',{id:row.id},function(result){
					if (result.success){
						$('#dg').datagrid('reload');	// reload the user data
					} else {
						$.messager.show({	// show error message
							title: '错误',
							msg: result.errorMsg
						});
					}
				},'json');
			}
		});
	}
}

function findCarInfo(){  
	$('#dg').datagrid('load',{  
			carIDNumber:$('#carIDNumber').val(),
			carNumber:$('#carNumber').val(),
			carOwner:$('#carOwner').val(),
			carTel:$('#carTel').val(),
			dayStart:$('#daystart').datebox("getValue"),
			dayEnd:$('#dayend').datebox("getValue")
		}  
	);  
}

function outCar(){
    window.open('/out/carfile');
}

//easyUI combobox中不要使用onChange来做读取数据库操作，有很多BUG，建议使用loader
var btsloader = function(param,success,error){

	//获取输入的值
	var q = param.q || "";

	//此处q的length代表输入多少个字符后开始查询
	if(q.length <= 0) return false;
	$.ajax({
		url:"/dfapi?api=101",
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
					name:item.accName + ' ' + item.accIDNumber
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
