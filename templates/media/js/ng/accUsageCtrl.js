angular.module('app.controllers')
	.controller('accUsageCtrl', ['$scope', '$http', '$filter', '$modal', function($scope, $http, $filter, $modal) {
		//获取配件列表
		$scope.queryAccUsageList = function() {
		    $http.get('/dfapi', {
				params: {
					"api": 501,
					"page": $scope.page,
					"rows": $scope.rows,
					"dayStart": $scope.dayStart,
					"dayEnd": $scope.dayEnd
				}
			})
			.success(function(response) {
				$scope.accUsageList = $filter('fillArray')(response.rows, $scope.rows);
				$scope.totalItems = response.total;
				if (response.rows.length === 0 && $scope.page !== 1) {
					$scope.page = $scope.page - 1;
					$scope.queryAccUsageList();
				}
			});	
		};
        //查询
        $scope.searchAccUsage = function(retValid) {
            if (!retValid) {
                return null;
            }
            $scope.page = 1;
            $scope.queryAccUsageList();
        };
        //回车查询
        $scope.keydown = function ($event) {
            if ($event.keyCode === 13) {
                $scope.searchAccUsage();
            }
        };
		//分页
		$scope.pagination = function(page) {
            $scope.page = page;
			$scope.queryAccUsageList();
		};
		//导出操作
		$scope.expAccUsage = function() {
			window.open('/export/accfile?dayStart=' + $scope.dayStart + '&dayEnd=' + $scope.dayEnd);
		};
        /******************************************** 初始化操作 ******************************************/
        //初始化
		$scope.init = function() {
			$scope.page = 1;
			$scope.rows = 8;
            $scope.totalItems = 0;
			//var startDate = new Date();
			//var startStamp = startDate.setDate(startDate.getDate() - 15);
			//$scope.dayStart = new Date(startStamp).Format("yyyy-MM-dd");
	    $scope.dayStart = new Date().Format("yyyy-MM-dd");
            $scope.dayEnd = new Date().Format("yyyy-MM-dd");
			$scope.queryAccUsageList();
		};
		$scope.init();
	}]);
