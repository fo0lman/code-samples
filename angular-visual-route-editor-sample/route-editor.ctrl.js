"use strict";

function RouteEditorCtrl($scope, RouteEditorService, PageTitleService) {
    
    var re = this,
        oldWaypointsPosition,
        routeTotalDistance,
        routeTotalTime;

    re.location = 'Route Editor';
    
    PageTitleService.change(re.location);

    re.icons = {};
    re.icons.correctionHide = L.icon({
        iconUrl: 'assets/img/map-marker-red.png',
        iconSize:     [15, 25],
        iconAnchor:   [10, 20],
        popupAnchor:  [-35, -45],
        className: 'hideMarker'
    });
    re.icons.correctionShow = L.icon({
        iconUrl: 'assets/img/map-marker-red.png',
        iconSize:     [15, 25],
        iconAnchor:   [10, 20],
        popupAnchor:  [-35, -45],
        className: ''
    });
    re.icons.waypoint = L.icon({
        iconUrl: 'assets/img/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });
    re.icons.pulse = L.icon.pulse({
        iconSize:[10,10],
        color:'red'
    });
    
    re.config = {};
    re.config.routeLine = {
        styles: [
            {
                color: 'black',
                opacity: .15,
                weight: 9
            },
            {
                color: 'white',
                opacity: .8,
                weight: 6
            },
            {
                color: 'red',
                opacity: 1,
                weight: 2
            }
        ]
    };
    re.config.googleGeocoder = L.Control.Geocoder.google('AIzaSyDZr2ij9GTaPutTfRBNeUoRK8gPhipp5Lk');
    re.config.webClientLocation = L.control.locate({
        position: 'topleft',
        layer: undefined,
        drawCircle: true,
        follow: false,
        setView: true,
        keepCurrentZoomLevel: false,
        stopFollowingOnDrag: false,
        remainActive: false,
        markerClass: L.circleMarker,
        circleStyle: {},
        markerStyle: {},
        icon: 'fa fa-map-marker',
        iconLoading: 'fa fa-spinner fa-spin',
        iconElementTag: 'span',
        circlePadding: [0, 0],
        metric: true,
        showPopup: true,
        strings: {
            title: "Геолокация",
            metersUnit: "метров",
            popup: "Вы находитесь на расстоянии {distance} {unit} от этой точки",
            outsideMapBoundsMsg: "Вы находитесь за пределами данной карты"
        }
    });
    re.config.realtime = L.realtime({
        url: 'https://wanderdrone.appspot.com/',
        crossOrigin: true,
        type: 'json'
    }, {
        interval: 5 * 1000
    });
    re.config.truckPosition = L.marker({
        lat: 48.461995,
        lng: 35.049734
    }, {
        icon: re.icons.pulse
    });

    re.createMarker = function(index, wp) {
        var correctionOptions = {
            icon: (re.routeEditorPlan.options.disableEditWaypoints) ? re.icons.correctionHide : re.icons.correctionShow,
            draggable: this.draggableWaypoints
        };
        var marker;

        var that = this;

        marker = L.marker(wp.latLng, correctionOptions);
        L.DomEvent.addListener(marker, 'dblclick', function () {
            that.removeMarker(index)
        });

        return marker;
    };
    re.createLoadPoint = function(index, wp) {
        var requireOptions = { icon: re.icons.waypoint, draggable: this.draggableWaypoints };
        var marker;

        var that = this;

        marker = L.marker(wp.latLng, requireOptions).bindPopup(wp.name);
        L.DomEvent.addListener(marker, 'dblclick', function () {
            that.removeMarker(index)
        });

        return marker;
    };
    re.removeMarker = function(index) {
        var data = re.routeEditorPlan;
        var wps = data._waypoints;

        if (wps[index].type !== undefined && wps[index].type === 'point') {

            var removeRange = re.prepareremoveIndexes(index, wps);
            urstack.add(removeRange.info);

            re.routeEditorPlan.spliceWaypoints(removeRange.start, removeRange.end);
        } else {

            var info = {
                type: 'remove',
                wpIndex: index,
                wpType: data._waypoints[index].type,
                wpLatLng: data._waypoints[index].latLng
            };

            urstack.add(info);

            re.routeEditorPlan.spliceWaypoints(index, 1);
        }

        return this;
    };
    re.prepareremoveIndexes = function(index, waypoints) {
        var indexes = [];
        var undoData = [];

        indexes.push(index);

        var currInfo = {
            type: 'remove',
            wpIndex: index,
            wpType: waypoints[index].type,
            wpLatLng: waypoints[index].latLng
        };


        undoData.push(currInfo);

        for (var j = index; j >= 0; j--) {

            if (waypoints[j].type === 'correction') {
                indexes.push(j);

                var downInfo = {
                    type: 'remove',
                    wpIndex: j,
                    wpType: waypoints[j].type,
                    wpLatLng: waypoints[j].latLng
                };

                undoData.push(downInfo);

            } else {
                if (j !== index) {
                    break;
                }
            }
        }

        var g = index + 1;

        if (g >= waypoints.length - 1) {
            g = index;
        }

        for (var i = g; i <= waypoints.length; i++) {

            if (waypoints[i].type === 'correction') {
                indexes.push(i);

                var upInfo = {
                    type: 'remove',
                    wpIndex: i,
                    wpType: waypoints[i].type,
                    wpLatLng: waypoints[i].latLng

                };

                undoData.push(upInfo);

            } else {
                break;
            }
        }

        function getMinOfArray(array) {
            return Math.min.apply(null, array);
        }

        var min = getMinOfArray(indexes);

        return {
            start: min,
            end: indexes.length,
            info: undoData
        };
    };
    re.showHideCorrectionsMarkers = function() {
        var waypoints = re.routeControl.getWaypoints();

        waypoints.forEach(function(item, i) {

            if (item.type === 'correction') {
                if (!jQuery(re.routeEditorPlan._markers[i]._icon).hasClass('hideMarker')) {
                    jQuery(re.routeEditorPlan._markers[i]._icon).addClass('hideMarker');
                    jQuery(re.routeEditorPlan._markers[i]._shadow).addClass('hideMarker');
                } else {
                    jQuery(re.routeEditorPlan._markers[i]._icon).removeClass('hideMarker');
                    jQuery(re.routeEditorPlan._markers[i]._shadow).removeClass('hideMarker');
                }
            }
        });
        return this;
    };
    re.saveToGeoJSON = function(waypoints, coords) {

        var features = [];

        waypoints.forEach(function(item) {
            var tempFeature;
            var tempCoords = [];

            tempCoords.push(item.latLng.lng);
            tempCoords.push(item.latLng.lat);

            tempFeature = {
                type: 'Feature',
                data: {
                    type: item.type,
                    name: item.name
                },
                geometry: {
                    type: 'Point',
                    coordinates: tempCoords
                },
                properties: {
                    options: item.options
                }
            };

            features.push(tempFeature);
        });

        var tempServerCoords = coords.map(function(item) {
            
            var tempCoords = [];

            tempCoords.push(item.lng);
            tempCoords.push(item.lat);

            return tempCoords;
        });
        
        var coordsFeature = {
            type: 'Feature',
            name: 'ServerCoords',
            geometry: {
                type: 'LineString',
                coordinates: tempServerCoords
            },
            properties: {}
        };

        features.push(coordsFeature);

        var obj = {
            "type": 'FeatureCollection',
            features: features
        };

        return JSON.stringify(obj);
    };
    re.loadFromGeoJSON = function(geoJSONString) {

        var obj = {},
            waypoints = [],
            route,
            features;

        if (geoJSONString) {
            obj = JSON.parse(geoJSONString);
            features = obj.features;
            features.forEach(function(item) {
                if (item.name !== undefined && item.name === 'ServerCoords') {
                    route = item.geometry.coordinates;

                    route.forEach(function(item) {
                        item = item.reverse();
                    })
                } else if (item.data !== undefined && item.data.type) {
                    var tempMarker = {
                        "type": item.data.type,
                        "name": item.data.name,
                        "latLng": {
                            "lng": item.geometry.coordinates[0],
                            "lat": item.geometry.coordinates[1]
                        },
                        "options": item.properties.options
                    };

                    waypoints.push(tempMarker)
                }
            });
        }
        
        return {
            waypoints: waypoints,
            route: route
        }

    };
    re.bindEvents = function() {
        re.routeEditorPlan.on('waypointdragstart', function (data) {
            oldWaypointsPosition = data;
        });

        re.routeEditorPlan.on('waypointdragend', function (data) {
            var info = {
                type: 'move',
                wpIndex: data.index,
                wpType: data.target._waypoints[data.index].type,
                oldWpLatLng: oldWaypointsPosition.latlng,
                newWpLatLng: data.target._waypoints[data.index].latLng
            };

            urstack.add(info);
        });

        re.routeEditorPlan.on('waypointsspliced', function (data) {

            if (data.added.length && data.nRemoved == 0 ) {
                var info = {
                    type: 'add',
                    wpIndex: data.index,
                    wpType: data.target._waypoints[data.index].type,
                    wpLatLng: data.target._waypoints[data.index].latLng
                };

                urstack.add(info);
            }
        });

        re.config.realtime.on('update', function(e) {
            var feature = this.getFeature();

            re.config.truckPosition.setLatLng({
                lat: feature.geometry.coordinates[1],
                lng: feature.geometry.coordinates[0]
            })
        });

        re.routeControl.on('routesfound', function(e) {
            var routes = e.routes;
            routeTotalDistance = routes[0].summary.totalDistance / 1000;
            routeTotalTime = routes[0].summary.totalTime / 60;
        });

        $scope.$on('leafletDirectiveMap.map.layeradd', function(event){
            waypointsPanel.update();
        });
    };

    re.utils = {};
    re.utils.URStack = function() {

        var undoCommands = [];
        var redoCommands = [];

        function undoSortFn(a, b) {
           return a.wpIndex - b.wpIndex;
        }
        function redoSortFn(a,b) {
            return b.wpIndex - a.wpIndex;
        }
        
        function add(data) {

            var actions = [];

            if( Object.prototype.toString.call(data) === '[object Array]' ) {

                data.sort(redoSortFn);

                undoCommands.push(data);
            } else {
                actions.push(data);
                undoCommands.push(actions);
            }

        }


        function action(plan, type) {
            
            if (type === 'undo') {
                if (!undoCommands.length) {
                    return this;
                }
            } else {
                if (!redoCommands.length) {
                    return this;
                }
            }
            
            var lastCommand;
            
            if (type === 'undo') {
                lastCommand = undoCommands[undoCommands.length - 1];
            } else {
                lastCommand = redoCommands[redoCommands.length - 1];
            }
            
            for (var i = lastCommand.length - 1; i >= 0; i--) {

                if (lastCommand[i].type === 'move') {

                    var wp = plan.getWaypoints();

                    if (type === 'undo') {
                        wp[lastCommand[i].wpIndex].latLng = lastCommand[i].oldWpLatLng;
                    } else {
                        wp[lastCommand[i].wpIndex].latLng = lastCommand[i].newWpLatLng;
                    }

                    plan._updateMarkers();
                    plan._fireChanged();
                }
                
                if (lastCommand[i].type == 'add') {
                    if (type === 'undo') {
                        plan.spliceWaypoints(lastCommand[i].wpIndex, 1);
                    } else {
                        plan.spliceWaypointsUR(lastCommand[i].wpIndex, 0, {
                            "latLng": lastCommand[i].wpLatLng,
                            "type": lastCommand[i].wpType
                        });
                    }
                }
                
                if (lastCommand[i].type == 'remove') {

                    if (type === 'undo') {
                        plan.spliceWaypointsUR(lastCommand[i].wpIndex, 0, {
                            "latLng": lastCommand[i].wpLatLng,
                            "type": lastCommand[i].wpType
                        });
                    } else {
                        plan.spliceWaypoints(lastCommand[i].wpIndex, 1);
                    }
                }
            }

            var command;
            
            if (type === 'undo') {
                command = undoCommands.pop();
                command.sort(undoSortFn);
                redoCommands.push(command);
            } else {
                command = redoCommands.pop();
                command.sort(redoSortFn);
                undoCommands.push(command);
            }
        }

        function undo(plan) {
           action(plan, 'undo')
        }
        function redo(plan) {
            action(plan, 'redo')
        }

        function hasUndo() {
            return undoCommands.length > 0;
        }
        function hasRedo() {
            return redoCommands.length > 0;
        }
        function getCommands() {
            return {
                undo: undoCommands,
                redo: redoCommands
            };
        }
        return {
            add: add,
            undo: undo,
            redo: redo,
            hasUndo: hasUndo,
            hasRedo: hasRedo,
            getCommands: getCommands,
            sort: {
                undoSort: undoSortFn,
                redoSort: redoSortFn
            }
        };
    };

    re.classOverride = {};
    re.classOverride.OverridePlan = L.Routing.Plan.extend({
        dragNewWaypoint: function(e) {
            var newWpIndex = e.afterIndex + 1;

            if (this.options.disableEditWaypoints) {
                this.spliceWaypoints(newWpIndex, 0, {
                    "name": '',
                    "latLng": e.latlng,
                    "type": "point"
                });

                this._hookWaypointEvents(this._markers[newWpIndex], newWpIndex, true);

            } else {
                if (this.options.routeWhileDragging) {
                    this.spliceWaypoints(newWpIndex, 0, {
                        "name": "correction",
                        "latLng": e.latlng,
                        "type": "correction"
                    });
                    this._hookWaypointEvents(this._markers[newWpIndex], newWpIndex, true);
                } else {
                    this._dragNewWaypoint(newWpIndex, e.latlng);
                }
            }
        },
        _dragNewWaypoint: function(newWpIndex, initialLatLng) {
            var wp = new L.Routing.Waypoint(initialLatLng),
                prevWp = this._waypoints[newWpIndex - 1],
                nextWp = this._waypoints[newWpIndex],
                marker,
                lines = [],
                mouseMove = L.bind(function(e) {
                    var i;
                    if (marker) {
                        marker.setLatLng(e.latlng);
                    }
                    for (i = 0; i < lines.length; i++) {
                        lines[i].spliceLatLngs(1, 1, e.latlng);
                    }
                }, this),
                mouseUp = L.bind(function(e) {
                    var i;
                    if (marker) {
                        this._map.removeLayer(marker);
                    }
                    for (i = 0; i < lines.length; i++) {
                        this._map.removeLayer(lines[i]);
                    }
                    this._map.off('mousemove', mouseMove);
                    this._map.off('mouseup', mouseUp);
                    this.spliceWaypoints(newWpIndex, 0, {
                        "latLng": e.latlng,
                        "type": "correction"
                    });
                }, this),
                i;

            if (wp.type === 'point') {
                marker = this.options.createLoadPoint(newWpIndex, wp, this._waypoints.length + 1);
            } else {
                marker = this.options.createMarker(newWpIndex, wp, this._waypoints.length + 1);
            }

            if (marker) {
                marker.addTo(this._map);
            }

            for (i = 0; i < this.options.dragStyles.length; i++) {
                lines.push(L.polyline([prevWp.latLng, initialLatLng, nextWp.latLng],
                    this.options.dragStyles[i]).addTo(this._map));
            }

            this._map.on('mousemove', mouseMove);
            this._map.on('mouseup', mouseUp);
        },
        _updateMarkers: function() {
            var i,
                m;

            if (!this._map) {
                return;
            }

            this._removeMarkers();

            for (i = 0; i < this._waypoints.length; i++) {
                if (this._waypoints[i].latLng) {
                    if (this._waypoints[i].type === 'point') {
                        m = this.options.createLoadPoint(i, this._waypoints[i], this._waypoints.length);
                    } else {
                        m = this.options.createMarker(i, this._waypoints[i], this._waypoints.length);
                    }
                    if (this._waypoints[i].type === undefined) {
                        m = this.options.createLoadPoint(i, this._waypoints[i], this._waypoints.length);
                    }

                    if (m) {
                        m.addTo(this._map);
                        if (this.options.draggableWaypoints) {
                            this._hookWaypointEvents(m, i);
                        }
                    }
                } else {
                    m = null;
                }
                this._markers.push(m);
            }
        },
        _fireChanged: function() {
            this.fire('waypointschanged', {waypoints: this.getWaypoints()});

            if (arguments.length >= 2) {
                this.fire('waypointsspliced', {
                    index: Array.prototype.shift.call(arguments),
                    nRemoved: Array.prototype.shift.call(arguments),
                    added: arguments
                });
            }
        },
        _updateGeocoders: function() {
            var elems = [],
                i,
                geocoderElem;

            for (i = 0; i < this._geocoderElems.length; i++) {
                this._geocoderContainer.removeChild(this._geocoderElems[i].getContainer());
            }

            for (i = this._waypoints.length - 1; i >= 0; i--) {
                geocoderElem = this._createGeocoder(i);
                this._geocoderContainer.insertBefore(geocoderElem.getContainer(), this._geocoderContainer.firstChild);
                elems.push(geocoderElem);
            }

            this._geocoderElems = elems.reverse();
        },
        spliceWaypointsUR: function() {
            var args = [arguments[0], arguments[1]],
                i;

            for (i = 2; i < arguments.length; i++) {
                args.push(arguments[i] && arguments[i].hasOwnProperty('latLng') ? arguments[i] : L.Routing.waypoint(arguments[i]));
            }

            [].splice.apply(this._waypoints, args);

            while (this._waypoints.length < 2) {
                this.spliceWaypoints(this._waypoints.length, 0, null);
            }

            this._updateMarkers();
            this.fire('waypointschanged', {waypoints: this.getWaypoints()});
        }
    });
    re.classOverride.OverrideControl = L.Routing.Control.extend({
        onAdd: function(map) {
            var container = L.Routing.Itinerary.prototype.onAdd.call(this, map);

            this._map = map;

            this._map.addLayer(this._plan);

            if (this.options.useZoomParameter) {
                this._map.on('zoomend', function() {
                    this.route({
                        callback: L.bind(this._updateLineCallback, this)
                    });
                }, this);
            }

            if (this._plan.options.geocoder && this._plan.options.enableGeocoderInfo) {
                container.insertBefore(this._plan.createGeocoders(), container.firstChild);
            }

            return container;
        }
    });
    
    re.routeEditorPlan = new re.classOverride.OverridePlan([], {
        disableEditWaypoints: true,
        geocoder: re.config.googleGeocoder,
        enableGeocoderInfo: true,
        createMarker: re.createMarker,
        createLoadPoint: re.createLoadPoint,
        removeMarker: re.removeMarker,
        routeWhileDragging: false
    });
    re.routeControl = new re.classOverride.OverrideControl({
        language: 'ru',
        plan: re.routeEditorPlan,
        lineOptions: re.config.routeLineConfig
    });
    
    re.containers = {};
    re.containers.Correction = L.Control.extend({
        options: {
            position: 'topleft'
        },
        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom correction-panel');

            container.invisIco = false;

            function changeCorrectionIcon() {

                if (container.invisIco) {
                    container.invisIco = false;
                    container.style.backgroundImage = "url(assets/img/edit-icon-save.png)";
                    container.setAttribute('title', 'Завершить корректировку');
                    re.routeEditorPlan.options.disableEditWaypoints = false;
                } else {
                    container.invisIco = true;
                    container.style.backgroundImage = "url(assets/img/edit-icon.png)";
                    container.setAttribute('title', 'Корректировать маршрут');
                    re.routeEditorPlan.options.disableEditWaypoints = true;
                }
            }

            changeCorrectionIcon();
            
            L.DomEvent.addListener(container, 'click', changeCorrectionIcon);
            L.DomEvent.addListener(container, 'click', re.showHideCorrectionsMarkers);

            return container;
        }
    });
    re.containers.UndoRedo = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        initialize: function (index, options) {
            L.Util.setOptions(this, options);
        },
        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-control leaflet-control-custom undo-redo-panel');

            if (this._container) {
                this._container.innerHTML = '';
            }

            this._container = container;

            this.createUndoBtn();
            this.createRedoBtn();

            return container;
        },
        createUndoBtn: function() {
            var undoBtn = L.DomUtil.create('div', 'leaflet-bar leaflet-control-custom undo-button', this._container);

            undoBtn.innerHTML = '\<i class="fa fa-undo"></i>';
            L.DomEvent.addListener(undoBtn, 'click', function () {
                urstack.undo(re.routeEditorPlan);
            });
        },
        createRedoBtn: function () {
            var redoBtn = L.DomUtil.create('div', 'leaflet-bar leaflet-control-custom redo-button', this._container);

            redoBtn.innerHTML = '\<i class="fa fa-repeat"></i>';
            L.DomEvent.addListener(redoBtn, 'click', function () {
                urstack.redo(re.routeEditorPlan);
            });
        }
    });
    re.containers.OpenSaveRoute = L.Control.extend({
        options: {
            position: 'bottomright'
        },
        initialize: function (index, options) {
            L.Util.setOptions(this, options);
        },
        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-control leaflet-control-custom open-save-route-panel');

            if (this._container) {
                this._container.innerHTML = '';
            }

            this._container = container;

            this.createOpenBtn();
            this.createSaveBtn();
            this.createCloseBtn();

            return container;
        },
        createOpenBtn: function() {
            var openBtn = L.DomUtil.create('div', 'leaflet-bar leaflet-control-custom open-route-button', this._container);

            openBtn.innerHTML = '\<i class="fa fa-folder-open-o"></i>';

            L.DomEvent.addListener(openBtn, 'click', function () {
                openRouteModal.toggleModal();
            });
        },
        createSaveBtn: function () {
            var saveBtn = L.DomUtil.create('div', 'leaflet-bar leaflet-control-custom save-route-button', this._container);

            saveBtn.innerHTML = '\<i class="fa fa-floppy-o"></i>';

            L.DomEvent.addListener(saveBtn, 'click', function () {
                var route = re.saveToGeoJSON(re.routeEditorPlan.getWaypoints(), re.routeControl._routes[0].coordinates);

                RouteEditorService.addRoute(route).then(function() {
                    openRouteModal.updateContent();
                });
            });
        },
        createCloseBtn: function () {
            var closeBtn = L.DomUtil.create('div', 'leaflet-bar leaflet-control-custom close-route-button', this._container);

            closeBtn.innerHTML = '\<i class="fa fa-times"></i>';

            L.DomEvent.addListener(closeBtn, 'click', function () {
                re.routeEditorPlan.setWaypoints([]);
                waypointsPanel.update();
            });
        }
    });
    re.containers.RouteList = L.Control.extend({
        options: {
            position: 'bottomright'
        },
        initialize: function (index, options) {
            L.Util.setOptions(this, options);
        },
        onAdd: function (map) {
            var modal = L.DomUtil.create('div', 'leaflet-modal');

            if (this._container) {
                this._container.innerHTML = '';
            }

            this._container = modal;

            this.updateContent();

            return modal;
        },
        show: function() {
            this._container.style.display = 'block'
        },
        hide: function() {
            this._container.style.display = 'none'
        },
        toggleModal: function() {
            (this.isOpened()) ? this.hide() : this.show();
        },
        isOpened: function() {
            return this._container.style.display === 'block';
        },
        updateContent: function() {
            if (this._container) {
                this._container.innerHTML = '';
            }

            var close = L.DomUtil.create('span', 'leaflet-routing-remove-waypoint close-modal', this._container);

            var that = this;

            L.DomEvent.addListener(close, 'click', function () {
                that.hide();
            });

            RouteEditorService.getRoutes().then(function(data) {
                for (var key in data) {
                    that.createRouteItem(key);
                }

                var clearAllBtn = L.DomUtil.create('button', 'btn btn-default clear-routes-button', that._container);
                
                clearAllBtn.innerHTML = '<i class="fa fa-eraser"></i>';

                L.DomEvent.addListener(clearAllBtn, 'click', function () {
                    RouteEditorService.clearRoutes().then(function(data) {
                        that.updateContent();
                    });
                });

            });

        },
        createRouteItem: function(key) {
            var ItemContainer = L.DomUtil.create('div', 'route-list-container', this._container),
                item = L.DomUtil.create('span', 'route-list-item', ItemContainer),
                remove = L.DomUtil.create('span', 'route-list-remove', ItemContainer);

            var that = this;
            
            item.setAttribute('data-key', key);
            item.innerHTML = 'Route ' + key;

            L.DomEvent.addListener(item, 'click', function() {
                var key = this.getAttribute('data-key');

                RouteEditorService.getRoute(key).then(function(data) {
                    var loadedData = re.loadFromGeoJSON(data[key]);

                    re.routeEditorPlan.setWaypoints(loadedData.waypoints);

                    that.hide();
                });
            });

            remove.setAttribute('data-key', key);
            remove.innerHTML = '\<i class="fa fa-trash-o"></i>';

            L.DomEvent.addListener(remove, 'click', function() {
                RouteEditorService.removeRoute(this.getAttribute('data-key')).then(function(data) {
                    that.updateContent();
                });
            });
        }
    });
    re.containers.Waypoints = L.Control.extend({
        options: {
            position: 'topright'
        },
        initialize: function (index, options) {
            L.Util.setOptions(this, options);
        },
        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom waypoints-panel');

            this._container = container;
            this.update();
            
            return container;
        },

        update: function() {
            if (this._container) {
                this._container.innerHTML = '';
            }

            for (var i = 0; i < re.routeEditorPlan._waypoints.length; i++) {
                if (re.routeEditorPlan._waypoints[i].type === 'point') {
                    this.createInputField(i)
                }
            }

            if (re.routeEditorPlan._waypoints.length === 2) {
                for (var j = 0; j < re.routeEditorPlan._waypoints.length; j++) {
                    if (re.routeEditorPlan._waypoints[j].type === undefined) {
                        this.createEmptyInputField(j)
                    }
                }
            }

            var infoContainer = L.DomUtil.create('div', 'route-info-container', this._container),
                totalDistance = L.DomUtil.create('span', 'route-info-distance', infoContainer),
                totalTime = L.DomUtil.create('span', 'route-info-time', infoContainer);
            
            totalDistance.innerHTML = (routeTotalDistance) ? routeTotalDistance + ' километров' : ' ';
            totalTime.innerHTML = (routeTotalTime) ? parseInt(routeTotalTime, 10) + ' минут' : ' ';
        },
        createInputField: function(i) {
            var InputContainer = L.DomUtil.create('div', 'leaflet-routing-geocoder', this._container),
                input = L.DomUtil.create('input', 'form-control', InputContainer),
                remove = L.DomUtil.create('span', 'leaflet-routing-remove-waypoint', InputContainer);
            var btn;
            var that = this;

            input.setAttribute('value', re.routeEditorPlan._waypoints[i].name);
            input.setAttribute('title', re.routeEditorPlan._waypoints[i].name);
            
            new L.Routing.Autocomplete(input, function(r) {
                input.value = r.name;
                re.routeEditorPlan._waypoints[i].name = r.name;
                re.routeEditorPlan._waypoints[i].latLng = r.center;
                re.routeEditorPlan._waypoints[i].type = 'point';

                re.routeEditorPlan._updateMarkers();
                re.routeEditorPlan._fireChanged();

                this.update();
            }, this, L.extend({
                resultFn: re.config.googleGeocoder.geocode,
                resultContext: re.config.googleGeocoder,
                autocompleteFn:re.config.googleGeocoder.suggest,
                autocompleteContext: re.config.googleGeocoder
            }, true));

            remove.setAttribute('data-index', i);

            if (re.routeEditorPlan._waypoints[i].latLng !== null) {

                L.DomEvent.addListener(remove, 'click', function () {
                    var removeRange = re.prepareremoveIndexes(parseInt(this.getAttribute('data-index'),10), re.routeEditorPlan._waypoints);
                    urstack.add(removeRange.info);
                    re.routeEditorPlan.spliceWaypoints(removeRange.start, removeRange.end);
                    that.update()
                });

                btn = L.DomUtil.create('button', 'btn btn-default add-waypoint-button', InputContainer);

                L.DomEvent.addListener(btn, 'click', function () {
                    var index = parseInt(this.getAttribute('data-index'), 10) + 1;

                    re.routeEditorPlan.spliceWaypointsUR(index, 0, {
                        "name": '',
                        "latLng": null,
                        "type": 'point'
                    });

                    that.update();
                });

                btn.setAttribute('type', 'button');
                btn.setAttribute('data-index', i);
                btn.innerHTML = '\<i class="fa fa-plus"></i>'
            }
            else {
                L.DomEvent.addListener(remove, 'click', function () {
                    re.routeEditorPlan.spliceWaypoints(parseInt(this.getAttribute('data-index'), 10), 1);
                    that.update()
                });
            }
        },
        createEmptyInputField: function(i) {
            var InputContainer = L.DomUtil.create('div', 'leaflet-routing-geocoder', this._container),
                input = L.DomUtil.create('input', 'form-control', InputContainer);

            var that = this;

            input.setAttribute('value', re.routeEditorPlan._waypoints[i].name);
            input.setAttribute('title', re.routeEditorPlan._waypoints[i].name);

            new L.Routing.Autocomplete(input, function(r) {
                input.value = r.name;
                re.routeEditorPlan._waypoints[i].name = r.name;
                re.routeEditorPlan._waypoints[i].latLng = r.center;
                re.routeEditorPlan._waypoints[i].type = 'point';

                re.routeEditorPlan._updateMarkers();
                re.routeEditorPlan._fireChanged();

                this.update();
            }, this, L.extend({
                resultFn: re.config.googleGeocoder.geocode,
                resultContext: re.config.googleGeocoder,
                autocompleteFn: re.config.googleGeocoder.suggest,
                autocompleteContext: re.config.googleGeocoder
            }, true));

            var btn = L.DomUtil.create('button', 'btn btn-default add-waypoint-button', InputContainer);

            L.DomEvent.addListener(btn, 'click', function () {
                var index = parseInt(this.getAttribute('data-index'), 10) + 1;

                re.routeEditorPlan.spliceWaypointsUR(index, 0, {
                    "name": '',
                    "latLng": null,
                    "type": 'point'
                });

                that.update();
            });

            btn.setAttribute('type', 'button');
            btn.setAttribute('data-index', i);
            btn.innerHTML = '\<i class="fa fa-plus"></i>'
        }
    });
    re.containers.Errors = L.Routing.errorControl(re.routeControl, {
        position: 'bottomleft'
    });
    
    var waypointsPanel = new re.containers.Waypoints();
    var undoRedoPanel = new re.containers.UndoRedo();
    var routeCorrectionPanel = new re.containers.Correction();
    var openSaveRoutePanel = new re.containers.OpenSaveRoute();
    var openRouteModal = new re.containers.RouteList();
    var errorsPanel = re.containers.Errors;
    var clientLocation = re.config.webClientLocation;
    var routeControl =  re.routeControl;
    var truckPosition = re.config.truckPosition;
    var urstack = new re.utils.URStack();
    
    function init() {
        re.bindEvents();
    }

    angular.extend($scope, {
        dnepropetrovsk: {
            lat: 48.461995,
            lng: 35.049734,
            zoom: 10
        },
        layers: {
            baselayers: {
                googleRoadmap: {
                    name: 'Streets',
                    layerType: 'ROADMAP',
                    type: 'google',
                    layerOptions: {
                        showOnSelector: false
                    }
                },
                googleTerrain: {
                    name: 'Terrain',
                    layerType: 'TERRAIN',
                    type: 'google',
                    layerOptions: {
                        showOnSelector: false
                    }
                },
                googleHybrid: {
                    name: 'Hybrid',
                    layerType: 'HYBRID',
                    type: 'google',
                    layerOptions: {
                        showOnSelector: false
                    }
                },
                googleSatellite: {
                    name: 'Satellite',
                    layerType: 'SATELLITE',
                    type: 'google',
                    layerOptions: {
                        showOnSelector: false
                    }
                }

            },
            overlays: {
                Route: {
                    name: 'Route',
                    visible: false,
                    type: 'group',
                    layerParams: {
                        showOnSelector: false,
                        transparent: false
                    }
                }
            }
        },
        controls: {
            fullscreen: {
                position: 'topleft'
            },
            custom: [
                routeControl,
                undoRedoPanel,
                errorsPanel,
                waypointsPanel,
                clientLocation,
                routeCorrectionPanel,
                openSaveRoutePanel,
                truckPosition,
                openRouteModal
            ]
        },
        paths: {
            p1: {
                color: '#008000',
                weight: 2,
                latlngs: loadedData.route,
                layer: 'Route'
            }
        },
        defaults: {
            scrollWheelZoom: true,
            doubleClickZoom: false
        },
        geojson : {
            data: geoJSON,
            style: {
                fillColor: "green",
                weight: 2,
                opacity:.7,
                color: 'blue',
                dashArray: '3',
                fillOpacity: .7
            }
        },
        panels: {
            routeControl: routeControl,
            undoRedo: undoRedoPanel,
            errors: errorsPanel,
            waypoints: waypointsPanel,
            routeCorrection: routeCorrectionPanel,
            openSaveRoute: openSaveRoutePanel,
            openRouteModal: openRouteModal
        },
        urstack: urstack
    });

    init();
}

RouteEditorCtrl.$inject = ['$scope', 'RouteEditorService', 'PageTitleService'];

module.exports = RouteEditorCtrl;
