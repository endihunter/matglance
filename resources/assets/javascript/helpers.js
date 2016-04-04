/**
 * @param {Scope} scope
 * @param {Function} callback
 */
angular.safeApply = function (scope, callback) {
    scope[(scope.$$phase || scope.$root.$$phase) ? '$eval' : '$apply'](callback || function() {});
};

angular.isMobile = (function(a)
{
    return /((iP([oa]+d|(hone)))|Android|WebOS|BlackBerry|windows (ce|phone))/i.test(a);
})(navigator.userAgent||navigator.vendor||window.opera);

angular.isOnline = function isOnline()
{
    var isOnline = (window.navigator && window.navigator.onLine);
    console.log("Online", isOnline);

    return isOnline;
};