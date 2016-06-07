var map = (function(){

	var marker = new Array();
	var statesId = new Array();

	return {
		init: function() {
			var map = L.map('map', {
				center: [42, -107],
				zoom: 4,
				maxZoom: 9,
				minZoom: 1
			});

			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				noWrap: true,
			}).addTo(map);

			function style(feature) {
				return {
					weight: 1,
					opacity: 1,
					color: 'white',
					fillOpacity: 0
				};
			}

			L.geoJson(statesData, {style: style}).addTo(map);

			function highlightFeature(e) {
				var layer = e.target;

				layer.setStyle({
					weight: 2,
					color: '#666',
					dashArray: '',
					fillOpacity: 0.2
				});

				if (!L.Browser.ie && !L.Browser.opera) {
					layer.bringToFront();
				}
			}

			function resetHighlight(e) {
				geojson.resetStyle(e.target);
			}

			var geojson;

			function onEachFeature(feature, layer) {
				layer.on({
					mouseover: highlightFeature,
					mouseout: resetHighlight,
					click: function() {
						// console.log(marker[1].myFirstNumber);
						// console.log(this._leaflet_id);
						// console.log(this);
						// console.log(marker[3]);
						// console.log(marker[4]);
						// console.log(marker[5]);
						// console.log(marker[6]);
						// console.log(marker[7]);
						// console.log(marker[8]);
						// console.log(marker[9]);
						// console.log(marker[10]);
				
						// map.removeLayer(marker[4]);
						var i = 0;
						for (i = 1; i <= 10; i++) {
							if ( marker[i] != undefined) {
								var a = Number(marker[i].myFirstNumber),
									b = this._leaflet_id;
								if (a === b) {
									map.removeLayer(marker[i]);
									break;
								}
							}
						}

						console.log(i);

						
					}

				});
			}

			geojson = L.geoJson(statesData, {
				style: style,
				onEachFeature: onEachFeature
			}).addTo(map);



			function getCoordinates (state) {
				var
					span = state.find('span'),
					coordinates = span.text().split(', ')

				return [coordinates[0], coordinates[1]];
			}

			function getIndex (state) {
				var
					span = state.find('span'),
					coordinates = span.text().split(', ')
				return coordinates[3];
			}

			function getLeafletId (state) {
				var
					span = state.find('span'),
					coordinates = span.text().split(', ')
				return coordinates[2];
			}

			function getText (li) {
				return li.contents().get(0).nodeValue;
			}

			var allStates = $('.all-states'),
				state = allStates.find('li'),
				counter = true;

				

				state.on('click', function(e) {
					e.stopPropagation();
					var $this = $(this);

						var newMarker = new L.marker(getCoordinates($this));
						marker[getIndex($this)] = newMarker;

						map.addLayer(marker[getIndex($this)]);
						marker[getIndex($this)].bindPopup(getText($this));

						statesId[getIndex($this)] = getLeafletId($this);

						marker[getIndex($this)].myFirstNumber = getLeafletId($this);
						marker[getIndex($this)].mySecondNumber = getIndex($this);
						console.log(marker[getIndex($this)].myFirstNumber);
						console.log(marker[getIndex($this)].mySecondNumber);

						// if (counter) {
						// 	counter = !counter;
						// 	map.removeLayer(marker);
						// 	return false
						// }

						// console.log(statesId);
						// console.log(marker);
				});

				// $('.text-title').on('click', function(e) {
				// 	var $this = $(this),
				// 	states = $this.closest('.all-states').find('li');

				// 	states.each(function() {

				// 		marker = new L.marker(getCoordinates($(this)));

				// 		map.addLayer(marker);
				// 		marker.bindPopup(getText($(this)));
				// 	});

				// });

		}
	}
})();

var cityNav = (function(){

	return {

		init: function() {

				$('.fa').on('click', function(){
					var $this = $(this),
						icon = $this;
						
					icon.toggleClass('fa-minus fa-plus')
					.closest('.all-states').find('.ew-states')
					.slideToggle();
				});
		}
	}
})();


$(document).ready(function () {
	 map.init();
	 cityNav.init();
});