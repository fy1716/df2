angular.module('app.controllers')
	.controller('accSearchCtrl', ['$scope', '$rootScope', '$http', '$filter', '$timeout', '$cookies', function($scope, $rootScope, $http, $filter, $timeout, $cookies) {
		//获取配件列表
		$scope.queryAccList = function() {
		    $scope.accList = $filter('fillArray')([], $scope.rows);
		    $http.get('/dfapi', {
				params: {
					"api": 101,
					"page": $scope.page,
					"rows": $scope.rows,
                    "accName": $scope.keyword
				}
			})
			.success(function(response) {
				$scope.accList = $filter('fillArray')(response.rows, $scope.rows);
				$scope.totalItems = response.total;
			});	
		};
        
        //查询
        $scope.searchAcc = function() {
            $scope.page = 1;
	    $scope.lastPage = 1;
            $scope.queryAccList();
        };
		//分页
		$scope.pagination = function(page) {
			if (page !== $scope.lastPage) {
				$scope.page = page;
				$scope.lastPage = page;
				$scope.queryAccList();
			}
		};
        //初始化
		$scope.init = function() {
			$scope.page = 1;
			$scope.lastPage = 1;
			$scope.rows = 8;
			$scope.totalItems = 0;
			$scope.queryAccList();
		};
		$scope.init();
	}]);

