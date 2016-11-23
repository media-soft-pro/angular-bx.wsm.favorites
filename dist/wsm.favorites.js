(function(window, angular) {

    'use strict';

    var ngWsmFavorites = angular.module('ngWsmFavorites', ['ng']);

    ngWsmFavorites.factory('$ngWsmFavorites', function($http){

        function inherit(parent, extra) {
            return angular.extend(Object.create(parent), extra);
        }

        var _factory = this,
            onChangeCallback = {},
            onLoadCallback = [],
            fav = [],
            fav_checked = [],
            ajax_path = '/bitrix/tools/wsm.favorites/action.php';

        _factory.onLoad = function (callback) {
		
			if(typeof callback != 'function')
                return false;
			
			onLoadCallback.push(callback);
		}
		
        _factory.onChange = function (id, callback) {

            if(typeof callback != 'function')
                return false;

            fav.push(id);

            onChangeCallback[id] = callback;

            if(fav_checked.length > 0 && fav_checked.indexOf(id) > -1)
                onChangeCallback[id](true);
        }
		
		var runLoadCallback = function(data){
			for(var t in onLoadCallback)
				onLoadCallback[t](data);
		}

        _factory.setFav = function (id, in_fav) {

            var data = {
                'action': 'add',
                'id': id
            };

            $http({
                method: 'POST',
                url: ajax_path,
                responseType: 'json',
                data: data,
            }).
            success(function (res, status, headers, config) {

                if (res.success) {

                    if(typeof onChangeCallback[id] == 'function')
                        onChangeCallback[id](res.checked);

                } else {
                    console.warn(res);
                }

            }).
            error(function (data, status, headers, config) {
                console.error('err =========================== (', data);
                fav = {};
            });

        }

        function loadFav() {

            var data = {
                'action': 'check',
                'elements': fav
                };

            $http({
                method: 'POST',
                url: ajax_path,
                responseType: 'json',
                data: data,
            }).
            success(function (res, status, headers, config) {

                if (res.success) {

                    fav_checked = typeof res.elements == 'object' && res.elements !== null ? res.elements : [];

                    console.log('fav_checked: ', fav_checked);

                    for(var i in fav){

                        var id = fav[i];
                        if(typeof onChangeCallback[id] == 'function')
                            onChangeCallback[id](fav_checked.length > 0 && fav_checked.indexOf(id) > -1);
                    }

					runLoadCallback(res);

                } else {
                    console.warn(res);
                }

            }).
            error(function (data, status, headers, config) {
                console.error('err =========================== (', data);
                fav = {};
            });

        }

        _factory.reload = function () {
            loadFav();
        }

        loadFav();

        return _factory;
    });

    ngWsmFavorites.directive('wsmFavorite', ['$ngWsmFavorites', function($ngWsmFavorites) {

        console.info('init directive ... favorite');

        return {
            scope: {
                favoriteId:'@',
                favoriteClass:'@',
            },
            link: function($scope, $elm, attrs, ctrl) {

                if(typeof $scope.favoriteId != 'string' || parseInt(typeof $scope.favoriteId) < 1)
                {
                    console.warn('not set favoriteId');
                    return;
                }

                if(typeof $scope.favoriteClass == 'undefined' || $scope.favoriteClass == '')
                    $scope.favoriteClass = 'active';

                $ngWsmFavorites.onChange($scope.favoriteId, function (selected) {

                    console.log('onChange fav, selected = ', selected, $scope.favoriteClass);

                    if(selected)
                        $elm.addClass($scope.favoriteClass);
                    else
                        $elm.removeClass($scope.favoriteClass);

                    });

                $elm.bind('click', function () {
                    $ngWsmFavorites.setFav($scope.favoriteId, !$elm.hasClass($scope.favoriteClass));
                    });
            }
        };
    }]);

	ngWsmFavorites.directive('wsmFavoriteTotal', ['$ngWsmFavorites', function($ngWsmFavorites) {

        console.info('init directive ... favorite total');

        return {
            scope: {
                
            },
            link: function($scope, $elm, attrs, ctrl) {

                $ngWsmFavorites.onLoad(function (total) {

                    console.log('onLoad fav, selected = ', total);

                    // TODO set total

                    });
            }
        };
    }]);

})(window, window.angular);