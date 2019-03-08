angular.module('app.controllers', [])
    .factory('settings', ['$rootScope', function ($rootScope) {
        // supported languages
        var settings = {
            languages: [
                {
                    language: 'English',
                    translation: 'English',
                    langCode: 'en',
                    flagCode: 'us'
                },
                {
                    language: 'Espanish',
                    translation: 'Espanish',
                    langCode: 'es',
                    flagCode: 'es'
                },
                {
                    language: 'German',
                    translation: 'Deutsch',
                    langCode: 'de',
                    flagCode: 'de'
                },
                {
                    language: 'Korean',
                    translation: '한국의',
                    langCode: 'ko',
                    flagCode: 'kr'
                },
                {
                    language: 'French',
                    translation: 'français',
                    langCode: 'fr',
                    flagCode: 'fr'
                },
                {
                    language: 'Portuguese',
                    translation: 'português',
                    langCode: 'pt',
                    flagCode: 'br'
                },
                {
                    language: 'Russian',
                    translation: 'русский',
                    langCode: 'ru',
                    flagCode: 'ru'
                },
                {
                    language: 'Chinese',
                    translation: '中國的',
                    langCode: 'zh',
                    flagCode: 'cn'
                }
            ],
        };
        return settings;
    }])
    .filter('fillArray', ['$log', function ($log) {
        return function (input, count) {
            if (!Array.isArray(input) || input.length > count) {
                return input;
            }
            var length = input.length;
            var range = count - length;
            var filler = [];
            for (var i = 0; i < range; i++) {
                filler.push({});
            }
            return input.concat(filler);
        };
    }])
    .controller('PageViewController', ['$scope', '$route', '$animate', function ($scope, $route, $animate) {
        // controler of the dynamically loaded views, for DEMO purposes only.
        /*$scope.$on('$viewContentLoaded', function() {

        });*/
    }])
    .controller('SmartAppController', ['$scope', '$rootScope', '$cookies', '$window', '$location', '$modal', function ($scope, $rootScope, $cookies, $window, $location, $modal) {

        //权限处理
        $rootScope.systemFlag = false;
        $rootScope.financeFlag = false;
        RightList = ['overview', 'acc', 'accSearch', 'accManage', 'car', 'carFix', 'carInfo', 'data',
            'finance', 'accUsage', 'port', 'report', 'dashboard', 'userManage'];
        rootRightList = [false, false, false, false, false, false, false, false, false, false, false, false, false, true];
        adminRightList = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];
        managerRightList = [false, true, false, true, true, true, true, true, true, true, true, false, false, false];
        guestRightList = [false, false, true, false, false, false, false, false, false, false, false, false, false, false];

        $scope.setRight = function (roleRightList) {
            right = {};
            $rootScope.Right = {};
            for (var i = 0; i < RightList.length; i++) {
                module = RightList[i];
                flag = roleRightList[i];
                right[module] = flag;
            }
            $rootScope.Right = right;
        };
        $rootScope.userNameGlobal = $cookies.userName;
        $rootScope.lastLoginGlobal = eval($cookies.lastLogin);
        $cookies.role = 2;
        switch (Number($cookies.role)) {
            case 0:
                $rootScope.systemFlag = true;
                $rootScope.financeFlag = true;
                roleRightList = rootRightList;
                $scope.url = '/userManage';
                break;
            case 1:
                roleRightList = adminRightList;
                $rootScope.financeFlag = true;
                $scope.url = '/overview';
                break;
            case 2:
                roleRightList = managerRightList;
                $scope.url = '/carFix';
                break;
            default:
                roleRightList = guestRightList;
                $scope.url = '/accSearch';
                break;
        }
        $scope.setRight(roleRightList);
        //修改服务站信息
        $scope.changeStation = function () {
            $scope.items = {
                'stationName': $cookies.stationName,
                'hotline': $cookies.hotline
            };
            var modalInstance = $modal.open({
                size: 'sm',
                backdrop: 'static',
                templateUrl: 'changeStation.html',
                controller: 'changeStationCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () {
                console.log('cancel change passwd');
            });
        };
        //修改密码
        $scope.changePasswd = function () {
            $scope.items = {
                'financeItem': 111
            };
            var modalInstance = $modal.open({
                size: 'sm',
                backdrop: 'static',
                templateUrl: 'changePasswd.html',
                controller: 'changePasswdCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () {
                console.log('cancel change passwd');
            });
        };
        //没登录或注销后无法查看内容页
        $rootScope.$on("$locationChangeStart", function (event) {
            if (!$location.path()) {
                $location.path($scope.url);
            }
            console.log(localStorage.JWT_TOKEN);
            console.log(localStorage.loginFlag);
            if (!localStorage.JWT_TOKEN || !localStorage.loginFlag) {
                $cookies.userName = "";
                $cookies.code = "";
                $window.location.href = '/login.html';
                return null;
            }
        });
    }])
    .controller('changePasswdCtrl', ['$scope', '$modalInstance', '$http', '$timeout', '$window', function ($scope, $modalInstance, $http, $timeout, $window) {
        $scope.confirmChange = function (oldPasswd, newPasswd) {
            $http.post('/dfapi?api=008', {
                'oldPasswd': oldPasswd,
                'newPasswd': newPasswd
            })
                .success(function (response) {
                    if (response.Result === 'success') {
                        $scope.Message = "操作成功";
                        $timeout(function () {
                            $modalInstance.close();
                            $window.location.href = '/login.html';
                        }, 500);
                    } else {
                        $scope.Message = response.Message;
                    }
                }).error(function (response) {
                $scope.Message = "服务器无响应！";
            });
        };
        //提交表单
        $scope.submitForm = function (retValid, oldPasswd, newPasswd, confirmPasswd) {
            $scope.Message = "";
            $scope.dirtyFlag = true;
            if (!retValid) {
                $scope.Message = "请确认格式正确！";
                return null;
            }
            if (oldPasswd === newPasswd) {
                $scope.Message = "新、旧密码不能相同！";
                return null;
            }
            if (confirmPasswd !== newPasswd) {
                $scope.Message = "确认密码不一致！";
                return null;
            }
            $scope.confirmChange(oldPasswd, newPasswd);
        };
        //取消表单
        $scope.cancelForm = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('changeStationCtrl', ['$scope', '$modalInstance', '$http', '$timeout', 'items', function ($scope, $modalInstance, $http, $timeout, items) {
        $scope.station = {};
        $scope.station = items;
        $scope.confirmSubmit = function (stationName, hotline) {
            $http.post('/dfapi?api=009', {
                'stationName': stationName,
                'hotline': hotline
            })
                .success(function (response) {
                    if (response.Result === 'success') {
                        $scope.Message = "操作成功";
                        $timeout(function () {
                            $modalInstance.close();
                        }, 500);
                    } else {
                        $scope.Message = response.Message;
                    }
                }).error(function (response) {
                $scope.Message = "服务器无响应！";
            });
        };
        //提交表单
        $scope.submitForm = function (retValid, stationName, hotline) {
            $scope.Message = "";
            $scope.dirtyFlag = true;
            if (!retValid) {
                $scope.Message = "请确认格式正确！";
                return null;
            }
            $scope.confirmSubmit(stationName, hotline);
        };
        //取消表单
        $scope.cancelForm = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('LangController', ['$scope', 'settings', 'localize', function ($scope, settings, localize) {
        $scope.languages = settings.languages;
        $scope.currentLang = settings.currentLang;
        $scope.setLang = function (lang) {
            settings.currentLang = lang;
            $scope.currentLang = lang;
            localize.setLang(lang);
        };
        // set the default language
        $scope.setLang($scope.currentLang);
    }])
;
