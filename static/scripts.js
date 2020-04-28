// Google Map
var map

// markers for map
var markers = []

// info window
var info

// execute when the DOM is fully loaded
$(function () {
  // styles for map
  // https://developers.google.com/maps/documentation/javascript/styling
  var styles = [
    // hide Google's labels
    {
      featureType: 'all',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },

    // hide roads
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ visibility: 'off' }],
    },
  ]

  // options for map
  // https://developers.google.com/maps/documentation/javascript/reference#MapOptions
  var options = {
    center: { lat: 52.0666, lng: 19.478 }, // Piątek, Polska
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    maxZoom: 14,
    panControl: true,
    styles: styles,
    zoom: 7,
    zoomControl: true,
  }

  // get DOM node in which map will be instantiated
  var canvas = $('#map-canvas').get(0)

  // instantiate map
  map = new google.maps.Map(canvas, options)

  info = new google.maps.InfoWindow()

  // configure UI once Google Map is idle (i.e., loaded)
  map.addListener('idle', configure)
})

/**
 * Configures application.
 */
function configure() {
  // update UI after map has been dragged
  map.addListener('dragend', function () {
    // if info window isn't open
    // http://stackoverflow.com/a/12410385
    if (!info.getMap || !info.getMap()) {
      update()
    }
  })

  // update UI after zoom level changes
  map.addListener('zoom_changed', function () {
    update()
  })

  //    '<div>' + '{{place}}, {{voivodeship}}, {{postal_code}}' + '</div>'

  // configure typeahead
  $('#q').typeahead(
    {
      highlight: false,
      minLength: 1,
    },
    {
      display: function (suggestion) {
        return null
      },
      limit: 10,
      source: search,
      templates: {
        suggestion: Handlebars.compile(
          '<div>' + '{{2}}, {{3}}, {{1}}' + '</div>'
        ),
      },
    }
  )

  // re-center map after place is selected from drop-down
  $('#q').on('typeahead:selected', function (eventObject, suggestion, name) {
    /* 
      lat: parseFloat(suggestion.latitude),
      lng: parseFloat(suggestion.longitude),
    */
    // set map's center
    map.setCenter({
      lat: parseFloat(suggestion[9]),
      lng: parseFloat(suggestion[10]),
    })
  })

  // hide info window when text box has focus
  $('#q').focus(function (eventData) {
    info.close()
  })

  // re-enable ctrl- and right-clicking (and thus Inspect Element) on Google Map
  // https://chrome.google.com/webstore/detail/allow-right-click/hompjdfbfmmmgflfjdlnkohcplmboaeo?hl=en
  document.addEventListener(
    'contextmenu',
    function (event) {
      event.returnValue = true
      event.stopPropagation && event.stopPropagation()
      event.cancelBubble && event.cancelBubble()
    },
    true
  )

  // Update UI
  update()

  // give focus to text box
  $('#q').focus()
}

/**
 * Adds marker for place to map.
 */
function addMarker(place) {
  // extract the place latitude and longitude
  var myLatLng = new google.maps.LatLng(place[9], place[10])

  // instantiate marker
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: place[2],
    label: place[2],
    icon: {
      url: 'http://maps.google.com/mapfiles/kml/pal2/icon31.png',
      labelOrigin: new google.maps.Point(16, 38),
    },
  })

  // get articles for place
  $.getJSON($SCRIPT_ROOT + '/articles', { geo: place[2] }, function (articles) {
    // remove markers without any articles
    if ($.isEmptyObject(articles)) {
      marker.setMap(null)
    }
    // only display info window if articles for a certain place exist
    if (!$.isEmptyObject(articles)) {
      // start Unordered List
      var articlesContent = '<ul>'
      for (var i = 0; i < articles.length; i++) {
        //Each list item is stored into articlesString
        articlesContent +=
          "<li><a target='_NEW' href='" +
          articles[i].link +
          "'>" +
          articles[i].title +
          '</a></li>'
      }
    }

    // close the unordered list of articles
    articlesContent += '</ul>'

    // listen for clicks on marker
    marker.addListener('click', function () {
      showInfo(marker, articlesContent)
    })
  })

  markers.push(marker)
}

/**
 * Removes markers from map.
 */
function removeMarkers() {
  for (var i = 0, n = markers.length; i < n; i++) {
    markers[i].setMap(null)
  }
}

/**
 * Searches database for typeahead's suggestions.
 */
function search(query, syncResults, asyncResults) {
  // get places matching query (asynchronously)
  var parameters = {
    q: query,
  }

  $.getJSON($SCRIPT_ROOT + '/search', parameters)
    .done(function (data, textStatus, jqXHR) {
      // call typeahead's callback with search results (i.e., places)
      console.log(data)
      asyncResults(data)
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      // log error to browser's console
      console.log(errorThrown.toString())

      // call typeahead's callback with no results
      asyncResults([])
    })
}

/**
 * Shows info window at marker with content.
 */
function showInfo(marker, content) {
  // start div
  var div = "<div id='info'>"
  if (typeof content == 'undefined') {
    // http://www.ajaxload.info/
    div += "<img alt='loading' src='/static/ajax-loader.gif'/>"
  } else {
    div += content
  }

  // end div
  div += '</div>'

  // set info window's content
  info.setContent(div)

  // open info window (if not already open)
  info.open(map, marker)
}

/**
 * Updates UI's markers.
 */
function update() {
  // get map's bounds
  var bounds = map.getBounds()
  var ne = bounds.getNorthEast()
  var sw = bounds.getSouthWest()

  console.log('There is a problem with a number of called updates')

  // get places within bounds (asynchronously)
  var parameters = {
    ne: ne.lat() + ',' + ne.lng(),
    q: $('#q').val(),
    sw: sw.lat() + ',' + sw.lng(),
  }

  $.getJSON($SCRIPT_ROOT + '/update', parameters)
    .done(function (data, textStatus, jqXHR) {
      // remove old markers from map
      removeMarkers()

      console.log(data)

      // add new markers to map
      for (var i = 0; i < data.length; i++) {
        addMarker(data[i])
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      // log error to browser's console
      console.log(errorThrown.toString())
    })
}
