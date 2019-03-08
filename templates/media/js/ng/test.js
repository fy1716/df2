angular.module('app.controllers')
	.controller('testCtrl', ['$scope', '$rootScope', '$http', '$filter', '$timeout', '$cookies', function($scope, $rootScope, $http, $filter, $timeout, $cookies) {
            $http.post('/v1/', {
                UserName: "admin-fy",
                Password: "eisoo.com",
                LoginType: 0,
                Agent: '1e3f69d4eb7dde90826b104fe1e99e9a',
                ValidateCode: "sadw",
                RequestINFO: "127c541ee3abe52558ecb3a99fd4327b"
            })
            .success(function(response) {
                console.log(response);
                alert("success");
            })
            .error(function(response) {
                console.log(response);
                alert("fail");
            });
}]);


