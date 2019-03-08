angular.module('app.controllers')
	.controller('financeCtrl', ['$scope', '$rootScope', '$http', '$filter', '$modal', function($scope, $rootScope, $http, $filter, $modal) {
        //清空选中item状态
        $scope.clearSelectedItem = function() {
            $scope.financeActiveItem = {};   //清空被选中item
            $scope.currentActiveStatus = false;   //未激活状态
            $scope.currentActiveIndex = null;    //清空被选中item索引
        };
		//获取收支数据
		$scope.queryFinanceList = function() {
            $scope.clearSelectedItem();
		    $http.get('/dfapi', {
				params: {
					"api": 511,
					"page": $scope.page,
					"rows": $scope.rows,
					"dayStart": $scope.dayStart,
					"dayEnd": $scope.dayEnd
				}
			})
			.success(function(response) { 
                $scope.In = response.In;
                $scope.Out = response.Out;
                $scope.InOut = response.InOut;
				$scope.financeList = $filter('fillArray')(response.rows, $scope.rows);
				$scope.totalItems = response.total;
				if (response.rows.length === 0 && $scope.page !== 1) {
					$scope.page = $scope.page - 1;
					$scope.queryFinanceList();
				}
			});	
		};
        //查询
        $scope.searchFinance = function() {
            $scope.page = 1;
            $scope.queryFinanceList();
        };
        //回车查询
        $scope.keydown = function ($event) {
            if ($event.keyCode === 13) {
                $scope.searchFinance();
            }
        };
        //点击item操作
        $scope.toggleActive = function(index) {
            //点击已选中item
            if ($scope.currentActiveIndex === index) {
                $scope.currentActiveIndex = null;
                $scope.currentActiveStatus = !$scope.currentActiveStatus;
                $scope.financeList[index].active = !$scope.financeList[index].active;
                $scope.financeActiveItem = {};
                return null;
            }
            //已有选中item，点击未选中item
            if (typeof $scope.currentActiveIndex === 'number') {
                $scope.financeList[$scope.currentActiveIndex].active = false;
            }
			if (!$scope.financeList[index].id) {
				$scope.currentActiveIndex = null;
                $scope.currentActiveStatus = false;
				$scope.financeActiveItem = {};
                return false;
            }
            $scope.currentActiveStatus = true;
            $scope.currentActiveIndex = index;
            $scope.financeList[index].active = true;
            $scope.financeActiveItem = $scope.financeList[index];
        };
		//分页
		$scope.pagination = function(page) {
            $scope.page = page;
			$scope.queryFinanceList();
		};
		/******************************************** 新增、编辑操作 ******************************************/
        //禁止编辑操作
        $scope.forbiddenEdit = function() {
            $scope.tipColor = "#C2820E";
            $scope.delMessage = "这条数据是维修记录，请在车辆维修页面中进行修改！";
            $scope.showRetTips();
        };
		//打开操作页面
		$scope.openOpPage = function () {
			$scope.items = {
                'type': $scope.opType,
				'title': $scope.opTitle,
                'financeItem': $scope.financeActiveItem
			};
		    var modalInstance = $modal.open({
                //size: size,
                backdrop: 'static',
				templateUrl: 'financeOperation.html',
				controller: 'financeOpCtrl',
				resolve: {
					items: function () {
						return $scope.items;
					}
				}
			});
		    modalInstance.result.then(function (selectedItem) {
                if ($scope.opType === "add") {
                    $scope.page = 1;
                }
				$scope.queryFinanceList();
		    }, function () {
				console.log('cancel finance operation');
		    });
		};
		//初始化新增页数据
		$scope.initAddfinance = function () {
            $scope.opType = "add";
			$scope.opTitle = "新增财务记录";
		};
		//新增操作
		$scope.addFinance = function () {
			$scope.initAddfinance();
			$scope.openOpPage();
		};
		//初始化编辑页数据
		$scope.initEditfinance = function () {
            $scope.opType = "edit";
			$scope.opTitle = "编辑车辆信息";
		};
		//编辑操作
		$scope.editFinance = function () {
			$scope.initEditfinance();
            if ($scope.financeActiveItem.id === 0) {
                $scope.forbiddenEdit();
            } else {
                $scope.openOpPage();
            }
		};
        //删除结果处理
        $scope.showRetTips = function() {
            $.smallBox({
				title : "操作结果",
				content : $scope.delMessage + "<p class='text-align-right'><a href='javascript:void(0);' class='btn btn-primary btn-sm'>确定</a></p>",
				color : $scope.tipColor,
				timeout: 2000,
				icon : "fa fa-bell swing animated"
			});
        };
        //确认删除
		$scope.delFinanceConfirm = function() {
            $http.post('/dfapi?api=514', {
                id: $scope.financeActiveItem.id
            })
            .success(function(response) {
                $scope.delMessage = response.Message;
                if (response.Result === 'success') {
                    $scope.tipColor = "#739E73";
                } else {
                    $scope.tipColor = "#C46A69";
                }
                $scope.showRetTips();
				$scope.queryFinanceList();
            })
			.error(function(response) {
                $scope.tipColor = "#C46A69";
                $scope.delMessage = "服务器无响应，请稍后重试！";
                $scope.showRetTips();
            });			
		};
		//删除操作
		$scope.delFinance = function() {
            if ($scope.financeActiveItem.id === 0) {
                $scope.forbiddenEdit();
                return null;
            }
			if(confirm("确定要删除该条收支信息吗？")) {
				$scope.delFinanceConfirm();
			}
		};
		//导出操作
		$scope.printFinance = function() {
			window.open('/printBalance?dayStart=' + $scope.dayStart + '&dayEnd=' + $scope.dayEnd);
		};
        /******************************************** 初始化操作 ******************************************/
        //初始化
		$scope.init = function() {
			$scope.page = 1;
			$scope.rows = 6;
            $scope.totalItems = 0;
            $scope.dayStart = new Date().Format("yyyy-MM-dd");
            $scope.dayEnd = new Date().Format("yyyy-MM-dd");
			$scope.queryFinanceList();
		};
		$scope.init();
	}])
	.controller('financeOpCtrl', ['$scope', '$modalInstance', '$http', '$timeout', 'items', function($scope, $modalInstance, $http, $timeout, items) {
        //新增finance
		$scope.opfinanceItem = function (urlNo, financeId) {
            $http.post('/dfapi?api=' + urlNo, {
                id: financeId,
                balanceDate: $scope.financeItem.balanceDate,
                balanceInOut: Number($scope.financeItem.balanceInOut),
                balanceAmount: $scope.financeItem.balanceAmount,
                balanceRemark: $scope.financeItem.balanceRemark
            })
            .success(function(response) {
                if (response.total === 1) {
                    $scope.Message = "操作成功";
                    $timeout(function() {
                        $modalInstance.close();
                    }, 500);
                } else {
                    $scope.Message = response.errorMsg;
                }
            }).error(function(response) {
                $scope.Message = "服务器无响应，请稍后重试！";
            });
            
		};		
        //提交表单
		$scope.submitForm = function (retValid) {
            $scope.dirtyFlag = true;
            if (!retValid) {
                $scope.Message = "请确认输入格式正确！";
                return null;
            }
            if (items.type === 'add') {
                $scope.opfinanceItem(512, 0);
            }
            if (items.type === 'edit') {
                $scope.opfinanceItem(513, items.financeItem.id);
            }
		};
        //取消表单
		$scope.cancelForm = function () {
		    $modalInstance.dismiss('cancel');
		};
        //清空输入框
        $scope.clearInput = function() {
            $scope.financeItem = {};
            $scope.financeItem.balanceInOut = 1;
            $scope.financeItem.balanceDate = new Date().Format("yyyy-MM-dd");
        };
        //初始化输入框
        $scope.initInput = function() {
            var finance = items.financeItem;
            $scope.financeItem = {};
            $scope.financeItem.balanceDate = finance.balanceDate;
            $scope.financeItem.balanceInOut = finance.balanceInOut;
            $scope.financeItem.balanceAmount = finance.balanceAmount;
            $scope.financeItem.balanceRemark = finance.balanceRemark;
        };
        /******************************************** 初始化操作 ******************************************/
        //初始化        
        $scope.init = function() {
            $scope.items = items;
            $scope.dirtyFlag = false;
            $scope.Message = "";
            if (items.type === 'edit') {
                $scope.initInput();
            } else {
                $scope.clearInput();
            }
        };
        $scope.init();
	}]);
