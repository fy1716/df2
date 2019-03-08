var loginApp = angular.module('loginApp', [
    'ngRoute',
    'ngCookies'
]);
angular.module('loginApp')
    .controller('loginCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$cookies', '$window', '$cookieStore', function ($scope, $rootScope, $http, $timeout, $cookies, $window, $cookieStore) {
        //完成登录
        $scope.complyLogin = function () {
            $http.post('/df/v2/login/', {
                "username": $scope.userName,
                "password": $scope.password
            })
                .success(function (response) {
                    console.log(response);
                    if (response.token) {
                        localStorage.loginFlag = true;
                        localStorage.username = $scope.userName;
                        localStorage.JWT_TOKEN = response.token;
                        $timeout(function () {
                            $window.location.href = '/index.html';
                            return null;
                        }, 500);
                    } else {
                        alert(response.Message);
                    }
                })
                .error(function (error) {
                    console.log(error);
                    if ("non_field_errors" in error) {
                        ret_error = error.non_field_errors[0];
                    }
                    if ("username" in error) {
                        ret_error = error.username[0];
                    }
                    if ("password" in error) {
                        ret_error = error.password[0];
                    }
                    alert(ret_error);
                });
        };
        //完成注册
        $scope.complyRegister = function () {
            $scope.showTips = "";
            $http.post('/dfapi?api=002', {
                "stationNameR": $scope.stationNameR,
                "userNameR": $scope.userNameR,
                "passwordR": $scope.passwordR,
                "stationDescR": $scope.stationDescR
            })
                .success(function (response) {
                    $scope.showTips = response.Message;
                    if (response.Result === 'success') {
                        localStorage.loginFlag = true;
                        $timeout(function () {
                            $window.location.href = '/login';
                            return null;
                        }, 500);
                    }
                });
        };
        $scope.rememberUser = function () {
            if ($scope.remember) {
                $cookies.WebUserName = $scope.userName;
                $cookies.WebPasswd = $scope.password;
            } else {
                $cookies.WebUserName = "";
                $cookies.WebPasswd = "";
            }
        };
        //登录
        $scope.login = function (retValid) {
            if (!retValid) {
                $scope.Message = "请确认格式正确！";
                return null;
            }
            $scope.rememberUser();
            $scope.complyLogin();
        };
        //注册
        $scope.register = function () {
            $scope.complyRegister();
        };
        //初始化
        $scope.init = function () {
            if ($cookies.WebUserName) {
                $scope.remember = true;
                $scope.userName = $cookies.WebUserName;
                $scope.password = $cookies.WebPasswd;
            } else {
                $scope.remember = false;
                return null;
            }
        };
        $scope.init();
    }]);

