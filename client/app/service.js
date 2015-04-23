angular.module('app.service', [])

.factory('Utility', ['$http', function ($http) {

  // Generates a view to display the restaurant image and link
  var renderView = function(i, places) {

    var description = '<div class="descriptionDiv">' +
      '<a href="'+places[i].url +'" target="_blank">' + '<h1 class="place-name">' + places[i].name + '</h1></a>' +
      '<div style="padding:5px;font-weight:bold;">' + 'Yelp Rating:&nbsp;&nbsp;' +
      '<img style="vertical-align:middle;" src="'+ places[i].rating_img_url +'"/>' + '</div>' +
      '<img src="'+ places[i].image_url +'"/>' +
      '<div class="snippet">' + places[i].snippet_text + '</div>' +
      '<a href="' + places[i].url +'" target="_blank"> Visit on Yelp</a>' +
      '</div>';
    return description;
  };

  // Opens an info window when the marker is clicked on
  var attachInstructionText = function(marker, text) {
    google.maps.event.addListener(marker, 'click', function() {
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  };

  // Use closure scope to ensure that newest zIndices are always on top
  var zIndex = 0;

  // Places each marker on the map
  var placemarkers = function(places, type, offsetDelay) {
    type = type || "spread";
    offsetDelay = offsetDelay || 0;

    // Let placemarkers work for a single place
    console.log('places', places, Array.isArray(places));
    if (!Array.isArray(places)) {
      places = [places];
    }

    for (var i = 0; i < places.length; i++) {
       setDelay(i, places);
    }

    // Sets s delay for dropping each marker
    function setDelay(i, places) {
      setTimeout(function() {
        var lat = places[i].location.coordinate.latitude;
        var lng = places[i].location.coordinate.longitude;
        var description = renderView(i, places);

        var marker = new google.maps.Marker({
          map: map,
          position: new google.maps.LatLng(lat,lng),
          animation: google.maps.Animation.DROP,
          icon: type === "spread" ? "images/smPinRed.png" : "images/smPinBlue.png",
          zIndex: zIndex++
        });

        // Sets the pop-up box for clicking a marker
        attachInstructionText(marker, description);
        if (type === "spread") {
          markerArraySpread.push(marker);
        } else {
          markerArrayTop.push(marker);
        }
      }, (i+offsetDelay) * 300);
    }
  };

  var sendMapData = function(routeObject){
    return $http.post('/search', routeObject)
      .then(function(response, error){
        return response;
      });
  };

  return {
    placemarkers: placemarkers,
    sendMapData: sendMapData
  };
}]);
