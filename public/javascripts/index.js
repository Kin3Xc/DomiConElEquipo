var app = angular.module('DomisilApp', []);

app.controller('cotizadorController', ['$scope', function($scope){
	$scope.ver = false;

	//Funcion para mostrar el mapa al hacer clic en Cotizar
	$scope.mostrarInfo = function(){
	  $scope.ver = true;
	  var geocoder;
	  var map;	
	  var directionsDisplay;
	  var directionsService;
	  var originMarker;
	  var destinyMarker;

	  var total;

	  geocoder = new google.maps.Geocoder();
	  directionsService = new google.maps.DirectionsService();
	  directionsDisplay = new google.maps.DirectionsRenderer();
      
      var mapOptions = {
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

      $scope.map = map;
      // if(navigator.geolocation) {
      //     navigator.geolocation.getCurrentPosition(function(position) {
      //         var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)

      //         $scope.map.setCenter(pos);

              //Set myLocation Pin
              //var marker = new google.maps.Marker({
                  //position: pos,
                  //map: $scope.map,
                  //ººººººººººººººººtitle: 'Mi ubicación',
                  //icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      //         });

      //     }), function(error){
      //       console.log('Unable to get location: ' + error.message);
      //     };
      // }


      var address = document.getElementById('origen').value;
	  	geocoder.geocode( { 'address': address}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	      map.setCenter(results[0].geometry.location);
	      originMarker = new google.maps.Marker({
	          map: map,
	          position: results[0].geometry.location
	      });
	    } else {
	      console.log('Geocode was not successful for the following reason: ' + status);
	    }
	  });

	  var address2 = document.getElementById('destino').value;
	  	geocoder.geocode( { 'address': address2}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	      map.setCenter(results[0].geometry.location);
	      destinyMarker = new google.maps.Marker({
	          map: map,
	          position: results[0].geometry.location
	      });
	    } else {
	      console.log('Geocode was not successful for the following reason: ' + status);
	    }
	  });	

		var request = {
			origin:address,
			destination:address2,
			travelMode: google.maps.TravelMode.DRIVING
		};

		directionsService.route(request, function(response, status) {
			originMarker.setMap(null);
			destinyMarker.setMap(null);
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setMap(map);
				directionsDisplay.setDirections(response);

				total = 0;
				var myroute = directionsDisplay.directions.routes[0];
				for (i = 0; i < myroute.legs.length; i++) {
				    total += myroute.legs[i].distance.value;
				}
				total = total / 1000;
				//var distancia = response.routes[0].legs[0].distance.value / 1000;
				var tiempo =response.routes[0].legs[0].duration.text;
				console.log(total);

				
			}
		});
	};

}]);
