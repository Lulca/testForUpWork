var mapApp = angular.module('mapApp', []);

mapApp.controller('mapController', function stateListController ($scope, $http) {



	$http.get('js/states.json').then(function(response){
		$scope.states = response.data;
		$scope.sortParam = 'dataIndex';
		$scope.sortParam1 = 'counter';
		$scope.statesEast = [];
		$scope.statesWest = [];

		var i;
		for (i = 0; i < $scope.states.length; i++) {
			if($scope.states[i].location === "west") {
				$scope.statesWest.push($scope.states[i]);
			} else {
				$scope.statesEast.push($scope.states[i]);
			}
		}
	});

				var map = L.map('map', {
				center: [42, -107],
				zoom: 4,
				maxZoom: 9,
				minZoom: 1
			});

			var marker = [];

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
				layer = e.target;

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

			function onEachFeature(feature, layer) {
				layer.on({
					mouseout: resetHighlight,
					mouseover: function(e) {
						highlightFeature(e);
						var i = 0;
						for (i = 0; i < $scope.states.length; i++) {
							if ( marker[i+1] !== undefined) {
								var a = Number(marker[i+1].myFirstNumber),
								b = Number(layer.feature.id);
								if (a === b) {
									// secondListLi.eq(i).show();
									// console.log($scope);

									$scope.states[i].visibility = true;
									console.log($scope.states[i].visibility);
									// console.log(this.mouseCounter);
									// console.log(this);
									// if ( marker[i+1] !== undefined && this.mouseCounter === undefined) {
									// 	// secondList.append(secondListLi.eq(i));
									// 	this.mouseCounter = 1;
									// 	console.log(this);
									// }
									// // firstListLi.eq(i).hide();
									// break;
								}
							}	
						}					
					}
				});
			}	

	function addMarker (state) {
		if (marker[state.dataIndex] === undefined || marker[state.dataIndex]._icon === null) {
			var newMarker = new L.marker(state.markerPosition);
			marker[state.dataIndex] = newMarker;

			map.addLayer(marker[state.dataIndex]);
			marker[state.dataIndex].bindPopup(state.name);

			// statesId[state.dataIndex] = getLeafletId($this);

			marker[state.dataIndex].myFirstNumber = state.statesId;
			// marker[state.dataIndex].mySecondNumber = state.dataIndex;
			// marker[state.dataIndex].myThirdNumber = getList($this);
		}
	}


	var counter = 0;

	function toRightList (myState) {
		myState.visibility = !myState.visibility;
		counter++;
		myState.counter = counter;
		console.log(myState.visibility);
	}
	
	$scope.addMarkerToMap = function(event) {
		event.stopPropagation();
		var state = this.state;
		addMarker(state);
		// to right list
		// console.log($scope);
		// toRightList(state);
		// $scope.states[0].visibility = true;
		// console.log("hello");

	}


	$scope.toLeftList = function() {
		this.state.visibility = !this.state.visibility;
		map.removeLayer(marker[this.state.dataIndex]);
		marker[this.state.dataIndex] = undefined;

	}

	$scope.addMarkersToStates = function(states) {
		for(var i = 0; i < states.length; i++) {
			addMarker(states[i]);
		}
	}
});
	






// var map = (function(){

// 	var marker = [],
// 		statesId = [];


// 	return {
// 		init: function() {
// 			var map = L.map('map', {
// 				center: [42, -107],
// 				zoom: 4,
// 				maxZoom: 9,
// 				minZoom: 1
// 			});

// 			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
// 				noWrap: true,
// 			}).addTo(map);

// 			function style(feature) {
// 				return {
// 					weight: 1,
// 					opacity: 1,
// 					color: 'white',
// 					fillOpacity: 0
// 				};
// 			}

// 			L.geoJson(statesData, {style: style}).addTo(map);

// 			function highlightFeature(e) {
// 				var layer = e.target;

// 				layer.setStyle({
// 					weight: 2,
// 					color: '#666',
// 					dashArray: '',
// 					fillOpacity: 0.2
// 				});

// 				if (!L.Browser.ie && !L.Browser.opera) {
// 					layer.bringToFront();
// 				}
// 			}

