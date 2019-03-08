angular.module('app.controllers')
	.controller('dashboardCtrl', ['$scope', '$rootScope', '$http', '$filter', '$timeout', function($scope, $rootScope, $http, $filter, $timeout) {
		//获取进站车辆数
		$scope.queryCarCount = function() {
		    $http.get('/dfapi', {
				params: {
					"api": 701,
					"day": $scope.countDay
				}
			})
			.success(function(response) { 
                $scope.carCountList = response.Data;
                $scope.drawCarCount();
			});
		};
		//查询当天成本利润占比
		$scope.queryBenifitRate = function() {
		    $http.get('/dfapi', {
				params: {
					"api": 702
				}
			})
			.success(function(response) {
				$scope.cost = response.Data.totalCost;
				$scope.benifit = response.Data.totalBenifit;
				$scope.drawBenifitRate();
			});
		};
		//获取利润折线图
		$scope.queryBenifit = function() {
		    $http.get('/dfapi', {
				params: {
					"api": 703,
					"day": $scope.benifitDay
				}
			})
			.success(function(response) { 
                $scope.benifitList = response.benifitList;
				$scope.drawBenifit();
			});
		};
        //初始化
		$scope.init = function() {
			$scope.page = 1;
			$scope.rows = 3;
			$scope.totalItems = 0;
			$scope.countDay = 7;
			$scope.benifitDay = 10;
			$scope.queryCarCount();
            $scope.queryBenifitRate();
            $scope.queryBenifit();
		};
		//构造车辆数目图
		$scope.drawCarCount = function() {
            FusionCharts.ready(function () {
                var revenueChart = new FusionCharts({
                    type: 'column2d',
                    renderAt: 'car-count-chart',
                    width: '100%',
                    height: '100%',
                    dataFormat: 'json',
                    dataSource: {
                        "chart": {
                            "caption": "近7天车辆进站数",
                            "xAxisname": "日 期",
                            "yAxisName": "单位:辆",
                            //"numberPrefix": "",
                            "paletteColors": "#0075c2",
                            "bgColor": "#ffffff",
                            "borderAlpha": "20",
                            "canvasBorderAlpha": "0",
                            "usePlotGradientColor": "0",
                            "plotBorderAlpha": "10",
                            "placevaluesInside": "1",
                            "rotatevalues": "0",
                            "valueFontColor": "#ffffff",                
                            "showXAxisLine": "1",
                            "xAxisLineColor": "#999999",
                            "divlineColor": "#999999",               
                            "divLineIsDashed": "1",
                            "showAlternateHGridColor": "0"
                        },
                        "data": $scope.carCountList
                    }
                })
                .render();
            });
		};
        //成本、利润占比图
        $scope.drawBenifitRate = function() {
            FusionCharts.ready(function () {
                var revenueChart = new FusionCharts({
                    type: 'pie2d',
                    renderAt: 'benifit-rate-chart',
                    width: '100%',
                    height: '100%',
                    dataFormat: 'json',
                    dataSource: {
                        "chart": {
                            "caption": "成本、利润占比图",
                            "numberPrefix": "￥",
                            "showPercentValues": "1",
                            "showPercentInTooltip": "0",
                            "decimals": "1",
                            "theme": "fint"
                        },
                        "data": [
                            {
                                "label": "成本",
                                "value": $scope.cost
                            }, 
                            {
                                "label": "利润",
                                "value": $scope.benifit
                            }
                        ]
                    }
                }).render();
            });
        };
        //利润图
        $scope.drawBenifit = function() {
            FusionCharts.ready(function () {
                var BenifitChart = new FusionCharts({
                    type: 'line',
                    renderAt: 'benifit-chart',
                    width: '100%',
                    height: '100%',
                    dataFormat: 'json',
                    dataSource: {
                        "chart": {
                            "caption": "近10天利润情况",
                            "xAxisName": "日 期",
                            "yAxisName": "单位:元",
                            "numberPrefix": "￥",
                            "theme": "fint",
                            "usePlotGradientColor": "1",
                            "plotGradientColor": "#f2c500",
                            "plotFillRatio": "1:100",
                            "plotFillAngle":"270"	
                        },
                        
                        "data": $scope.benifitList
                    }
                }).render();
            });
        };
		$scope.init();
	}]);

