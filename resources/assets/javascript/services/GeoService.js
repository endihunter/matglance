app.factory('GeoService', ['$q', function ($q) {
    var factory = {
        lat: null,
        lng: null
    };

    factory.setLocation = function (lat, lng) {
        factory.lat = parseFloat(lat);
        factory.lng = parseFloat(lng);

        return factory;
    };

    factory.getLatitude = function () {
        return this.lat;
    };

    factory.getLongitude = function () {
        return this.lng;
    };

    /**
     * Locate the client by asking Navigator.GeoLocation.
     */
    factory.locate = function () {
        var defer = $q.defer();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                factory.setLocation(
                    position.coords.latitude,
                    position.coords.longitude
                );

                defer.resolve(factory);
            });
        } else {
            defer.reject('Geolocation is not supported.');
        }

        return defer.promise;
    };

    return factory;
}]);