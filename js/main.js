var map = (function(){

	var marker = [],
		statesId = [];


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

			geojson = L.geoJson(statesData, {
				style: style,
				onEachFeature: onEachFeature
			}).addTo(map);

			var
			allStates = $('.all-states'),
			state = allStates.find('.last-level'),
			secondList = $('.second-list'),
			secondListLi = secondList.find('.last-level'),
			firstList = $('.first-list'),
			firstListLi = firstList.find('.last-level');

			function onEachFeature(feature, layer) {
				layer.on({
					mouseout: resetHighlight,
					mouseover: function(e) {
						highlightFeature(e);					
						var i = 0;
						for (i = 0; i < firstListLi.length; i++) {
							if ( marker[i+1] !== undefined) {
								var a = Number(marker[i+1].myFirstNumber),
								b = Number(layer.feature.id);
								if (a === b) {
									secondListLi.eq(i).show();
									console.log(this.mouseCounter);
									if ( marker[i+1] !== undefined && this.mouseCounter === undefined) {
										secondList.append(secondListLi.eq(i));
										this.mouseCounter = 1;
										console.log(this);
									}
									firstListLi.eq(i).hide();
									break;
								}
							}	
						}						
					}
				});
			}
			
			var fa = secondList.find('.fa-times');
			fa.on("click", function() {
				var $this = $(this),
				lastLevelLi = $this.closest('.last-level'),
				index = lastLevelLi.data('index');
				secondListLi.eq(index - 1).hide();
				firstListLi.eq(index - 1).show();
				map.removeLayer(marker[index]);
				marker[index] = undefined;
			});


			function getCoordinates (state) {
				var
				array = state.find('.array'),
				coordinates = array.text().split(', ');

				return [coordinates[0], coordinates[1]];
			}

			function getIndex (state) {
				return Number(state.data('index'));
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
				}
			}

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