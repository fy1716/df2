angular.module('app.controllers')
	.controller('userManageCtrl', ['$scope', '$rootScope', '$http', '$filter', '$modal', function($scope, $rootScope, $http, $filter, $modal) {
        //清空选中item状态
        $scope.clearSelectedItem = function() {
            $scope.userActiveItem = {};   //清空被选中item
            $scope.currentActiveStatus = false;   //未激活状态
            $scope.currentActiveIndex = null;    //清空被选中item索引
        };
		//获取配件列表
		$scope.queryUserList = function() {
            $scope.clearSelectedItem();
		    $http.get('/dfapi', {
				params: {
					"api": '003',
					"page": $scope.page,
					"rows": $scope.rows
				}
			})
			.success(function(response) { 
				$scope.userList = $filter('fillArray')(response.rows, $scope.rows);
				$scope.totalItems = response.total;
				if (response.rows.length === 0 && $scope.page !== 1) {
					$scope.page = $scope.page - 1;
					$scope.queryUserList();
				}
			});	
		};
        //查询
        $scope.searchUser = function() {
            $scope.page = 1;
            $scope.queryUserList();
        };
        //点击item操作
        $scope.toggleActive = function(index) {
            //点击已选中item
            if ($scope.currentActiveIndex === index) {
                $scope.currentActiveIndex = null;
                $scope.currentActiveStatus = !$scope.currentActiveStatus;
                $scope.userList[index].active = !$scope.userList[index].active;
                $scope.userActiveItem = {};
                return null;
            }
            //已有选中item，点击未选中item
            if (typeof $scope.currentActiveIndex === 'number') {
                $scope.userList[$scope.currentActiveIndex].active = false;
            }
			if (!$scope.userList[index].id) {
				$scope.currentActiveIndex = null;
                $scope.currentActiveStatus = false;
				$scope.userActiveItem = {};
                return false;
            }
            $scope.currentActiveStatus = true;
            $scope.currentActiveIndex = index;
            $scope.userList[index].active = true;
            $scope.userActiveItem = $scope.userList[index];
        };
		//分页
		$scope.pagination = function(page) {
            $scope.page = page;
			$scope.queryUserList();
		};
		/******************************************** 新增、编辑操作 ******************************************/
		//打开操作页面
		$scope.open = function () {
			$scope.items = {
                'type': $scope.opType,
				'title': $scope.opTitle,
                'userItem': $scope.userActiveItem
			};
		    var modalInstance = $modal.open({
                //size: size,
                backdrop: 'static',
				templateUrl: 'userOperation.html',
				controller: 'userOpCtrl',
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
				$scope.queryUserList();
		    }, function () {
				console.log('cancel user operation');
		    });
		};
		//初始化新增页数据
		$scope.initAddUser = function () {
            $scope.opType = "add";
			$scope.opTitle = "新增用户";
		};
		//新增操作
		$scope.addUser = function () {
			$scope.initAddUser();
			$scope.open();
		};
		//初始化编辑页数据
		$scope.initEditUser = function () {
            $scope.opType = "edit";
			$scope.opTitle = "编辑用户";
		};
		//编辑操作
		$scope.editUser = function () {
			$scope.initEditUser();
			$scope.open();
		};
        //删除结果处理
        $scope.dealDelRet = function() {
            $.smallBox({
				title : "删除结果",
				content : $scope.delMessage + "<p class='text-align-right'><a href='javascript:void(0);' class='btn btn-primary btn-sm'>确定</a></p>",
				color : $scope.tipColor,
				timeout: 5000,
				icon : "fa fa-bell swing animated"
			});
        };
        //确认删除
		$scope.delUserConfirm = function() {
            $http.post('/dfapi?api=006', {
                id: $scope.userActiveItem.id
            })
            .success(function(response) {
                $scope.delMessage = response.Message;
                if (response.Result === 'success') {
                    $scope.tipColor = "#739E73";
                } else {
                    $scope.tipColor = "#C46A69";
                }
                $scope.dealDelRet();                
				$scope.queryUserList();
            })
			.error(function(response) {
                $scope.tipColor = "#C46A69";
                $scope.delMessage = "服务器无响应，请稍后重试！";
                $scope.dealDelRet();
            });			
		};
		//删除操作
		$scope.delUser = function(flag) {
			if (Number($scope.userActiveItem.role) === 1 && !flag) {
				alert("禁止删除管理员");
				return null;
			}
			if(confirm("确定要删除该条用户信息吗？")) {
				$scope.delUserConfirm();
			}
		};
        //启用、禁用
		$scope.switchUser = function() {
            $http.post('/dfapi?api=007', {
                id: $scope.userActiveItem.id,
		disable: 1 - Number($scope.userActiveItem.disable)
            })
            .success(function(response) {
                $scope.delMessage = response.Message;
                if (response.Result === 'success') {
                    $scope.tipColor = "#739E73";
                } else {
                    $scope.tipColor = "#C46A69";
                }
                $scope.dealDelRet();                
				$scope.queryUserList();
            })
			.error(function(response) {
                $scope.tipColor = "#C46A69";
                $scope.delMessage = "服务器无响应，请稍后重试！";
                $scope.dealDelRet();
            });			
		};
        /******************************************** 初始化操作 ******************************************/
        //初始化
		$scope.init = function() {
			$scope.page = 1;
			$scope.rows = 8;
            $scope.keyword = "";
			$scope.totalItems = 0;
			$scope.queryUserList();
		};
		$scope.init();
	}])
	.controller('userOpCtrl', ['$scope', '$modalInstance', '$http', '$timeout', 'items', function($scope, $modalInstance, $http, $timeout, items) {
        //操作User
		$scope.opUserItem = function (urlNo, userId) {
            $http.post('/dfapi?api=' + urlNo, {
                id: userId,
                userName: $scope.userItem.userName,
                role: $scope.userItem.role,
                telphone: $scope.userItem.telphone,
                position: $scope.userItem.position,
                description: $scope.userItem.description,
                password: $scope.userItem.password
            })
            .success(function(response) {
                if (response.Result === 'success') {
                    $scope.Message = "操作成功";
                    $timeout(function() {
                        $modalInstance.close();
                    }, 500);
                } else {
                    $scope.Message = response.Message;
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
                $scope.opUserItem('004', 0);
            }
            if (items.type === 'edit') {
                $scope.opUserItem('005', items.userItem.id);
            }
		};
        //取消表单
		$scope.cancelForm = function () {
		    $modalInstance.dismiss('cancel');
		};
        //清空输入框
        $scope.clearInput = function() {
            $scope.userItem.userName = "";
            $scope.userItem.role = 2;
            $scope.userItem.password = "";
            $scope.userItem.telphone = "";
            $scope.userItem.position = "";
            $scope.userItem.description = "";
        };
        //初始化输入框
        $scope.initInput = function() {
            var userInfo = items.userItem;
            $scope.userItem.userName = userInfo.userName;
			$scope.userItem.password = "123";
            $scope.userItem.role = userInfo.role;
            $scope.userItem.telphone = userInfo.telphone;
            $scope.userItem.position = userInfo.position;
            $scope.userItem.description = userInfo.description;
        };
        /******************************************** 初始化操作 ******************************************/
        //初始化        
        $scope.init = function() {
            $scope.items = items;
            $scope.dirtyFlag = false;
            $scope.Message = "";
            $scope.userItem = {};
            if (items.type === 'edit') {
                $scope.initInput();
            } else {
                $scope.clearInput();
            }
        };
        $scope.init();
	}]);