// 			function resetHighlight(e) {
// 				geojson.resetStyle(e.target);
// 			}

// 			var geojson;

// 			geojson = L.geoJson(statesData, {
// 				style: style,
// 				onEachFeature: onEachFeature
// 			}).addTo(map);

// 			var
// 			allStates = $('.all-states'),
// 			state = allStates.find('.last-level'),
// 			secondList = $('.second-list'),
// 			secondListLi = secondList.find('.last-level'),
// 			firstList = $('.first-list'),
// 			firstListLi = firstList.find('.last-level');

			// function onEachFeature(feature, layer) {
			// 	layer.on({
			// 		mouseout: resetHighlight,
			// 		mouseover: function(e) {
			// 			highlightFeature(e);					
			// 			var i = 0;
			// 			for (i = 0; i < firstListLi.length; i++) {
			// 				if ( marker[i+1] !== undefined) {
			// 					var a = Number(marker[i+1].myFirstNumber),
			// 					b = Number(layer.feature.id);
			// 					if (a === b) {
			// 						secondListLi.eq(i).show();
			// 						console.log(this.mouseCounter);
			// 						if ( marker[i+1] !== undefined && this.mouseCounter === undefined) {
			// 							secondList.append(secondListLi.eq(i));
			// 							this.mouseCounter = 1;
			// 							console.log(this);
			// 						}
			// 						firstListLi.eq(i).hide();
			// 						break;
			// 					}
			// 				}	
			// 			}						
			// 		}
			// 	});
			// }
			
// 			var fa = secondList.find('.fa-times');
// 			fa.on("click", function() {
// 				var $this = $(this),
// 				lastLevelLi = $this.closest('.last-level'),
// 				index = lastLevelLi.data('index');
// 				secondListLi.eq(index - 1).hide();
// 				firstListLi.eq(index - 1).show();
// 				map.removeLayer(marker[index]);
// 				marker[index] = undefined;
// 			});


// 			function getCoordinates (state) {
// 				var
// 				array = state.find('.array'),
// 				coordinates = array.text().split(', ');

// 				return [coordinates[0], coordinates[1]];
// 			}

// 			function getIndex (state) {
// 				return Number(state.data('index'));
// 			}

// 			function getLeafletId (state) {
// 				var
// 				array = state.find('.array'),
// 				coordinates = array.text().split(', ');
// 				return coordinates[2];
// 			}

// 			function getList (state) {
// 				var
// 				array = state.find('.array'),
// 				coordinates = array.text().split(', ');
// 				return coordinates[4];
// 			}

// 			function getText (li) {
// 				return li.contents().get(0).nodeValue;
// 			}

// 			function addMarker ($this) {
// 				if (marker[getIndex($this)] === undefined || marker[getIndex($this)]._icon === null) {
// 					var newMarker = new L.marker(state.markerPosition);
// 					marker[getIndex($this)] = newMarker;

// 					map.addLayer(marker[getIndex($this)]);
// 					marker[getIndex($this)].bindPopup(getText($this));

// 					statesId[getIndex($this)] = getLeafletId($this);

// 					marker[getIndex($this)].myFirstNumber = getLeafletId($this);
// 					marker[getIndex($this)].mySecondNumber = getIndex($this);
// 					marker[getIndex($this)].myThirdNumber = getList($this);
// 				}
// 			}

// 			state.on('click', function(e) {
// 				e.stopPropagation();
// 				var $this = $(this);
// 				addMarker($this);
// 			});

// 			$('.text-title').on('click', function(e) {
// 				var $this = $(this),
// 				states = $this.closest('.all-states').find('.last-level');

// 				states.each(function() {
// 					addMarker($(this));
// 				});

// 			});
// 		}
// 	}
// })();

// var cityNav = (function(){
// 	var states = $('.states');
// 	return {
// 		init: function() {
// 			states.find('.fa-minus').on('click', function(){
// 				var $this = $(this),
// 				icon = $this;
// 				icon.toggleClass('fa-minus fa-plus')
// 				.closest('.all-states').find('.ew-states')
// 				.slideToggle();
// 			});
// 		}
// 	}
// })();

// $(document).ready(function () {
// 	 cityNav.init();
// });