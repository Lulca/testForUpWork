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
			} else if ($scope.states[i].location === "east") {
				$scope.statesEast.push($scope.states[i]);
			}
		}
	});

	map = L.map('map', {
		center: [42, -107],
		zoom: 4,
		maxZoom: 9,
		minZoom: 1
	});


	var marker = [];
	var layers = [];

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
	var counter = 0;

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
						var a = Number(marker[i+1].myStateId),
						b = Number(layer.feature.id);
						$scope.that = this;
						if (a === b) {
							$scope.$apply(function () {
								changeVis(i);
								if ($scope.that.mouseCounter === undefined) {
									setSortParameter($scope.states[i], $scope.states);
									$scope.that.mouseCounter = 1;
									layers[i] = $scope.that;
								}
							});
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

			marker[state.dataIndex].myStateId = state.statesId;
		}
	}

	function toRightList (myState) {
		myState.visibility = !myState.visibility;
	}

	function findMaxCounter(states) {
		maxNumber = 0;
		for (var i = 0; i < states.length; i++) {
			if (states[i].counter >= maxNumber) {
				maxNumber = states[i].counter;
			}
		}
		return maxNumber;
	}

	function setSortParameter (myState, states) {
		if (counter === 0) {
			counter++;	
		} else {
			counter = findMaxCounter(states) + 1;
		}
		
		myState.counter = counter;
	}
	
	$scope.addMarkerToMap = function(event) {
		event.stopPropagation();
		var state = this.state;
		addMarker(state);
	}

	function changeVis(i) {
		$scope.states[i].visibility = true;
	}

	$scope.toLeftList = function() {
		this.state.visibility = !this.state.visibility;
		map.removeLayer(marker[this.state.dataIndex]);
		marker[this.state.dataIndex] = undefined;
		layers[this.state.dataIndex-1].mouseCounter = undefined;
	}

	$scope.addMarkersToStates = function(states) {
		for(var i = 0; i < states.length; i++) {
			addMarker(states[i]);
		}
	}
});

