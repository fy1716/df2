angular.module('app.controllers')
	.controller('portCtrl', ['$scope', '$rootScope', '$http', '$filter', '$timeout', function($scope, $rootScope, $http, $filter, $timeout) {
		//导出数据模板
		$scope.outTemplate = function() {
            window.open('/media/data/'+ $scope.templateType + '.xls');
		};
        //导出数据
        $scope.outData = function() {
            if ($scope.dataType === 'acc') {
                window.open('/out/accfile');
            } else if ($scope.dataType === 'carinfo') {
                window.open('/out/carfile');
            } else if ($scope.dataType === 'carfix') {
                window.open('/out/carfixfile?search=1');
            } else {
                alert("导出数据出错");
            }
		};
        $scope.complyImport = function(url) {
            $.ajaxFileUpload
            (
                {
                    url: url, //用于文件上传的服务器端请求地址
                    secureuri: false, //是否需要安全协议，一般设置为false
                    fileElementId: 'newAcc', //文件上传域的ID
                    dataType: 'HTML', //返回值类型 一般设置为json
                    success: function (response)  //服务器成功响应处理函数
                    {
                        
                    },
                    error: function (data, status, e)//服务器响应失败处理函数
                    {

                    }
                }
            );
        };
        //导入数据
        $scope.importData = function() {
            if ($scope.importType === 'acc') {
                $scope.complyImport('/download/newacc');
            } else if ($scope.importType === 'carinfo') {
                $scope.complyImport('/download/newcar');
            } else if ($scope.importType === 'carfix') {
                $scope.complyImport('/download/carfix');
            } else {
                alert("导入数据出错");
            }
		};
        //初始化
		$scope.init = function() {
            $scope.templateType = 'acc';
            $scope.dataType = 'acc';
            $scope.importType = 'acc';
		};
		$scope.init();
	}]);

