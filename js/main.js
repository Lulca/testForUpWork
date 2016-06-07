var map = (function(){

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
					// click: function(e) {
					// 	console.log(e.latlng)
					// } 
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

			function getIndex (array) {
				return array[2];
			}

			function getText (li) {
				return li.contents().get(0).nodeValue;
			}

			var allStates = $('.all-states'),
				state = allStates.find('li'),
				counter = false;

				state.on('click', function(e) {
					e.stopPropagation();
					var $this = $(this);
						var marker;

						marker = new L.marker(getCoordinates($this));

						marker.addTo(map)
						.bindPopup(getText($this));

						// if (counter) {
						// 	map.removeLayer(marker);
						// }

						// counter = !counter;
				});

				allStates.on('click', function(e) {
					var $this = $(this),
					states = $this.find('li');

					states.each(function() {
						var marker;

						marker = new L.marker(getCoordinates($(this)));

						marker.addTo(map)
						.bindPopup(getText($(this)));
					});
			
			});

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