var url; 
$(document).ready(function(){ 
	//定义双击事件 
	var startDate = new Date();
	startDate.setDate(startDate.getDate() - 730);

	var endDate = new Date();
	endDate.setDate(endDate.getDate() - 700);

	$("#daystart").datebox("setValue",myformatter(startDate));
	$("#dayend").datebox("setValue",myformatter(endDate));
	findMaintain();
	
	$('#dg').datagrid({ 
		onDblClickRow: function(index, field){ 
			editMaintain(); 
		} 
	}); 
}); 
 
function findMaintain(){   
	if($("#daystart").datebox('isValid') && $("#dayend").datebox('isValid')) { 
		$('#dg').datagrid('load',{ 
				maintainFlag:false,
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

function editMaintain(){ 
	var row = $('#dg').datagrid('getSelected'); 
	if (row){ 
		$('#dlg').dialog('open').dialog('setTitle','编辑回访记录'); 
		$('#fm').form('load',row); 
		$("#hideID").css("display", "none"); 
		url = '/dfapi?api=603'; 
	} else { 
		errorMsg = "请点击一条数据进行编辑！" 
		$.messager.show({ 
			title: '提示', 
			msg: errorMsg 
		}); 
	} 
} 

function saveMaintain(){ 
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
				findMaintain(); 
			} 
		} 
	}); 
} 

