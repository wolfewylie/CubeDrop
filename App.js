var ge;
var maplong = 49.73;
var maplat = 13.376;

google.load("earth", "1");

function init() {
  google.earth.createInstance("map3d", initCallback, failureCallback);
}
  
//geocode the location inputted by the user
function geocodeAddress() {
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById('address').value;
    geocoder.geocode({
      address: address
      }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              var mapcentre = results[0].geometry.location;
              maplong = results[0].geometry.location.A;
              maplat = results[0].geometry.location.k;
              buildnewmap(mapcentre, maplong, maplat);
              }
             else {
              window.alert('City not found: ' + status);
            }
          });
          };

function initCallback(instance) {
  ge = instance;
  ge.getWindow().setVisibility(true);
  // add navigation controls
  ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);
  // add layers
  ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, true);
  ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, true);
  ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);
  // Fly to the location
  var la = ge.createLookAt('');
  la.set(49, -92, 2000000, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, 5000000);
  ge.getView().setAbstractView(la);
  document.getElementById('installed-plugin-version').innerHTML =
    ge.getPluginVersion().toString();
}

//Fly to new location as entered by user
function buildnewmap(mapcentre, maplong, maplat) {
//Figure out degrees offset at that longitude 
//methodology via http://gis.stackexchange.com/questions/2951/algorithm-for-offsetting-a-latitude-longitude-by-some-amount-of-meters
 var lat = maplat;
 var lon = maplong;
 var R=6378137;
 var dn = 8608;
 var de = 8608;
 var dLat = dn/R;
 var dLon = de/(R*Math.cos(Math.PI*lat/180));
 var latO = lat + dLat * 180/Math.PI;
 var lonO = lon + dLon * 180/Math.PI;
 console.log(latO + " " + lonO); 
  var firstlat = maplat;
  var firstlong = maplong;
  var secondlat = maplat;
  var secondlong = lonO;
  var thirdlat = latO;
  var thirdlong = lonO;
  var fourthlat = latO;
  var fourthlong = maplong;
  var cube = ge.parseKml(
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<kml xmlns="http://www.opengis.net/kml/2.2">' +
  '  <Placemark>' +
  '  <name>The really big cube of water</name>' +
  '  <Style id="BlueWater">' +
  '      <LineStyle>' +
  '      <color>64000000</color>' +
  '    </LineStyle>' +
  '    <PolyStyle>' +
  '      <color>E6781400</color>' +
  '    </PolyStyle>' +
  '  </Style>' + 
  '    <Polygon>' +
  '      <extrude>1</extrude>' +
  '      <altitudeMode>relativeToGround</altitudeMode>' +
  '      <outerBoundaryIs>' +
  '        <LinearRing>' +
  '          <coordinates>' + firstlong + ',' + firstlat + ',8608 ' + secondlong + ',' + secondlat + ',8608 ' 
  + thirdlong + ',' + thirdlat + ',8608 ' + fourthlong + ',' + fourthlat + ',8608 ' + firstlong + ',' + 
  firstlat + ',8608 ' +
  '          </coordinates>' +
  '        </LinearRing>' +
  '      </outerBoundaryIs>' +
  '    </Polygon>' +
  '  </Placemark>' +
  '</kml>');

  ge.getFeatures().appendChild(cube);

  // Initial map view
  var la = ge.createLookAt('');
  la.set(maplat, maplong, 6000, ge.ALTITUDE_RELATIVE_TO_GROUND, 37, 45, 14000);
  ge.getView().setAbstractView(la);

  document.getElementById('installed-plugin-version').innerHTML =
    ge.getPluginVersion().toString();
}

function failureCallback(errorCode) {
}

