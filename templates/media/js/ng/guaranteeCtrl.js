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
        $scope.delGuaranteeConfirm = function () {
            $http.delete('/df/v2/api/guarantee/' + $scope.GuaranteeActiveItem.id + '/')
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
        //删除操作
        $scope.delGuarantee = function () {
            if (confirm("确定要删除该信息吗？")) {
                $scope.delGuaranteeConfirm();
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
            $scope.dayStart = new Date().Format("yyyy-MM-dd");
            $scope.dayEnd = new Date().Format("yyyy-MM-dd");
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
    }]);
    