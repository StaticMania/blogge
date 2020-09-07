$(document).ready(function () {
  "use strict";

});

$(".case-studies-slider").slick({
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 6,
  slidesToScroll: 1,
  arrows: false,
  autoplay: true,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
});
// G-Map
/**
 * Created by Kausar on 06/10/2016.
 */
window.marker = null;

function initialize() {
  var map;
  var nottingham = new google.maps.LatLng(23.7783741, 90.3746808);
  var style = [
    {
      featureType: "administrative.country",
      elementType: "geometry",
      stylers: [
        {
          visibility: "simplified",
        },
        {
          hue: "#ff0000",
        },
      ],
    },
  ];
  var mapOptions = {
    // SET THE CENTER
    center: nottingham,
    // SET THE MAP STYLE & ZOOM LEVEL
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    // SET THE BACKGROUND COLOUR
    backgroundColor: "#000",
    // REMOVE ALL THE CONTROLS EXCEPT ZOOM
    zoom: 13,
    panControl: false,
    scrollwheel: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    overviewMapControl: false,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.LARGE,
    },
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  // SET THE MAP TYPE
  var mapType = new google.maps.StyledMapType(style, {
    name: "Grayscale",
  });
  map.mapTypes.set("grey", mapType);
  map.setMapTypeId("grey");
  //CREATE A CUSTOM PIN ICON
  var marker_image = "images/pin.png";
  var pinIcon = new google.maps.MarkerImage(
    marker_image,
    null,
    null,
    null,
    new google.maps.Size(21, 34)
  );
  marker = new google.maps.Marker({
    position: nottingham,
    map: map,
    icon: pinIcon,
    title: "bizcred",
  });
}
google.maps.event.addDomListener(window, "load", initialize);
// sticky nav
$(window).on("scroll", function () {
  if ($(window).scrollTop()) {
    $("nav").addClass("nav-bg");
  } else {
    $("nav").removeClass("nav-bg");
  }
});
