var url;
var url_acc;
$(document).ready(function(){
	$("#hideID" ).css("display", "none");
	//定义双击事件
	$('#dg_car').datagrid({
		onDblClickRow: function(index, field){ 
			editCarFixInfo();
		}
	});
	$('#detailFixMan').combobox({ 
		panelHeight:'auto'	 
	}); 
	$('#detailCard').combobox({ 
		panelHeight:'auto'	 
	}); 
});

function showImgLogging(val,row){ 
	var img; 
	if (val == 1) { 
		img = "/media/images/up.png";	 
		return '<img src='+img+'/>'; 
	} else if (val == 0){ 
		img = "/media/images/down.png";	 
		return '<img src='+img+'/>'; 
	} 
} 
 
function showImgGuaranty(val,row){ 
	var img; 
	if (val == 1) { 
		img = "/media/images/yes.png";	 
		return '<img src='+img+'/>'; 
	} else if (val == 0){ 
		img = "/media/images/no.png";	 
		return '<img src='+img+'/>'; 
	} 
} 

function findCarFixInfo(){  
	$('#dg_car').datagrid('load',{  
			carIDNumber:$('#carIDNumber').val(),
			carNumber:$('#carNumber').val(),
			carOwner:$('#carOwner').val(),
			dayStart:$('#daystart').datebox("getValue"),
			dayEnd:$('#dayend').datebox("getValue"),
			search: true
		}  
	);  
}

function detailClear(){
	$('#detailFixODO').textbox('clear');
	$('#detailFixMan').textbox('clear');
	$('#detailFixIncome').textbox('clear');
	$('#detailFixFavorable').textbox('clear');
	$('#detailFixRemark').textbox('clear');
	$('#detailIDNumber').textbox('clear');
	$('#detailNumber').textbox('clear');
	$('#detailType').textbox('clear');
	$('#detailBuyDate').textbox('clear');
	$('#detailProDate').textbox('clear');
	$('#detailCard').textbox('clear');
	$('#detailOwner').textbox('clear');
	$('#detailTel').textbox('clear');
	$('#detailRemark').textbox('clear');
	$('#carFixID').textbox('setValue', '-1');
}

function compute() {
	var rows = $('#dg_acc').datagrid('getRows')//获取当前的数据行
	var total = 0;//统计价格
	for (var i = 0; i < rows.length; i++) {
		if (rows[i].carAccGuarantee != 1) {
			total += rows[i]['carAccPrice'] * rows[i]['carAccUsage'];
		}
	}
	//新增一行显示统计信息
	$('#dg_acc').datagrid('appendRow', { carAccName: '<b>维修金额：</b>', carAccUsage: '<b>' + total + '<b>'});
}

function newCarFixInfo(){

	url = '/dfapi?api=213';
	$('#car_accordion').accordion('select',1);

	carIDNumber = $('#carIDNumber').val();
	carNumber = $('#carNumber').val();
	carOwner = $('#carOwner').val();
	$('#detailIDNumber').textbox('readonly', false);
	$("#hideID" ).css("display", "none");

	//定义双击事件
	$('#dg_acc').datagrid({
		onDblClickRow: function(index, field){ 
			fixEditAcc();
		}
	});

	//查看是否车辆信息已存在 同时删除配件未生效信息
	$.post('/dfapi?api=212',{carIDNumber:carIDNumber,carNumber:carNumber,carOwner:carOwner},function(result){
		if (result.errorMsg){
			$.messager.show({
				title: '错误',
				msg: result.errorMsg
			});
		} else {
			if (result.carinfo){
//				detailClear();
				$('#fm_fix_detail').form('clear');
				$('#fm_fix_detail').form('load',result.carinfo);
				$('#detailIDNumber').textbox('readonly', true);
			} else {
//				detailClear();
				$('#fm_fix_detail').form('clear');
				$('#detailCard').combobox('setValue', '未知');
			}
			$('#carFixID').textbox('setValue', '-1');  //新增时carFixID=-1
			var curr_time = new Date();
			$("#detailFixDate").datebox("setValue",myformatter(curr_time));

			$('#dg_acc').datagrid('load',{  
					carFixID:$('#carFixID').val()
				}  
			);

			$('#accName').combobox('clear');
		}
	},'json');
	$('#dg_acc').datagrid({
		onLoadSuccess:compute
	});
}

function editCarFixInfo(){
	var row = $('#dg_car').datagrid('getSelected');
	$('#accName').combobox('clear');
	if (row){
		$('#car_accordion').accordion('select',1);
		$('#fm_fix_detail').form('load',row);
		$('#detailIDNumber').textbox('readonly', true);
		$("#hideID" ).css("display", "none");
		url = '/dfapi?api=214';

		$('#dg_acc').datagrid('load',{
			carFixID: row.id
			}
		);
		//定义双击事件
		$('#dg_acc').datagrid({
			onDblClickRow: function(index, field){
				fixEditAcc();
			}
		});
	} else {
		errorMsg = "请点击一条数据进行编辑！"
		$.messager.show({
			title: '提示',
			msg: errorMsg
		});
	};
	$('#dg_acc').datagrid({
		onLoadSuccess:compute
	});
}

