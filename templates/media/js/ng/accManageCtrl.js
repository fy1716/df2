angular.module('app.controllers')
    .controller('accManageCtrl', ['$scope', '$http', '$filter', '$modal', function ($scope, $http, $filter, $modal) {
        //清空选中item状态
        $scope.clearSelectedItem = function () {
            $scope.accActiveItem = {};   //清空被选中item
            $scope.currentActiveStatus = false;   //未激活状态
            $scope.currentActiveIndex = null;    //清空被选中item索引
        };
        //获取配件列表
        $scope.queryAccList = function () {
            $scope.clearSelectedItem();
            $scope.accList = $filter('fillArray')([], $scope.rows);
            $http.get('/df/v2/api/acc', {
                params: {
                    "page": $scope.page,
                    "rows": $scope.rows,
                    "search": $scope.keyword
                }
            })
                .success(function (response) {
                    $scope.accList = $filter('fillArray')(response.results, $scope.rows);
                    $scope.totalItems = response.count;
                    if (response.results.length === 0 && $scope.page !== 1) {
                        $scope.page = $scope.page - 1;
                        $scope.queryAccList();
                    }
                });
        };
        //查询
        $scope.searchAcc = function () {
            $scope.page = 1;
            $scope.queryAccList();
        };
        //点击item操作
        $scope.toggleActive = function (index) {
            //点击已选中item
            if ($scope.currentActiveIndex === index) {
                $scope.currentActiveIndex = null;
                $scope.currentActiveStatus = !$scope.currentActiveStatus;
                $scope.accList[index].active = !$scope.accList[index].active;
                $scope.accActiveItem = {};
                return null;
            }
            //已有选中item，点击未选中item
            if (typeof $scope.currentActiveIndex === 'number') {
                $scope.accList[$scope.currentActiveIndex].active = false;
            }
            if (!$scope.accList[index].id) {
                $scope.currentActiveIndex = null;
                $scope.currentActiveStatus = false;
                $scope.accActiveItem = {};
                return false;
            }
            $scope.currentActiveStatus = true;
            $scope.currentActiveIndex = index;
            $scope.accList[index].active = true;
            $scope.accActiveItem = $scope.accList[index];
        };
        //分页
        $scope.pagination = function (page) {
            if (page !== $scope.lastPage) {
                $scope.lastPage = page;
                $scope.page = page;
                $scope.queryAccList();
            }
        };
        /******************************************** 新增、编辑操作 ******************************************/
        //打开操作页面
        $scope.open = function () {
            $scope.items = {
                'type': $scope.opType,
                'title': $scope.opTitle,
                'accItem': $scope.accActiveItem
            };
            var modalInstance = $modal.open({
                //size: size,
                backdrop: 'static',
                templateUrl: 'accOperation.html',
                controller: 'accOpCtrl',
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
                $scope.queryAccList();
            }, function () {
                console.log('cancel acc operation');
            });
        };
        //初始化新增页数据
        $scope.initAddAcc = function () {
            $scope.opType = "add";
            $scope.opTitle = "新增配件";
        };
        //新增操作
        $scope.addAcc = function () {
            $scope.initAddAcc();
            $scope.open();
        };
        //初始化编辑页数据
        $scope.initEditAcc = function () {
            $scope.opType = "edit";
            $scope.opTitle = "编辑配件";
        };
        //编辑操作
        $scope.editAcc = function () {
            $scope.initEditAcc();
            $scope.open();
        };
        //删除结果处理
        $scope.dealDelRet = function () {
            $.smallBox({
                title: "删除结果",
                content: $scope.delMessage + "<p class='text-align-right'><a href='javascript:void(0);' class='btn btn-primary btn-sm'>确定</a></p>",
                color: $scope.tipColor,
                timeout: 2000,
                icon: "fa fa-bell swing animated"
            });
        };
        //确认删除
        $scope.delAccConfirm = function () {
            $http.delete('/df/v2/api/acc/' + $scope.accActiveItem.id + '/')
                .success(function (response) {
                    $scope.delMessage = "操作成功";
                    $scope.tipColor = "#739E73";
                    $scope.dealDelRet();
                    $scope.queryAccList();
                })
                .error(function (response) {
                    for (var key in response) {
                        $scope.delMessage = response[key];
                        break
                    }
                    $scope.tipColor = "#C46A69";
                    $scope.dealDelRet();
                });
        };
        //删除操作
        $scope.delAcc = function () {
            if (confirm("确定要删除该条配件信息吗？")) {
                $scope.delAccConfirm();
            }
        };
        /******************************************** 初始化操作 ******************************************/
        //初始化
        $scope.init = function () {
            $scope.page = 1;
            $scope.lastPage = 1;
            $scope.rows = 8;
            $scope.keyword = "";
            $scope.totalItems = 0;
            $scope.queryAccList();
        };
        $scope.init();
    }])
    .controller('accOpCtrl', ['$scope', '$modalInstance', '$http', '$timeout', 'items', function ($scope, $modalInstance, $http, $timeout, items) {
        //操作Acc
        $scope.opAccItem = function (method, url) {
            if ($scope.accItem.accPrice === '') {
                $scope.accItem.accPrice = Math.ceil($scope.accItem.accCost * 1.4 / 5) * 5
            }
            acc_data = {
                common_name: $scope.accItem.accCommonName,
                name: $scope.accItem.accName,
                sn: $scope.accItem.accIDNumber,
                type: $scope.accItem.accType,
                location: $scope.accItem.accLocation,
                cost: $scope.accItem.accCost,
                price: $scope.accItem.accPrice,
                count: Number($scope.accItem.accCount),
                remark: $scope.accItem.accRemark
            };
            $http({
                method: method,
                url: url,
                data: acc_data
            })
                .success(function (response) {
                    $scope.Message = "操作成功";
                    $timeout(function () {
                        $modalInstance.close();
                    }, 500);
                }).error(function (response) {
                console.log(response);
                for (var key in response) {
                    $scope.Message = response[key];
                    break
                }
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
                $scope.opAccItem('POST', '/df/v2/api/acc/');
            }
            if (items.type === 'edit') {
                $scope.opAccItem('PUT', '/df/v2/api/acc/' + items.accItem.id + '/');
            }
        };
        //取消表单
        $scope.cancelForm = function () {
            $modalInstance.dismiss('cancel');
        };
        //清空输入框
        $scope.clearInput = function () {
            $scope.accItem.accCommonName = "";
            $scope.accItem.accName = "";
            $scope.accItem.accIDNumber = "";
            $scope.accItem.accType = "";
            $scope.accItem.accLocation = "";
            $scope.accItem.accCost = "";
            $scope.accItem.accPrice = "";
            $scope.accItem.accCount = 1;
            $scope.accItem.accRemark = "";
        };
        //初始化输入框
        $scope.initInput = function () {
            var accInfo = items.accItem;
            $scope.accItem.accCommonName = accInfo.common_name;
            $scope.accItem.accName = accInfo.name;
            $scope.accItem.accIDNumber = accInfo.sn;
            $scope.accItem.accType = accInfo.type;
            $scope.accItem.accLocation = accInfo.location;
            $scope.accItem.accCost = accInfo.cost;
            $scope.accItem.accPrice = accInfo.price;
            $scope.accItem.accCount = accInfo.count;
            $scope.accItem.accRemark = accInfo.remark;
        };
        /******************************************** 初始化操作 ******************************************/
        //初始化        
        $scope.init = function () {
            $scope.items = items;
            $scope.dirtyFlag = false;
            $scope.Message = "";
            $scope.accItem = {};
            if (items.type === 'edit') {
                $scope.initInput();
            } else {
                $scope.clearInput();
            }
        };
        $scope.init();
    }]);

