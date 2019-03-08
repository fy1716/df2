angular.module('app.controllers')
	.controller('overviewCtrl', ['$scope', '$rootScope', '$http', '$filter', '$timeout', function($scope, $rootScope, $http, $filter, $timeout) {
		//获取收支数据
		$scope.queryFinanceData = function() {
		    $http.get('/dfapi', {
				params: {
					"api": 515,
					"day": $scope.day
				}
			})
			.success(function(response) { 
                $scope.dateList = response.dateList;
                $scope.InList = response.InList;
                $scope.OutList = response.OutList;
                $scope.InOutList = response.InOutList;
                $scope.drawBalance();
			});
		};
        //查询车辆维修信息
		$scope.queryCarFixList = function() {
		    $http.get('/dfapi', {
				params: {
					"api": 211,
					"page": $scope.page,
					"rows": $scope.rows,
					"dayStart": $scope.dayStart,
					"dayEnd": $scope.dayEnd,
					"search": true
				}
			})
			.success(function(response) {
				$scope.carFixList = $filter('fillArray')(response.rows, $scope.rows);
				$scope.totalItems = response.total;
			});	
		};
        //查询
        $scope.searchAcc = function() {
            $scope.page = 1;
            $scope.queryCarFixList();
        };
		//分页
		$scope.pagination = function(page) {
            $scope.page = page;
			$scope.queryCarFixList();
		};
        //初始化
		$scope.init = function() {
			$scope.page = 1;
			$scope.rows = 3;
			$scope.totalItems = 0;
			$scope.day = 7;
            $scope.dayStart = new Date().Format("yyyy-MM-dd");
            $scope.dayEnd = new Date().Format("yyyy-MM-dd");
			$scope.queryFinanceData();
			$scope.queryCarFixList();
			
		};
		$scope.drawBalance = function() {
            FusionCharts.ready(function () {
                var revenueChart = new FusionCharts({
                    type: 'mscolumn2d',
                    renderAt: 'chart-container',
                    width: '100%',
                    height: '350',
                    dataFormat: 'json',
                    dataSource: {
                        "chart": {
                            "caption": "近7天收支情况",
                            "xAxisname": "日 期",
                            "pYAxisName": "金 额",
                            "numberPrefix": "￥",
                            "paletteColors": "#1aaf5d",
                            "bgColor": "#ffffff",
                            "showBorder": "0",
                            "showCanvasBorder": "0",
                            "usePlotGradientColor": "0",
                            "plotBorderAlpha": "10",
                            "legendBorderAlpha": "0",
                            "legendBgAlpha": "0",
                            "legendShadow": "0",
                            "showHoverEffect":"1",
                            "valueFontColor": "#4C4F53",
                            "rotateValues": "0.5",
                            "placeValuesInside": "0",
                            "divlineColor": "#999999",
                            "divLineIsDashed": "1",
                            "divLineDashLen": "1",
                            "divLineGapLen": "1",
                            "canvasBgColor": "#ffffff",
                            "captionFontSize": "14"
                        },
                        "categories": [
                            {
                                "category": $scope.dateList
                            }
                        ],
                        "dataset": [
                            //{
                            //    "seriesname": "支出",
                            //    "data": $scope.OutList
                            //},
                            {
                                "seriesname": "收入",
                                "data": $scope.InList
                            }
			//	,
                         //   {
                           //     "seriesname": "收支",
                          //      "renderAs": "line",
                                //"parentYAxis": "S",
                                //"showValues": "0",
                            //    "data": $scope.InOutList
                            //}
                        ]
                    }
                })
                .render();
            });
		};
		$scope.init();
	}]);