function saveCarFixInfo(){
	$('#fm_fix_detail').form('submit',{
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
				$('#dg_car').datagrid('reload');	// reload the user data
				$('#car_accordion').accordion('select',0);
			}
		}
	});
}

function destroyCarFixInfo(){
	var row = $('#dg_car').datagrid('getSelected');
	if (row){
		$.messager.confirm('Confirm','你确定要删除这条维修记录吗？',function(r){
			if (r){
				$.post('/dfapi?api=215',{id:row.id},function(result){
					if (result.success){
						$('#dg_car').datagrid('reload');	// reload the user data
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

//-------------------------------------------------配件操作---------------------------------------------

function fixAddAcc(){
	var carAccIDNumber = $('#accName').combobox('getValue');
	var carFixID = $('#carFixID').val();
	$.post('/dfapi?api=302',{carAccIDNumber:carAccIDNumber,carFixID:carFixID},function(result){
		if (result.errorMsg){
			$.messager.show({
				title: '错误',
				msg: result.errorMsg
			});
		} else {
			if (result.maintainFlag) {
				$('#detailFixMaintain').textbox('setValue', '1');
			}
			$('#dg_acc').datagrid('load',{  
					carFixID:$('#carFixID').val()
				}  
			);
			$('#accName').combobox('clear');
//			$('#dg_acc').datagrid('reload', result);
		}
	},'json');
}

function fixEditAcc(){
	var row = $('#dg_acc').datagrid('getSelected');
	if (row){
		$('#dlg').dialog('open').dialog('setTitle','编辑配件');
		$('#fm').form('load',row);
		$('#fmid').textbox('readonly', true);
		$("#hideaccID" ).css("display", "none");
//		$('#fmidnumber').textbox('readonly', true);
		url_acc = '/dfapi?api=303&oldAccID='+row.carAccIDNumber;
		if (row.carAccGuarantee == 1) {
			document.getElementById("guarantee").checked=true
		} else {
			document.getElementById("guarantee").checked=false
		};
	} else {
		errorMsg = "请点击一条数据进行编辑！"
			$.messager.show({
			title: '提示',
			msg: errorMsg
		});
	}
}

function fixSaveAcc(){
	$('#fm').form('submit',{
		url: url_acc,
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
				$('#dlg').dialog('close');      // close the dialog
				$('#dg_acc').datagrid('load',{  
						carFixID:$('#carFixID').val()
					}  
				);
			}
		}
	});
}

function fixDestroyAcc(){
    var row = $('#dg_acc').datagrid('getSelected');
	if (row){
		$.messager.confirm('Confirm','你确定要删除这条维修信息吗？',function(r){
			if (r){
				$.post('/dfapi?api=304',{carFixID:row.carFixID, 
					carAccIDNumber:row.carAccIDNumber},function(result){
					if (result.success){
						if (result.maintainFlag) {
							$('#detailFixMaintain').textbox('setValue', '0');
						}
						$('#dg_acc').datagrid('load',{  
								carFixID:$('#carFixID').val()
							}  
						);
					} else {
						$.messager.show({   // show error message
							title: '错误',
							msg: result.errorMsg
						});
					}
				},'json');
			}
		});
	}
}

function outCarFix(){
    window.open('/out/carfixfile?search=1');
}

function printCarFix(){

	var rows = $("#dg_acc").datagrid("getRows"); 
	var listName = new Array();
	var listUsage = new Array();
	var listPrice = new Array();
	var listGuarantee = new Array();
	var listAccID = new Array();
	n = rows.length-1

	for(var i=0;i<n;i++){ //最后一行为统计数据
		listName[i] = rows[i].carAccName;
		listUsage[i] = rows[i].carAccUsage;
		listPrice[i] = rows[i].carAccPrice;
		listAccID[i] = rows[i].carAccIDNumber;
		listGuarantee[i] = rows[i].carAccGuarantee;
	};

	var carFixSum = rows[n].carAccUsage;
	var SumTip = rows[n].carAccName;
	var	carNumber = $('#detailNumber').textbox('getValue');
	var	carIDNumber = $('#detailIDNumber').textbox('getValue');
	var	carType = $('#detailType').textbox('getValue');
	var	carOwner = $('#detailOwner').textbox('getValue');
	var	carBuyDate = $('#detailBuyDate').textbox('getValue');
	var	carFixODO = $('#detailFixODO').textbox('getValue');
	var	carFixMan = $('#detailFixMan').combobox('getValue');
	var carFixInfo = $('#carFixID').textbox('getValue');
	var	carFixRemark = $('#detailFixRemark').textbox('getValue');
	var	carFixFavorable = $('#detailFixFavorable').textbox('getValue');

	window.open('/sum?arg0='+listPrice+'&arg1='+listName+'&arg2='+listPrice+'&arg3='+listUsage+'&arg4='+carFixRemark+'&arg5='+carIDNumber+'&arg6='+carFixMan+'&arg7='+carFixODO+'&arg8='+carFixFavorable +'&arg9='+listGuarantee+'&arg10='+carFixInfo+'&arg11='+listAccID+'&arg12='+carOwner+'&arg13='+carNumber+'&arg14='+carType+'&arg15='+carBuyDate);
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
					id:item.accIDNumber,
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
