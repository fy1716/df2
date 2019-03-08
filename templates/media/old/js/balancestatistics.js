var url;

function compute() {
	var rows = $('#dg').datagrid('getRows')//获取当前的数据行
		var total = 0;//统计价格
	for (var i = 0; i < rows.length; i++) {
		total += rows[i]['balanceAmount'] * rows[i]['balanceInOut'];
	}
	//新增一行显示统计信息
	$('#dg').datagrid('appendRow', { balanceDate: '<b>统计：</b>', balanceAmount: '<b>' + total + '<b>'});
}

$(document).ready(function(){
	var curr_time = new Date();
	$("#daystart").datebox("setValue",myformatter(curr_time));
	$("#dayend").datebox("setValue",myformatter(curr_time));
	findBalance();
	//定义双击事件
	$('#dg').datagrid({
		onDblClickRow: function(index, field){
			editBalance();
		}
	});
	$('#dg').datagrid({
		onLoadSuccess:compute
	});
});

function showImgBalance(val,row){
	var img;
	if (val == 1) {
		img = "/media/images/up.png";
		return '<img src='+img+'/>';
	} else if (val == -1){
		img = "/media/images/blue.png";
		return '<img src='+img+'/>';
	}
}
function findBalance(){  
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

function newBalance(){
	$('#dlg').dialog('open').dialog('setTitle','新增财务信息');
	$('#fm').form('clear');
	var curr_time = new Date();
	$("#date").datebox("setValue",myformatter(curr_time));
	$("#hideID").css("display", "none");
	url = '/dfapi?api=512';
	//初始化支出值
	document.getElementById("out").checked=false
}

function editBalance(){
	var row = $('#dg').datagrid('getSelected');
	if (row){
		if (row.id == 0) {
			errorMsg = "这条数据是维修记录，请在车辆维修页面中进行修改"
			$.messager.show({
				title: '提示',
				msg: errorMsg
			});
		} else {
			$('#dlg').dialog('open').dialog('setTitle','编辑财务信息');
			$('#fm').form('load',row);
			url = '/dfapi?api=513';
			$("#hideID").css("display", "none");
			if (row.balanceInOut == -1) {
				document.getElementById("out").checked=true
			} else {
				document.getElementById("out").checked=false
			};
		}
	} else {
		errorMsg = "请点击一条数据进行编辑！"
		$.messager.show({
			title: '提示',
			msg: errorMsg
		});
	}
}

function saveBalance(){
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
		//		$('#dg').datagrid('reload', result);	// reload the user data
				findBalance();
			}
		}
	});
}

function destroyBalance(){
	var row = $('#dg').datagrid('getSelected');
	if (row){
		if (row.id == 0) {
			errorMsg = "这条数据是维修记录，请在车辆维修页面中进行修改"
			$.messager.show({
				title: '提示',
				msg: errorMsg
			});
		} else {
			$.messager.confirm('Confirm','你确定要删除这条收支信息吗？',function(r){
				if (r){
					$.post('/dfapi?api=514',{id:row.id},function(result){
						if (result.success){
	//						$('#dg').datagrid('reload');	// reload the user data
							findBalance();
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
	} else {
		errorMsg = "请点击一条数据进行删除！"
		$.messager.show({
			title: '提示',
			msg: errorMsg
		});
	} 
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
