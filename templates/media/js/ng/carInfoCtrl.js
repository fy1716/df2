angular.module('app.controllers')
    .controller('carInfoCtrl', ['$scope', '$rootScope', '$http', '$filter', '$modal', function ($scope, $rootScope, $http, $filter, $modal) {
        $scope.searchItemList = ["", "", "", ""];
        $scope.searchTypeList = ["底盘号", "车牌", "车主", "电话"];
        //监控查询类型变化
        $scope.$watch('searchType', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.searchType = Number($scope.searchType);
                $scope.searchTip = $scope.searchTypeList[$scope.searchType];
            }
        });
        //清空选中item状态
        $scope.clearSelectedItem = function () {
            $scope.carInfoActiveItem = {};   //清空被选中item
            $scope.currentActiveStatus = false;   //未激活状态
            $scope.currentActiveIndex = null;    //清空被选中item索引
            $scope.searchItemList = ["", "", "", ""];
            $scope.searchItemList[$scope.searchType] = $scope.keyword;
        };
        //获取配件列表
        $scope.queryCarInfoList = function () {
            $scope.carInfoList = $filter('fillArray')([], $scope.rows);
            $scope.clearSelectedItem();
            $http.get('/df/v2/api/car_info/', {
                params: {
                    "page": $scope.page,
                    "rows": $scope.rows,
                    "day_start": $scope.dayStart,
                    "day_end": $scope.dayEnd,
                    "search": $scope.searchItemList[0] + $scope.searchItemList[1] + $scope.searchItemList[2] + $scope.searchItemList[3],
                }
            })
                .success(function (response) {
                    $scope.carInfoList = $filter('fillArray')(response.results, $scope.rows);
                    $scope.totalItems = response.count;
                    if (response.results.length === 0 && $scope.page !== 1) {
                        $scope.page = $scope.page - 1;
                        $scope.lastPage = $scope.page;
                        $scope.queryCarInfoList();
                    }
                });
        };
        //查询
        $scope.searchCarInfo = function () {
            $scope.page = 1;
            $scope.lastPage = 1;
            $scope.queryCarInfoList();
        };
        //回车查询
        $scope.keydown = function ($event) {
            if ($event.keyCode === 13) {
                $scope.searchCarInfo();
            }
        };
        //点击item操作
        $scope.toggleActive = function (index) {
            //点击已选中item
            if ($scope.currentActiveIndex === index) {
                $scope.currentActiveIndex = null;
                $scope.currentActiveStatus = !$scope.currentActiveStatus;
                $scope.carInfoList[index].active = !$scope.carInfoList[index].active;
                $scope.carInfoActiveItem = {};
                return null;
            }
            //已有选中item，点击未选中item
            if (typeof $scope.currentActiveIndex === 'number') {
                $scope.carInfoList[$scope.currentActiveIndex].active = false;
            }
            if (!$scope.carInfoList[index].id) {
                $scope.currentActiveIndex = null;
                $scope.currentActiveStatus = false;
                $scope.carInfoActiveItem = {};
                return false;
            }
            $scope.currentActiveStatus = true;
            $scope.currentActiveIndex = index;
            $scope.carInfoList[index].active = true;
            $scope.carInfoActiveItem = $scope.carInfoList[index];
        };
        //分页
        $scope.pagination = function (page) {
            if ($scope.lastPage !== page) {
                $scope.page = page;
                $scope.lastPage = page;
                $scope.queryCarInfoList();
            }
        };
        /******************************************** 新增、编辑操作 ******************************************/
        //打开操作页面
        $scope.openOpPage = function () {
            $scope.items = {
                'type': $scope.opType,
                'title': $scope.opTitle,
                'carInfoItem': $scope.carInfoActiveItem
            };
            var modalInstance = $modal.open({
                //size: size,
                backdrop: 'static',
                templateUrl: 'carInfoOperation.html',
                controller: 'carInfoOpCtrl',
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
                $scope.queryCarInfoList();
            }, function () {
                console.log('cancel carInfo operation');
            });
        };
        //初始化新增页数据
        $scope.initAddcarInfo = function () {
            $scope.opType = "add";
            $scope.opTitle = "新增车辆信息";
        };
        //新增操作
        $scope.addCarInfo = function () {
            $scope.initAddcarInfo();
            $scope.openOpPage();
        };
        //初始化编辑页数据
        $scope.initEditcarInfo = function () {
            $scope.opType = "edit";
            $scope.opTitle = "编辑车辆信息";
        };
        //编辑操作
        $scope.editCarInfo = function () {
            $scope.initEditcarInfo();
            $scope.openOpPage();
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
        //确认删除
        $scope.delCarInfoConfirm = function () {
            $http.delete('/df/v2/api/car_info/' + $scope.carInfoActiveItem.id + '/')
                .success(function (response) {
                    $scope.delMessage = "操作成功";
                    $scope.tipColor = "#739E73";
                    $scope.dealDelRet();
                    $scope.queryCarInfoList();
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
        $scope.delCarInfo = function () {
            if (confirm("确定要删除该条车辆信息吗？")) {
                $scope.delCarInfoConfirm();
            }
        };
        /******************************************** 初始化操作 ******************************************/
        //初始化
        $scope.init = function () {
            $scope.page = 1;
            $scope.lastPage = 1;
            $scope.rows = 8;
            $scope.totalItems = 0;
            $scope.keyword = "";
            $scope.searchType = 0;
            $scope.searchTip = $scope.searchTypeList[0];
            var startDate = new Date();
            var startStamp = startDate.setDate(startDate.getDate() - 60);
            $scope.dayStart = new Date(startStamp).Format("yyyy-MM-dd");
            $scope.dayEnd = new Date().Format("yyyy-MM-dd");
            $scope.queryCarInfoList();
        };
        $scope.init();
    }])
    .controller('carInfoOpCtrl', ['$scope', '$modalInstance', '$http', '$timeout', 'items', function ($scope, $modalInstance, $http, $timeout, items) {
        //新增carInfo
        $scope.opcarInfoItem = function (method, url) {
            car_data = {
                sn: $scope.carInfoItem.carIDNumber,
                number: $scope.carInfoItem.carNumber,
                type: $scope.carInfoItem.carType,
                buy_date: $scope.carInfoItem.carBuyDate,
                pro_date: $scope.carInfoItem.carProDate,
                owner: $scope.carInfoItem.carOwner,
                tel: $scope.carInfoItem.carTel,
                remark: $scope.carInfoItem.carRemark
            };
            $http({
                method: method,
                url: url,
                data: car_data
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
            if (items.type === 'add') {
                $scope.opcarInfoItem('POST', '/df/v2/api/car_info/');
            }
            if (items.type === 'edit') {
                $scope.opcarInfoItem('PUT', '/df/v2/api/car_info/' + items.carInfoItem.id + '/');
            }
        };
        //取消表单
        $scope.cancelForm = function () {
            $modalInstance.dismiss('cancel');
        };
        //清空输入框
        $scope.clearInput = function () {
            $scope.carInfoItem.carIDNumber = "";
            $scope.carInfoItem.carNumber = "";
            $scope.carInfoItem.carType = "";
            $scope.carInfoItem.carBuyDate = "2000-01-01";
            $scope.carInfoItem.carProDate = "2000-01-01";
            $scope.carInfoItem.carCard = "";
            $scope.carInfoItem.carOwner = "";
            $scope.carInfoItem.carTel = "";
            $scope.carInfoItem.carRemark = "";
        };
        //初始化输入框
        $scope.initInput = function () {
            var carInfo = items.carInfoItem;
            $scope.carInfoItem.carIDNumber = carInfo.sn;
            $scope.carInfoItem.carNumber = carInfo.number;
            $scope.carInfoItem.carType = carInfo.type;
            $scope.carInfoItem.carBuyDate = carInfo.buy_date;
            $scope.carInfoItem.carProDate = carInfo.pro_date;
            $scope.carInfoItem.carOwner = carInfo.owner;
            $scope.carInfoItem.carTel = carInfo.tel;
            $scope.carInfoItem.carRemark = carInfo.remark;
        };
        /******************************************** 初始化操作 ******************************************/
        //初始化        
        $scope.init = function () {
            $scope.items = items;
            $scope.dirtyFlag = false;
            $scope.Message = "";
            $scope.carInfoItem = {};
            if (items.type === 'edit') {
                $scope.initInput();
            } else {
                $scope.clearInput();
            }
        };
        $scope.init();
    }]);
    