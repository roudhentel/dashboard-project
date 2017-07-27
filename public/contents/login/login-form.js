mainApp.controller("loginFormCtrl", function ($scope, $http, $state) {
    let s = $scope;
    s.login = {
        username: "",
        password: ""
    };

    s.loadingFlag = false;

    s.login = function (e, isFormValid) {
        if (!isFormValid) return;

        s.loadingFlag = true;
        $http({
            method: "POST",
            url: "/api/user/authenticate",
            data: {
                username: s.login.username
            }
        }).then(function (res) {
            if (res.data.success) {
                s.gbl.groups = res.data.groups;

                $state.go('home');
            }
            s.loadingFlag = true;
        }, function (err) {
            console.log(err);
            s.loadingFlag = true;
        });
    };
});