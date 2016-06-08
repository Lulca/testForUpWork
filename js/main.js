var map = (function(){

	var marker = new Array(),
		statesId = new Array();


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

			var
				secondList = $('.second-list'),
				firstList = $('.first-list'),
				firstListLi = $('.first-list').find('li'),
				fa = '<i class="fa fa-times" aria-hidden="true">';
				// console.log(firstListLi);
			var control = true;

			function onEachFeature(feature, layer) {
				layer.on({
					mouseout: resetHighlight,
					mouseover: function(e) {
						highlightFeature(e);
						if (control) {
							var i = 0;
							for (i = 1; i <= 10; i++) {
								if ( marker[i] != undefined) {
									var a = Number(marker[i].myFirstNumber),
									b = this._leaflet_id;
									if (a === b) {
									// map.removeLayer(marker[i]);
									this.mySecondNumber = marker[i].mySecondNumber;
									this.myThirdNumber = marker[i].myThirdNumber;
									break;
								}
							}
						}
						secondList
						.append(firstListLi.eq(this.mySecondNumber - 1)
							.append(fa)
							);		
					}

				}

				});
			}
		
			// $(".fa-times").on("click", function() {
			// 	alert('heloo');
			// });

			$(document).on("mouseover", ".fa-times", function() {
				var $this = $(this),
					lastLevelLi = $this.closest('.last-level'),
					firstList = $('.first-list'),
					secondListLi = firstList.find('.last-level')
					map.removeLayer(marker[getIndex(lastLevelLi)]);
					
					// firstList.append(secondListLi.eq(getIndex(lastLevelLi)));


			});

			geojson = L.geoJson(statesData, {
				style: style,
				onEachFeature: onEachFeature
			}).addTo(map);

			function getCoordinates (state) {
				var
					array = state.find('.array'),
					coordinates = array.text().split(', ');

				return [coordinates[0], coordinates[1]];
			}

			function getIndex (state) {
				var
					array = state.find('.array'),
					coordinates = array.text().split(', ');
				return coordinates[3];
			}

			function getLeafletId (state) {
				var
					array = state.find('.array'),
					coordinates = array.text().split(', ');
				return coordinates[2];
			}

			function getList (state) {
				var
				array = state.find('.array'),
				coordinates = array.text().split(', ');
				return coordinates[4];
			}

			function getText (li) {
				return li.contents().get(0).nodeValue;
			}

			function addMarker ($this) {
				if (marker[getIndex($this)] === undefined || marker[getIndex($this)]._icon === null) {
					var newMarker = new L.marker(getCoordinates($this));
					marker[getIndex($this)] = newMarker;

					map.addLayer(marker[getIndex($this)]);
					marker[getIndex($this)].bindPopup(getText($this));

					statesId[getIndex($this)] = getLeafletId($this);

					marker[getIndex($this)].myFirstNumber = getLeafletId($this);
					marker[getIndex($this)].mySecondNumber = getIndex($this);
					marker[getIndex($this)].myThirdNumber = getList($this);
					// console.log(marker[getIndex($this)].myFirstNumber);
					// console.log(marker[getIndex($this)].mySecondNumber);
					// console.log(marker[getIndex($this)].myThirddNumber);
				}

			}

			var allStates = $('.all-states'),
				state = allStates.find('.last-level'),
				counter = true;

				state.on('click', function(e) {
					e.stopPropagation();
					var $this = $(this);

						addMarker($this);

				});

				$('.text-title').on('click', function(e) {
					var $this = $(this),
					states = $this.closest('.all-states').find('.last-level');

					states.each(function() {
						addMarker($(this));
					});

				});


		}
	}
})();

var cityNav = (function(){

	var states = $('.states');

	return {

		init: function() {

			states.find('.fa-minus').on('click', function(){
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