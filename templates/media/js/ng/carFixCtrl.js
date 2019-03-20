angular.module('app.controllers')
    .controller('carFixCtrl', ['$scope', '$rootScope', '$http', '$modal', '$timeout', '$filter', '$window', '$location', function ($scope, $rootScope, $http, $modal, $timeout, $filter, $window, $location) {
        $scope.carFixIDN = "";
        $scope.searchItemList = ["", "", ""];
        $scope.searchTypeList = ["车牌", "底盘号", "车主"];
        //监控查询类型变化
        $scope.$watch('searchType', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.searchType = Number($scope.searchType);
                $scope.searchTip = $scope.searchTypeList[$scope.searchType];
            }
        });
        //清空选中item状态
        $scope.clearSelectedItem = function () {
            $scope.carFixActiveItem = {};   //清空被选中item
            $scope.currentActiveStatus = false;   //未激活状态
            $scope.currentActiveIndex = null;    //清空被选中item索引
            $scope.searchItemList = ["", "", ""];
            $scope.searchItemList[$scope.searchType] = $scope.keyword;
        };
        //获取车辆维修列表
        $scope.queryCarFixList = function () {
            $scope.carFixList = $filter('fillArray')([], $scope.rows);
            $scope.clearSelectedItem();
            var day_start = $scope.dayStart;
            var day_end = $scope.dayEnd;
            if ($scope.keyword) {
                day_start = null;
                day_end = null;
            }
            $http.get('/df/v2/api/car_fix', {
                params: {
                    "page": $scope.page,
                    "rows": $scope.rows,
                    "day_start": day_start,
                    "day_end": day_end,
                    "search": $scope.searchItemList[1] + $scope.searchItemList[2] + $scope.searchItemList[0]
                }
            })
                .success(function (response) {
                    $scope.carFixList = $filter('fillArray')(response.results, $scope.rows);
                    $scope.totalItems = response.count;
                    if (response.results.length === 0 && $scope.page !== 1) {
                        $scope.page = $scope.page - 1;
                        $scope.lastPage = $scope.page;
                        $scope.queryCarFixList();
                    }
                });
        };
        //查询
        $scope.searchCarFix = function () {
            $scope.page = 1;
            $scope.lastPage = 1;
            $scope.queryCarFixList();
        };
        //回车查询
        $scope.keydown = function ($event) {
            if ($event.keyCode === 13) {
                $scope.searchCarFix();
            }
        };
        //点击item操作
        $scope.toggleActive = function (index) {
            //点击已选中item
            if ($scope.currentActiveIndex === index) {
                $scope.currentActiveIndex = null;
                $scope.currentActiveStatus = !$scope.currentActiveStatus;
                $scope.carFixList[index].active = !$scope.carFixList[index].active;
                $scope.carFixActiveItem = {};
                return null;
            }
            //已有选中item，点击未选中item
            if (typeof $scope.currentActiveIndex === 'number') {
                $scope.carFixList[$scope.currentActiveIndex].active = false;
            }
            if (!$scope.carFixList[index].id) {
                $scope.currentActiveIndex = null;
                $scope.currentActiveStatus = false;
                $scope.carFixActiveItem = {};
                return false;
            }
            $scope.currentActiveStatus = true;
            $scope.currentActiveIndex = index;
            $scope.carFixList[index].active = true;
            $scope.carFixActiveItem = $scope.carFixList[index];
        };
        $scope.showAccDetail = function () {
            $scope.items = {
                'sum': $scope.sum,
                'fixAccList': $scope.fixAccList
            };
            var modalInstance = $modal.open({
                //size: 'sm',
                //backdrop: 'static',
                templateUrl: 'accDetail.html',
                controller: 'accDetailCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                if ($scope.opType === "add") {
                    $scope.page = 1;
                    $scope.lastPage = 1;
                }
                $scope.queryCarFixList();
            }, function () {
                console.log('cancel CarFix operation');
            });
        };
        //查询更换配件详情
        $scope.checkAccDetail = function (index) {
            $scope.accPage = 1;
            $scope.lastPageSub = 1;
            $scope.accRows = 8;
            $scope.carFixID = $scope.carFixList[index].id;
            $scope.getFixAcc(true);//获取更换配件列表
        };
        //分页
        $scope.pagination = function (page) {
            if ($scope.lastPage !== page) {
                $scope.page = page;
                $scope.lastPage = page;
                $scope.queryCarFixList();
            }
        };
        /******************************************** 新增、编辑车辆操作 ******************************************/
        //配件列表参数初始化
        $scope.initCarAcc = function () {
            $scope.accPage = 1;
            $scope.lastPageSub = 1;
            $scope.accRows = 5;
            $scope.accTotalItems = 0;
            $scope.carFixDate = document.getElementById('carFixDate');
            $scope.carBuyDate = document.getElementById('carBuyDate');
            $scope.carProDate = document.getElementById('carProDate');
        };
        //查询配件列表
        $scope.queryAccList = function () {
            $http.get('/df/v2/api/acc', {
                params: {
                    "page": 1,
                    "rows": 10000
                }
            })
                .success(function (response) {
                    $scope.accList = response.results;
                    $timeout(function () {
                        $('#searchable-select').remove();
                        $('#accSelect').searchableSelect();
                    }, 500);
                });
        };
        //填充车辆信息
        $scope.fillCarInfo = function (carInfo) {
            if (carInfo.sn) {
                $scope.carFixInfo.carIDNumber = carInfo.sn;
            }
            $scope.carFixInfo.carNumber = carInfo.number;
            $scope.carFixInfo.carType = carInfo.type;
            //$scope.carFixInfo.carBuyDate = carInfo.carBuyDate;
            //$scope.carFixInfo.carProDate = carInfo.carProDate;
            $scope.carBuyDate.value = carInfo.buy_date;
            $scope.carProDate.value = carInfo.pro_date;
            $scope.carFixInfo.carOwner = carInfo.owner;
            $scope.carFixInfo.carTel = carInfo.tel;
        };
        //获取人员列表
        $scope.getEmployee = function () {
            $scope.employeeList = [];
            $http.get('/df/v2/api/employee/')
                .success(function (response) {
                    $scope.raw_employee_list = response;
                    $scope.employeeList = response.results;
                    // $scope.employeeList = response.results.map(function (item) {
                    //     return item.name;
                    // });
                })
                .error(function (response) {
                    $scope.tipColor = "#C46A69";
                    $scope.retMessage = "服务器无响应，请稍后重试！";
                    $scope.showRetMsg();
                });
        };
        //新增时匹配车辆信息（自动填充）
        $scope.matchCarInfo = function (carIDNumber) {
            if (!$scope.keyword) {
                $scope.collapseTwoFlag = true;
                return
            }
            var tmp = null;
            if (carIDNumber) {
                tmp = carIDNumber
            }
            $scope.searchItemList = ["", "", ""];
            $scope.searchItemList[$scope.searchType] = $scope.keyword;
            console.log($scope.keyword);
            $http.get('/df/v2/api/car_info/', {
                params: {
                    "search": $scope.keyword || tmp
                }
            })
                .success(function (response) {
                    if (response.results.length === 0) {  //无匹配信息
                        $scope.tipColor = "#3A5BDD";
                        $scope.carBuyDate.value = "";
                        $scope.carProDate.value = "";
                        $scope.retMessage = "无匹配信息";
                        $scope.collapseTwoFlag = true;
                    } else if (response.results.length === 1) {  //匹配到唯一信息
                        $scope.tipColor = "#739E73";
                        $scope.fillCarInfo(response.results[0]);
                        $scope.retMessage = "匹配车辆成功";
                        $scope.collapseTwoFlag = true;
                    } else {                       //匹配到多条信息
                        $scope.tipColor = "#eaaf33";
                        $scope.retMessage = "匹配到多条车辆信息，请输入完整的关键字";
                        $scope.collapseTwoFlag = false;
                    }
                    $scope.showRetMsg();
                })
                .error(function (response) {
                    $scope.tipColor = "#C46A69";
                    $scope.retMessage = "服务器无响应，请稍后重试！";
                    $scope.showRetMsg();
                });
        };
        //初始化新增页数据
        $scope.initAddCarFix = function () {
            $scope.opType = "add";
            $scope.opTitle = "新增车辆信息";
            $scope.Message = "请先填写车辆信息，然后点击下一步，再填写配件信息";
            $scope.sum = 0;
            $scope.carFixID = -1;
            $scope.carFixIDN = "";
            $scope.carFixInfo = {};
            $scope.carFixInfo.carFixIncome = 0;
            $scope.matchCarInfo();
            $scope.getEmployee();
            $scope.carFixDate.value = new Date().Format("yyyy-MM-dd");
            $scope.carBuyDate.value = "2000-01-01";
            $scope.carProDate.value = "2000-01-01";
            $scope.fixAccList = $filter('fillArray')([], $scope.accRows);
        };
        //新增操作
        $scope.addCarFix = function () {
            $scope.initCarAcc();
            $scope.initAddCarFix();
        };
        //初始化编辑页数据
        $scope.initEditCarFix = function () {
            fix_man_name = '';
            if ($scope.carFixActiveItem.fix_man) {
                fix_man_name = $scope.carFixActiveItem.fix_man
            }
            $scope.opType = "edit";
            $scope.opTitle = "编辑车辆信息";
            $scope.carFixID = $scope.carFixActiveItem.id;
            $scope.carFixIDN = $scope.carFixActiveItem.id;
            $scope.carFixInfo = {};
            $scope.carFixDate.value = $scope.carFixActiveItem.date;
            $scope.carFixInfo.carFixODO = $scope.carFixActiveItem.odo;
            $scope.carFixInfo.carFixMan = fix_man_name;
            $scope.carFixInfo.carFixIncome = $scope.carFixActiveItem.income;
            $scope.carFixInfo.carFixRemark = $scope.carFixActiveItem.remark;
            $scope.carFixInfo.carIDNumber = $scope.carFixActiveItem.car_detail.sn;
            $scope.carFixInfo.carNumber = $scope.carFixActiveItem.car_detail.number;
            $scope.carFixInfo.carType = $scope.carFixActiveItem.car_detail.type;
            $scope.carBuyDate.value = $scope.carFixActiveItem.car_detail.buy_date;
            $scope.carProDate.value = $scope.carFixActiveItem.car_detail.pro_date;
            $scope.carFixInfo.carFixMaintain = $scope.carFixActiveItem.maintain;
            $scope.carFixInfo.carOwner = $scope.carFixActiveItem.car_detail.owner;
            $scope.carFixInfo.carTel = $scope.carFixActiveItem.car_detail.tel;
            $scope.carFixInfo.carFixLogging = $scope.carFixActiveItem.logging;
            $scope.getEmployee();
        };
        //编辑操作
        $scope.editCarFix = function () {
            $scope.collapseTwoFlag = true;
            $scope.initCarAcc();
            $scope.initEditCarFix();
            $scope.getFixAcc(false);//获取更换配件列表
        };
        //提交保存
        $scope.submitInfo = function () {
            $scope.save_car_info("edit");
        };
        $scope.upd_car_fix = function (car) {
            if ($scope.carFixInfo.carFixMaintain) {
                $scope.carFixMaintain = 1;
            } else {
                $scope.carFixMaintain = 0;
            }
            if ($scope.carFixInfo.carFixLogging) {
                $scope.carFixLogging = 1;
            } else {
                $scope.carFixLogging = 0;
            }
            $http.put('/df/v2/api/car_fix/' + $scope.carFixIDN + '/', {
                car: car.id,
                date: $scope.carFixDate.value,
                odo: $scope.carFixInfo.carFixODO,
                fix_man: $scope.carFixInfo.carFixMan,
                income: $scope.carFixInfo.carFixIncome,
                remark: $scope.carFixInfo.carFixRemark,
                maintain: $scope.carFixMaintain,
                logging: $scope.carFixLogging
            })
                .success(function (response) {
                    $scope.collapseTwoFlag = false;
                    $scope.queryCarFixList();
                    $scope.Message = "";
                })
                .error(function (response) {
                    $scope.tipColor = "#C46A69";
                    for (var key in response) {
                        $scope.retMessage = response[key];
                        break
                    }
                    $scope.showRetMsg();
                });
        };
        $scope.save_car_info = function (type) {
            $http.post('/df/v2/api/car_info/', {
                sn: $scope.carFixInfo.carIDNumber,
                number: $scope.carFixInfo.carNumber,
                type: $scope.carFixInfo.carType,
                buy_date: $scope.carBuyDate.value,
                pro_date: $scope.carProDate.value,
                owner: $scope.carFixInfo.carOwner,
                tel: $scope.carFixInfo.carTel,
            })
                .success(function (response) {
                    if (type === 'add') {
                        $scope.save_car_fix(response);
                    } else {
                        $scope.upd_car_fix(response);
                    }
                })
                .error(function (response) {
                    $scope.tipColor = "#C46A69";
                    for (var key in response) {
                        $scope.retMessage = response[key];
                        break
                    }
                    $scope.showRetMsg();
                });
        };
        $scope.save_car_fix = function (car) {
            $http.post('/df/v2/api/car_fix/', {
                car: car.id,
                date: $scope.carFixDate.value,
                reg_time: new Date().Format("hh:mm:ss"),
                odo: $scope.carFixInfo.carFixODO,
                fix_man: $scope.carFixInfo.carFixMan,
                income: $scope.carFixInfo.carFixIncome,
                remark: $scope.carFixInfo.carFixRemark,
                maintain: $scope.carFixMaintain,
                logging: $scope.carFixLogging
            })
                .success(function (response) {
                    //成功后跳转到配件页面
                    $scope.carFixIDN = response.id;
                    $scope.Message = "";
                })
                .error(function (response) {
                    $scope.tipColor = "#C46A69";
                    for (var key in response) {
                        $scope.retMessage = response[key];
                        break
                    }
                    $scope.showRetMsg();
                });
        };
        //提交保存
        $scope.submitCarInfo = function () {
            $scope.save_car_info("add");
        };
        //查询操作
        $scope.getCarInfo = function () {
            $http.get('/df/v2/platform/car_info/', {
                params: {
                    "VIN": $scope.carFixInfo.carIDNumber
                }
            })
                .success(function (response) {
                    console.log(response)
                    if (response.result === 'failed') {
                        $scope.tipColor = "#C46A69";
                        $scope.retMessage = response.message;
                        $scope.showRetMsg();
                    }
                    if (response.result === 'success') {
                        $scope.fillCarInfo(response.data);
                    }
                })
                .error(function (response) {
                    $scope.tipColor = "#C46A69";
                    for (var key in response) {
                        $scope.retMessage = response[key];
                        break
                    }
                    $scope.showRetMsg();
                });
        };
        //取消操作
        $scope.cancelInfoForm = function () {
            $scope.collapseTwoFlag = false;
        };
        //保存操作
        $scope.submitInfoForm = function (retValid) {
            $scope.dirtyFlag = true;
            if (!retValid) {
                $scope.Message = "请确认输入格式正确！";
                return null;
            }
            $scope.submitInfo();
        };
        //保存car操作
        $scope.submitCarInfoForm = function (retValid) {
            $scope.dirtyFlag = true;
            if (!retValid) {
                $scope.Message = "请确认输入格式正确！";
                return null;
            }
            $scope.submitCarInfo();
        };
        /******************************************** 删除车辆操作 ******************************************/
        //删除结果处理
        $scope.showRetMsg = function () {
            $.smallBox({
                title: "操作结果",
                content: $scope.retMessage + "<p class='text-align-right'><a href='javascript:void(0);' class='btn btn-primary btn-sm'>确定</a></p>",
                color: $scope.tipColor,
                timeout: 2000,
                icon: "fa fa-bell swing animated"
            });
        };
        //确认删除
        $scope.delCarFixConfirm = function () {
            $http.delete('/df/v2/api/car_fix/' + $scope.carFixActiveItem.id + '/')
                .success(function (response) {
                    $scope.retMessage = "操作成功";
                    $scope.tipColor = "#739E73";
                    $scope.showRetMsg();
                    $scope.getFixAcc(false);
                    $scope.queryCarFixList();
                })
                .error(function (response) {
                    $scope.tipColor = "#C46A69";
                    for (var key in response) {
                        $scope.retMessage = response[key];
                        break
                    }
                    $scope.showRetMsg();
                });
        };
        //删除操作
        $scope.delCarFix = function () {
            if (confirm("确定要删除该条维修记录吗？")) {
                $scope.delCarFixConfirm();
            }
        };
        /******************************************** 打印车辆记录操作 ******************************************/
        //打印操作
        $scope.printCarFix = function () {
            window.open('/df/v2/platform/sum/' + $scope.carFixActiveItem.id + '/');
        };
        //总结操作
        $scope.printReport = function () {
            window.open('/df/v2/platform/daily_report?day_start=' + $scope.dayStart + '&day_end=' + $scope.dayEnd);
        };
        /******************************************** 配件操作 ******************************************/
        //清空选中配件状态
        $scope.clearAccSelectedItem = function () {
            $scope.accActiveItem = {};   //清空被选中item
            $scope.currentAccActiveStatus = false;   //未激活状态
            $scope.currentAccActiveIndex = null;    //清空被选中item索引
        };
        //获取更换配件列表
        $scope.getFixAcc = function (flag) {
            if (flag) {
                var row = 5;
                $scope.carFixIDN = '';
            } else {
                var row = $scope.accRows;
            }
            $scope.clearAccSelectedItem();
            $http.get('/df/v2/api/fix_acc/', {
                params: {
                    "car_fix_id": $scope.carFixIDN || $scope.carFixID,
                    "page": $scope.accPage,
                    "rows": row,
                }
            })
                .success(function (response) {

                    console.log($scope.raw_employee_list);
                    $scope.fixAccList = $filter('fillArray')(response.results, $scope.accRows);
                    $scope.accTotalItems = response.count;
                    if (response.results.length === 0 && $scope.accPage !== 1) {
                        $scope.accPage = $scope.accPage - 1;
                        $scope.lastPageSub = $scope.accPage;
                        $scope.getFixAcc(false);
                    }
                    var sum = 0;
                    for (var i=0;i<response.results.length;i++) {
                        var item = response.results[i];
                        if (!item.guarantee) {
                            sum += item.price * item.usage;
                        }
                    }
                    $scope.sum = sum;
                    if (flag) {
                        $scope.fixAccList = response.results;
                        $scope.showAccDetail();
                    }
                });
        };
        //更换配件分页
        $scope.accPagination = function (page) {
            if ($scope.lastPageSub !== page) {
                $scope.accPage = page;
                $scope.lastPageSub = page;
                $scope.getFixAcc(false);
            }
        };
        //点击配件操作
        $scope.toggleAccActive = function (index) {
            //点击已选中item
            if ($scope.currentAccActiveIndex === index) {
                $scope.currentAccActiveIndex = null;
                $scope.currentAccActiveStatus = !$scope.currentAccActiveStatus;
                $scope.fixAccList[index].active = !$scope.fixAccList[index].active;
                $scope.accActiveItem = {};
                return null;
            }
            //已有选中item，点击未选中item
            if (typeof $scope.currentAccActiveIndex === 'number') {
                $scope.fixAccList[$scope.currentAccActiveIndex].active = false;
            }
            if (!$scope.fixAccList[index].fix) {
                $scope.currentAccActiveIndex = null;
                $scope.currentAccActiveStatus = false;
                $scope.accActiveItem = {};
                return false;
            }
            $scope.currentAccActiveStatus = true;
            $scope.currentAccActiveIndex = index;
            $scope.fixAccList[index].active = true;
            $scope.accActiveItem = $scope.fixAccList[index];
        };
        //新增配件
        $scope.addFixAcc = function () {
            $http.post('/df/v2/api/fix_acc/', {
                fix: $scope.carFixIDN,
                sn: localStorage.accKey,
            })
                .success(function (response) {
                    $scope.accPage = 1;
                    $scope.getFixAcc(false);
                })
                .error(function (response) {
                    $scope.tipColor = "#C46A69";
                    for (var key in response) {
                        $scope.retMessage = response[key];
                        break
                    }
                    $scope.showRetMsg();
                });

        };
        //编辑配件
        $scope.editFixAcc = function () {
            $scope.items = {
                'accItem': $scope.accActiveItem,
                'raw_employee_list': $scope.raw_employee_list
            };
            var modalInstance = $modal.open({
                //size: 'sm',
                backdrop: 'static',
                templateUrl: 'accEdit.html',
                controller: 'accEditCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.getFixAcc(false);
            }, function () {
                $scope.getFixAcc(false);
                console.log('cancel editFixAcc operation');
            });
        };
        //确认删除
        $scope.delFixAccConfirm = function () {
            $http.delete('/df/v2/api/fix_acc/' + $scope.accActiveItem.id + '/?car_fix_id=' + $scope.accActiveItem.fix)
                .success(function (response) {
                    $scope.retMessage = "操作成功";
                    $scope.tipColor = "#739E73";
                    $scope.showRetMsg();
                    $scope.getFixAcc(false);
                })
                .error(function (response) {
                    $scope.tipColor = "#C46A69";
                    for (var key in response) {
                        $scope.retMessage = response[key];
                        break
                    }
                    $scope.showRetMsg();
                });
        };
        //删除配件
        $scope.delFixAcc = function () {
            if (confirm("确定要删除该条配件信息吗？")) {
                $scope.delFixAccConfirm();
            }
        };
        /********************************************************扫描配件操作**************************************/
        //获取扫描件列表
        $scope.scanFixAcc = function () {
            $http.get('/df/v2/api/car_fix/', {
                params: {
                    "api": 305
                }
            })
                .success(function (response) {
                    $scope.scanList = response.scanList.map(function (item, index) {
                        item.checked = false;
                        return item;
                    });
                    console.log($scope.scanList);
                    $scope.showScanList();
                });
        };
        //打开扫描配件列表框
        $scope.showScanList = function () {
            $scope.items = {
                'scanList': $scope.scanList
            };
            var modalInstance = $modal.open({
                //size: 'sm',
                backdrop: 'static',
                templateUrl: 'accScan.html',
                controller: 'accScanCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                console.log(selectedItem);
                if (selectedItem.type === '0') {
                    for (var i = 0; i < selectedItem.list.length; i++) {
                        $http.post('/df/v2/api/car_fix/?api=302', {
                            carFixID: $scope.carFixID,
                            carAccPID: selectedItem.PIDlist[i],
                            carAccIDNumber: selectedItem.list[i]
                        })
                            .success(function (response) {
                                if (i === selectedItem.list.length) {
                                    $scope.getFixAcc(false);//获取更换配件列表
                                }
                                console.log(response);
                            }).error(function (response) {
                            $scope.Message = "服务器无响应，请稍后重试！";
                            console.log(response.errorMsg);
                        });
                    }

                }
                $http.post('/df/v2/api/car_fix/?api=307', {
                    IDList: selectedItem.IDlist
                })
                    .success(function (response) {
                        console.log(response);
                    }).error(function (response) {
                    $scope.Message = "服务器无响应，请稍后重试！";
                    console.log(response.errorMsg);
                });
            }, function () {
                console.log('cancel CarFix operation');
            });
        };
        /******************************************** 初始化操作 ******************************************/
        //初始化
        $scope.init = function () {
            $scope.page = 1;
            $scope.lastPage = 1;
            $scope.rows = 8;
            $scope.totalItems = 0;
            $scope.keyword = "";
            $scope.searchType = 0;
            $scope.collapseTwoFlag = false;
            $scope.dayStart = new Date().Format("yyyy-MM-dd");
            $scope.dayEnd = new Date().Format("yyyy-MM-dd");
            $scope.searchTip = $scope.searchTypeList[0];
            $scope.queryCarFixList();
            $scope.queryAccList();
        };
        $scope.init();
    }
    ])
    .controller('accDetailCtrl', ['$scope', '$modalInstance', '$http', '$timeout', 'items', function ($scope, $modalInstance, $http, $timeout, items) {
        $scope.items = items;
        $scope.confirmDetail = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('accScanCtrl', ['$scope', '$modalInstance', '$http', '$timeout', 'items', function ($scope, $modalInstance, $http, $timeout, items) {
        //扫描配件列表
        $scope.scanAccList = items.scanList;

        function isRepeat(ary) {
            var s = ary.join(",") + ",";
            for (var i = 0; i < ary.length; i++) {
                if (s.replace(ary[i] + ",", "").indexOf(ary[i] + ",") > -1) {
                    $scope.Message = "重复勾选配件，件号：" + ary[i];
                    return true;
                }
            }
            return false;
        }

        //确认
        var IDList = [];
        var accIDList = [];
        var PIDlist = [];
        $scope.confirmScan = function () {
            for (var i = 0; i < $scope.scanAccList.length; i++) {
                if ($scope.scanAccList[i].checked) {
                    IDList.push($scope.scanAccList[i].id);
                    PIDlist.push($scope.scanAccList[i].accPID);
                    accIDList.push($scope.scanAccList[i].accIDNumber);
                }
            }
            if (IDList.length === 0) {
                $scope.Message = "请勾选配件进行导入";
                return null;
            }
            if (isRepeat(accIDList)) {
                return null;
            }
            $modalInstance.close({"type": "0", "list": accIDList, "IDlist": IDList, "PIDlist": PIDlist});
        };
        //删除
        $scope.delScan = function () {
            var IDList = [];
            for (var i = 0; i < $scope.scanAccList.length; i++) {
                if ($scope.scanAccList[i].checked) {
                    IDList.push($scope.scanAccList[i].id);
                }
            }
            console.log(IDList);
            if (IDList.length === 0) {
                $scope.Message = "请勾选配件进行删除";
                return null;
            }
            $modalInstance.close({"type": "1", "IDlist": IDList});
        };
        //取消表单
        $scope.cancelScan = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('accEditCtrl', ['$scope', '$modalInstance', '$http', '$timeout', 'items', function ($scope, $modalInstance, $http, $timeout, items) {
        $scope.items = items;
        $scope.accItem = items.accItem;
        $scope.employeeList = items.raw_employee_list.results;
        //编辑Acc
        $scope.editAccItem = function () {
            $http.put('/df/v2/api/fix_acc/' + items.accItem.id + '/', {
                car_fix_id: $scope.accItem.fix,
                fix: $scope.accItem.fix,
                name: $scope.accItem.name,
                sn: $scope.accItem.sn,
                type: $scope.accItem.type,
                price: $scope.accItem.price,
                usage: $scope.accItem.usage,
                guarantee: $scope.accItem.guarantee,
                fix_man: $scope.accItem.fix_man,
            })
                .success(function (response) {
                    $scope.Message = "操作成功";
                    $timeout(function () {
                        $modalInstance.close();
                    }, 500);
                }).error(function (response) {
                $scope.Message = "服务器无响应，请稍后重试！";
            });

        };
        //提交表单
        $scope.submitAccForm = function (retValid) {
            $scope.dirtyFlag = true;
            if (!retValid) {
                $scope.Message = "请确认输入格式正确！";
                return null;
            }
            $scope.editAccItem();
        };
        //取消表单
        $scope.cancelAccForm = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
