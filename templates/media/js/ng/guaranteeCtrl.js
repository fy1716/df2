angular.module('app.controllers')
    .controller('guaranteeCtrl', ['$scope', '$rootScope', '$http', '$filter', '$modal', function ($scope, $rootScope, $http, $filter, $modal) {
        //清空选中item状态
        $scope.clearSelectedItem = function () {
            $scope.GuaranteeActiveItem = {};   //清空被选中item
            $scope.currentActiveStatus = false;   //未激活状态
            $scope.currentActiveIndex = null;    //清空被选中item索引
        };
        //获取配件列表
        $scope.queryGuaranteeList = function () {
            $scope.GuaranteeList = $filter('fillArray')([], $scope.rows);
            $scope.clearSelectedItem();
            var day_start = $scope.dayStart;
            var day_end = $scope.dayEnd;
            if ($scope.keyword) {
                day_start = null;
                day_end = null;
            }
            $http.get('/df/v2/api/guarantee/', {
                params: {
                    "page": $scope.page,
                    "rows": $scope.rows,
                    "day_start": day_start,
                    "day_end": day_end,
                    "search": $scope.keyword
                }
            })
                .success(function (response) {
                    $scope.GuaranteeList = $filter('fillArray')(response.results, $scope.rows);
                    $scope.totalItems = response.count;
                    if (response.results.length === 0 && $scope.page !== 1) {
                        $scope.page = $scope.page - 1;
                        $scope.lastPage = $scope.page;
                        $scope.queryGuaranteeList();
                    }
                });
        };
        //查询
        $scope.searchGuarantee = function () {
            $scope.page = 1;
            $scope.lastPage = 1;
            $scope.queryGuaranteeList();
        };
        //回车查询
        $scope.keydown = function ($event) {
            if ($event.keyCode === 13) {
                $scope.searchGuarantee();
            }
        };
        //点击item操作
        $scope.toggleActive = function (index) {
            //点击已选中item
            if ($scope.currentActiveIndex === index) {
                $scope.currentActiveIndex = null;
                $scope.currentActiveStatus = !$scope.currentActiveStatus;
                $scope.GuaranteeList[index].active = !$scope.GuaranteeList[index].active;
                $scope.GuaranteeActiveItem = {};
                return null;
            }
            //已有选中item，点击未选中item
            if (typeof $scope.currentActiveIndex === 'number') {
                $scope.GuaranteeList[$scope.currentActiveIndex].active = false;
            }
            if (!$scope.GuaranteeList[index].id) {
                $scope.currentActiveIndex = null;
                $scope.currentActiveStatus = false;
                $scope.GuaranteeActiveItem = {};
                return false;
            }
            $scope.currentActiveStatus = true;
            $scope.currentActiveIndex = index;
            $scope.GuaranteeList[index].active = true;
            $scope.GuaranteeActiveItem = $scope.GuaranteeList[index];
        };
        //分页
        $scope.pagination = function (page) {
            if ($scope.lastPage !== page) {
                $scope.page = page;
                $scope.lastPage = page;
                $scope.queryGuaranteeList();
            }
        };
        $scope.showDetail = function (index) {
            $scope.items = {
                'item': $scope.GuaranteeList[index],
            };
            var modalInstance = $modal.open({
                //size: 'sm',
                //backdrop: 'static',
                templateUrl: 'detail.html',
                controller: 'detailCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () {
                console.log('cancel CarFix operation');
            });
        };
        $scope.syncItem = function () {
            $http.post('/df/v2/platform/sync_guarantee/', {})
                .success(function (response) {
                    $scope.delMessage = response.message;
                    $scope.tipColor = "#739E73";
                    $scope.dealDelRet();
                    $scope.queryGuaranteeList();
                })
                .error(function (response) {
                    $scope.delMessage = "操作失败，请联系管理员";
                    $scope.tipColor = "#C46A69";
                    $scope.dealDelRet();
                });
        };
        $scope.editItem = function () {
            $scope.items = {
                'EmployeeInfoItem': $scope.GuaranteeActiveItem
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
                $scope.queryGuaranteeList();
            }, function () {
                console.log('cancel operation');
            });
        };
        //删除结果处理
        $scope.dealDelRet = function () {
            $.smallBox({
                title: "删除结果",
                content: $scope.delMessage + "<p class='text-align-right'><a href='javascript:void(0);' class='btn btn-primary btn-sm'>确定</a></p>",
                color: $scope.tipColor,
                timeout: 5000,
                icon: "fa fa-bell swing animated"
            });
        };
        $scope.changeIsFake = function () {
            $http.put('/df/v2/api/guarantee/' + $scope.GuaranteeActiveItem.id + '/', {
                "is_fake": !$scope.GuaranteeActiveItem.is_fake
            })
                .success(function (response) {
                    $scope.delMessage = "操作成功";
                    $scope.tipColor = "#739E73";
                    $scope.dealDelRet();
                    $scope.queryGuaranteeList();
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
        /******************************************** 初始化操作 ******************************************/
        //初始化
        $scope.init = function () {
            $scope.page = 1;
            $scope.lastPage = 1;
            $scope.rows = 8;
            $scope.totalItems = 0;
            $scope.keyword = "";
            var startDate = new Date();
            var startStamp = startDate.setDate(startDate.getDate() + 1);
            $scope.dayStart = new Date().Format("yyyy-MM-dd");
            $scope.dayEnd = new Date(startStamp).Format("yyyy-MM-dd");
            $scope.queryGuaranteeList();
        };
        $scope.init();
    }])
    .controller('detailCtrl', ['$scope', '$modalInstance', '$http', '$timeout', 'items', function ($scope, $modalInstance, $http, $timeout, items) {
        $scope.items = items;
        $scope.g = items.item;
        console.log($scope.g);
        $scope.confirmDetail = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('EmployeeInfoOpCtrl', ['$scope', '$modalInstance', '$http', '$timeout', 'items', function ($scope, $modalInstance, $http, $timeout, items) {
        //新增EmployeeInfo
        $scope.opEmployeeInfoItem = function (method, url) {
            data = {
                sub_site: $scope.EmployeeInfoItem.carFixMan,
                remark: $scope.EmployeeInfoItem.remark,
            };
            $http({
                method: method,
                url: url,
                data: data
            })
                .success(function (response) {
                    $scope.Message = "操作成功";
                    $timeout(function () {
                        $modalInstance.close();
                    }, 500);
                }).error(function (response) {
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
            $scope.opEmployeeInfoItem('PUT', '/df/v2/api/guarantee/' + items.EmployeeInfoItem.id + '/');
        };
        //取消表单
        $scope.cancelForm = function () {
            $modalInstance.dismiss('cancel');
        };
        //初始化输入框
        $scope.initInput = function () {
            var EmployeeInfo = items.EmployeeInfoItem;
            $scope.EmployeeInfoItem.carFixMan = EmployeeInfo.sub_site;
            $scope.EmployeeInfoItem.remark = EmployeeInfo.remark;
        };
        $scope.getSubSite = function () {
            $http.get('/df/v2/api/sub_site/', {
                params: {
                    "page": $scope.page,
                    "rows": 50,
                }
            })
                .success(function (response) {
                    $scope.subSiteList = response.results;
                    $scope.totalItems = response.count;
                });
        };
        /******************************************** 初始化操作 ******************************************/
        //初始化
        $scope.init = function () {
            $scope.items = items;
            $scope.dirtyFlag = false;
            $scope.Message = "";
            $scope.EmployeeInfoItem = {};
            $scope.getSubSite();
            $scope.initInput();
        };
        $scope.init();
    }]);
    