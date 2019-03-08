var smartApp = angular.module('smartApp', [
    'ngRoute',
    'ngCookies',
    //'ngAnimate', // this is buggy, jarviswidget will not work with ngAnimate :(
    'ui.bootstrap',
    'ui.datetimepicker',
    'plunker',
    'app.main',
    'app.controllers',
    'app.navigation',
    'app.localize',
    'app.activity',
    'app.smartui'
]);

smartApp.config(['$routeProvider', '$provide', '$httpProvider', function ($routeProvider, $provide, $httpProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/overview'
        })
        .when('/overview', {   // 概览
            templateUrl: function () {
                return 'media/views/overview.html';
            },
            controller: 'overviewCtrl'
        })
        .when('/accSearch', {  //配件查询
            templateUrl: function () {
                return 'media/views/accSearch.html';
            },
            controller: 'accSearchCtrl'
        })
        .when('/accManage', {   //配件管理
            templateUrl: function () {
                return 'media/views/accManage.html';
            },
            controller: 'accManageCtrl'
        })
        .when('/carFix', {  //车辆维修
            templateUrl: function () {
                return 'media/views/carFix.html';
            },
            controller: 'carFixCtrl'
        })
        .when('/carInfo', {   //车辆信息
            templateUrl: function () {
                return 'media/views/carInfo.html';
            },
            controller: 'carInfoCtrl'
        })
        .when('/finance', {   // 数据--财务信息
            templateUrl: function () {
                return 'media/views/finance.html';
            },
            controller: 'financeCtrl'
        })
        .when('/employee', {   // 数据--员工信息
            templateUrl: function () {
                return 'media/views/employee.html';
            },
            controller: 'employeeCtrl'
        })
        .when('/accUsage', {   // 数据--配件用量
            templateUrl: function () {
                return 'media/views/accUsage.html';
            },
            controller: 'accUsageCtrl'
        })
        .when('/port', {   // 数据--导入导出
            templateUrl: function () {
                return 'media/views/port.html';
            },
            controller: 'portCtrl'
        })
        .when('/dashboard', {   // 报表--总览
            templateUrl: function () {
                return 'media/views/dashboard.html';
            },
            controller: 'dashboardCtrl'
        })
        .when('/userManage', {   // 报表--总览
            templateUrl: function () {
                return 'media/views/userManage.html';
            },
            controller: 'userManageCtrl'
        })
        .when('/test', {   // 报表--总览
            templateUrl: function () {
                return 'media/views/test.html';
            },
            controller: 'testCtrl'
        })
        .when('/test1', {   // 报表--总览
            templateUrl: function () {
                return 'media/views/test1.html';
            }
        })
        .otherwise({
            redirectTo: '/carFix'
        })
    ;

    $httpProvider.interceptors.push(['$window', function ($window) {
        return {
            'request': function (config) {
                config.headers.Authorization = `token ${localStorage.JWT_TOKEN}`;
                return config;
            },
            'requestError': function (rejection) {
                return $q.reject(rejection);
            },
            'response': function (response) {
                if (response.data.Result && response.data.Result === 'CheckIDFailed') {
                    alert("该账户已在异地登录！");
                    $window.location.href = '/login.html';
                }
                return response;
            }
        }
    }]);
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    // with this, you can use $log('Message') same as $log.info('Message');
    $provide.decorator('$log', function ($delegate) {
        // create a new function to be returned below as the $log service (instead of the $delegate)
        function logger() {
            // if $log fn is called directly, default to "info" message
            logger.info.apply(logger, arguments);
        }

        // add all the $log props into our new logger fn
        angular.extend(logger, $delegate);
        return logger;
    });

}]);

