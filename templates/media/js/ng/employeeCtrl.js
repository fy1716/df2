angular.module('app.controllers')
    .controller('employeeCtrl', ['$scope', '$rootScope', '$http', '$filter', '$modal', function($scope, $rootScope, $http, $filter, $modal) {
        //清空选中item状态
        $scope.clearSelectedItem = function() {
            $scope.EmployeeInfoActiveItem = {};   //清空被选中item
            $scope.currentActiveStatus = false;   //未激活状态
            $scope.currentActiveIndex = null;    //清空被选中item索引
        };
        //获取配件列表
        $scope.queryEmployeeInfoList = function() {
            $scope.EmployeeInfoList = $filter('fillArray')([], $scope.rows);
            $scope.clearSelectedItem();
            $http.get('/dfapi', {
                params: {
                    "api": 801,
                    "page": $scope.page,
                    "rows": $scope.rows,
                }
            })
            .success(function(response) { 
                $scope.EmployeeInfoList = $filter('fillArray')(response.rows, $scope.rows);
                $scope.totalItems = response.total;
                if (response.rows.length === 0 && $scope.page !== 1) {
                    $scope.page = $scope.page - 1;
                    $scope.lastPage = $scope.page;
                    $scope.queryEmployeeInfoList();
                }
            });	
        };
        //查询
        $scope.searchEmployeeInfo = function() {
            $scope.page = 1;
            $scope.lastPage = 1;
            $scope.queryEmployeeInfoList();
        };
        //回车查询
        $scope.keydown = function ($event) {
            if ($event.keyCode === 13) {
                $scope.searchEmployeeInfo();
            }
        };
        //点击item操作
        $scope.toggleActive = function(index) {
            //点击已选中item
            if ($scope.currentActiveIndex === index) {
                $scope.currentActiveIndex = null;
                $scope.currentActiveStatus = !$scope.currentActiveStatus;
                $scope.EmployeeInfoList[index].active = !$scope.EmployeeInfoList[index].active;
                $scope.EmployeeInfoActiveItem = {};
                return null;
            }
            //已有选中item，点击未选中item
            if (typeof $scope.currentActiveIndex === 'number') {
                $scope.EmployeeInfoList[$scope.currentActiveIndex].active = false;
            }
            if (!$scope.EmployeeInfoList[index].id) {
                $scope.currentActiveIndex = null;
                $scope.currentActiveStatus = false;
                $scope.EmployeeInfoActiveItem = {};
                return false;
            }
            $scope.currentActiveStatus = true;
            $scope.currentActiveIndex = index;
            $scope.EmployeeInfoList[index].active = true;
            $scope.EmployeeInfoActiveItem = $scope.EmployeeInfoList[index];
        };
        //分页
        $scope.pagination = function(page) {
            if ($scope.lastPage !== page) {
                $scope.page = page;
                $scope.lastPage = page;
                $scope.queryEmployeeInfoList();
            }
        };
        /******************************************** 新增、编辑操作 ******************************************/
        //打开操作页面
        $scope.openOpPage = function () {
            $scope.items = {
                'type': $scope.opType,
                'title': $scope.opTitle,
                'EmployeeInfoItem': $scope.EmployeeInfoActiveItem
            };
            var modalInstance = $modal.open({
                //size: size,
                backdrop: 'static',
                templateUrl: 'EmployeeInfoOperation.html',
                controller: 'EmployeeInfoOpCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                if ($scope.opType === "add") {
                    $scope.page = 1;
                    $scope.lastPage = 1;
                }
                $scope.queryEmployeeInfoList();
            }, function () {
                console.log('cancel EmployeeInfo operation');
            });
        };
        //初始化新增页数据
        $scope.initAddEmployeeInfo = function () {
            $scope.opType = "add";
            $scope.opTitle = "新增员工信息";
        };
        //新增操作
        $scope.addEmployeeInfo = function () {
            $scope.initAddEmployeeInfo();
            $scope.openOpPage();
        };
        //初始化编辑页数据
        $scope.initEditEmployeeInfo = function () {
            $scope.opType = "edit";
            $scope.opTitle = "编辑员工信息";
        };
        //编辑操作
        $scope.editEmployeeInfo = function () {
            $scope.initEditEmployeeInfo();
            $scope.openOpPage();
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
        $scope.delEmployeeInfoConfirm = function() {
            $http.post('/dfapi?api=804', {
                id: $scope.EmployeeInfoActiveItem.id
            })
            .success(function(response) {
                $scope.delMessage = response.Message;
                if (response.Result === 'success') {
                    $scope.tipColor = "#739E73";
                } else {
                    $scope.tipColor = "#C46A69";
                }
                $scope.dealDelRet();
                $scope.queryEmployeeInfoList();
            })
            .error(function(response) {
                $scope.tipColor = "#C46A69";
                $scope.delMessage = "服务器无响应，请稍后重试！";
                $scope.dealDelRet();
            });			
        };
        //删除操作
        $scope.delEmployeeInfo = function() {
            if(confirm("确定要删除该信息吗？")) {
                $scope.delEmployeeInfoConfirm();
            }
        };
        /******************************************** 初始化操作 ******************************************/
        //初始化
        $scope.init = function() {
            $scope.page = 1;
            $scope.lastPage = 1;
            $scope.rows = 8;
            $scope.totalItems = 0;
            $scope.keyword = "";
            $scope.queryEmployeeInfoList();
        };
        $scope.init();
    }])
    .controller('EmployeeInfoOpCtrl', ['$scope', '$modalInstance', '$http', '$timeout', 'items', function($scope, $modalInstance, $http, $timeout, items) {
        //新增EmployeeInfo
        $scope.opEmployeeInfoItem = function (urlNo, EmployeeInfoId) {
            $http.post('/dfapi?api=' + urlNo, {
                id: EmployeeInfoId,
                name: $scope.EmployeeInfoItem.name,
                remark: $scope.EmployeeInfoItem.remark
            })
            .success(function(response) {
                if (response.Result === 'success') {
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
                $scope.opEmployeeInfoItem(802, 0);
            }
            if (items.type === 'edit') {
                $scope.opEmployeeInfoItem(803, items.EmployeeInfoItem.id);
            }
        };
        //取消表单
        $scope.cancelForm = function () {
            $modalInstance.dismiss('cancel');
        };
        //清空输入框
        $scope.clearInput = function() {
            $scope.EmployeeInfoItem.name = "";
            $scope.EmployeeInfoItem.remark = "";
        };
        //初始化输入框
        $scope.initInput = function() {
            var EmployeeInfo = items.EmployeeInfoItem;
            $scope.EmployeeInfoItem.name = EmployeeInfo.name;
            $scope.EmployeeInfoItem.remark = EmployeeInfo.remark;
        };
        /******************************************** 初始化操作 ******************************************/
        //初始化        
        $scope.init = function() {
            $scope.items = items;
            $scope.dirtyFlag = false;
            $scope.Message = "";
            $scope.EmployeeInfoItem = {};
            if (items.type === 'edit') {
                $scope.initInput();
            } else {
                $scope.clearInput();
            }
        };
        $scope.init();
    }]);
    