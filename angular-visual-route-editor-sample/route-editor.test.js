"use strict";

var module = angular.mock.module,
    inject = angular.mock.inject,
    testModule = require("./index.js");

describe('MapEditorToolkit Controller', function () {

    var $state,
        $rootScope,
        backend,
        controller,
        deferred,
        mockService = {};
    
    var testWaypoints = [
        {
            latLng: {
                lat: 0,
                lng: 0
            },
            name: 'test1',
            type: 'point',
            options: {}
        },
        {
            latLng: {
                lat: 1,
                lng: 1
            },
            name: 'test2',
            type: 'point',
            options: {}
        },
        {
            latLng: {
                lat: 2,
                lng: 2
            },
            name: 'test3',
            type: 'correction',
            options: {}
        }
    ];
    var testRouteCoords =[
        [34.978623, 48.462333], 
        [34.977617, 48.461794], 
        [34.979042, 48.460564], 
        [34.976032, 48.45895], 
        [34.973224, 48.457425]
    ];
    var geoJSONString = '{"type": "FeatureCollection", "features": [{"type": "Feature", "data": {"type": "point", "name": "вулиця Караваєва, 19А, Дніпропетровськ, Дніпропетровська область, Украина"}, "geometry": {"type": "Point", "coordinates": [34.978065490722656, 48.462791436756675]}, "properties": {"options": {"allowUTurn": false}}}, {"type": "Feature", "name": "ServerCoords", "geometry": {"type": "LineString", "coordinates": [[34.978623, 48.462333], [34.977617, 48.461794], [34.979042, 48.460564], [34.976032, 48.45895], [34.973224, 48.457425]]}, "properties": {}}]}';
    var urAction = {
        type: 'add',
        wpIndex: 3,
        wpType: 'correction',
        wpLatLng: {
            lat: 0,
            lng: 0
        }
    };

    beforeEach(function () {
        module('ui.router');
        module(testModule);

        inject(function(_$state_, _$rootScope_, _$q_, _$httpBackend_, _RouteEditorService_) {
            $state = _$state_;
            $rootScope = _$rootScope_;
            backend = _$httpBackend_;
            mockService = _RouteEditorService_;

            deferred = _$q_.defer();
            mockService.getLocation = function() {
                return deferred.promise;
            };

            deferred.resolve('Wellcome to route editor page');
        });

        inject(function (_$controller_, _$http_) {
            controller = _$controller_("MapEditorToolkit", {
                $scope : $rootScope,
                $http: _$http_
            });
        });
    });
    
    it('verifies state url', function () {
        var config = $state.get('routeEditor');
        expect(config.url).toBe('/route-editor');
    });

    it("should change to the authorization state", function(){
        $rootScope.$apply(function(){
            $state.go('routeEditor');
        });
        expect($state.current.name).toBe('routeEditor');
    });

    it('should contain a RouteEditorService', function() {
        expect(mockService).not.toBeNull();
    });

    it('should contain a RouteEditorService.getLocation', function() {
        expect(mockService.getLocation).toBeDefined();
    });

    it ('should test receive the fulfilled promise', function() {
        var result;
        mockService.getLocation().then(function(returnFromPromise) {
            result = returnFromPromise;
        });
        $rootScope.$apply();
        expect(result).toBe('Wellcome to route editor page');
    });

    it ('should add route', function() {
        backend.expect('POST', 'http://localhost:8081/zozengo-route-service/route-editor/routes').respond({});
        mockService.addRoute(' ').then(function(data) {
            expect(data).toEqual(jasmine.any(Object));
        },
            function(data) {
                expect(data).toBeDefined();
            }
        );
        backend.flush();
    });

    it ('should get route by id', function() {
        backend.expect('POST', 'http://localhost:8081/zozengo-route-service/route-editor/routes').respond({});
        mockService.getRoute('5').then(function(data) {
            expect(data).toEqual(jasmine.any(Object));
        });
        backend.flush();
    });

    it ('should all routes', function() {
        backend.expect('POST', 'http://localhost:8081/zozengo-route-service/route-editor/routes').respond({});
        mockService.getRoutes().then(function(data) {
            expect(data).toEqual(jasmine.any(Object));
        });
        backend.flush();
    });

    it ('should clear all routes', function() {
        backend.expect('POST', 'http://localhost:8081/zozengo-route-service/route-editor/routes').respond({});
        mockService.clearRoutes().then(function(data) {
            expect(data).toEqual(jasmine.any(Object));
        });
        backend.flush();
    });

    it ('should remove route by id', function() {
        backend.expect('POST', 'http://localhost:8081/zozengo-route-service/route-editor/routes').respond({});
        mockService.removeRoute('2').then(function(data) {
            expect(data).toEqual(jasmine.any(Object));
        });
        backend.flush();
    });

    it ('should add test default route', function() {
        backend.expect('POST', 'http://localhost:8081/zozengo-route-service/route-editor/routes').respond({});
        mockService.addRouteDefault(' ').then(function(data) {
            expect(data).toEqual(jasmine.any(Object));
        });
        backend.flush();
    });

    it('should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should initialize icons', function() {
        expect(controller.icons).toBeDefined();
        expect(controller.icons).toEqual(jasmine.any(Object));
    });

    it('should initialize correctionHide icon', function() {
        expect(controller.icons.correctionHide).toBeDefined();
        expect(controller.icons.correctionHide).toEqual(jasmine.any(Object));
    });

    it('should initialize correctionShow icon', function() {
        expect(controller.icons.correctionShow).toBeDefined();
        expect(controller.icons.correctionShow).toEqual(jasmine.any(Object));
    });

    it('should initialize waypoint icon', function() {
        expect(controller.icons.waypoint).toBeDefined();
        expect(controller.icons.waypoint).toEqual(jasmine.any(Object));
    });

    it('should initialize pulse icon', function() {
        expect(controller.icons.pulse).toBeDefined();
        expect(controller.icons.pulse).toEqual(jasmine.any(Object));
    });

    it('should initialize config', function() {
        expect(controller.config).toBeDefined();
        expect(controller.config).toEqual(jasmine.any(Object));
    });

    it('should initialize config routeLine', function() {
        expect(controller.config.routeLine).toBeDefined();
        expect(controller.config.routeLine).toEqual(jasmine.any(Object));
    });

    it('should initialize config googleGeocoder', function() {
        expect(controller.config.googleGeocoder).toBeDefined();
        expect(controller.config.googleGeocoder).toEqual(jasmine.any(Object));
    });

    it('should initialize config webClientLocation', function() {
        expect(controller.config.webClientLocation).toBeDefined();
        expect(controller.config.webClientLocation).toEqual(jasmine.any(Object));
    });

    it('should initialize config realtime', function() {
        expect(controller.config.realtime).toBeDefined();
        expect(controller.config.realtime).toEqual(jasmine.any(Object));
    });

    it('should initialize config truckPosition', function() {
        expect(controller.config.truckPosition).toBeDefined();
        expect(controller.config.truckPosition).toEqual(jasmine.any(Object));
    });
    
    it('should initialize classOverride', function() {
        expect(controller.classOverride).toBeDefined();
        expect(controller.classOverride).toEqual(jasmine.any(Object));
    });

    it('should initialize classOverride OverridePlan', function() {
        expect(controller.classOverride.OverridePlan).toBeDefined();
        expect(controller.classOverride.OverridePlan).toEqual(jasmine.any(Function));
    });

    it('should initialize classOverride OverrideControl', function() {
        expect(controller.classOverride.OverrideControl).toBeDefined();
        expect(controller.classOverride.OverrideControl).toEqual(jasmine.any(Function));
    });
    
    it('should initialize routeEditorPlan', function() {
        expect(controller.routeEditorPlan).toBeDefined();
        expect(controller.routeEditorPlan).toEqual(jasmine.any(Object));
    });
    
    it('should initialize routeControl', function() {
        expect(controller.routeControl).toBeDefined();
        expect(controller.routeControl).toEqual(jasmine.any(Object));
    });

    it('should initialize containers', function() {
        expect(controller.containers).toBeDefined();
        expect(controller.containers).toEqual(jasmine.any(Object));
    });
    
    it('should initialize containers Correction', function() {
        expect(controller.containers.Correction).toBeDefined();
        expect(controller.containers.Correction).toEqual(jasmine.any(Function));
    });

    it('should initialize containers UndoRedo', function() {
        expect(controller.containers.UndoRedo).toBeDefined();
        expect(controller.containers.UndoRedo).toEqual(jasmine.any(Function));
    });
    
    it('should initialize containers OpenSaveRoute', function() {
        expect(controller.containers.OpenSaveRoute).toBeDefined();
        expect(controller.containers.OpenSaveRoute).toEqual(jasmine.any(Function));
    });

    it('should initialize containers RouteList', function() {
        expect(controller.containers.RouteList).toBeDefined();
        expect(controller.containers.RouteList).toEqual(jasmine.any(Function));
    });

    it('should initialize containers Waypoints', function() {
        expect(controller.containers.Waypoints).toBeDefined();
        expect(controller.containers.Waypoints).toEqual(jasmine.any(Function));
    });

    it('should initialize containers Errors', function() {
        expect(controller.containers.Errors).toBeDefined();
        expect(controller.containers.Errors).toEqual(jasmine.any(Object));
    });
    
    it('should initialize utils', function() {
        expect(controller.utils).toBeDefined();
        expect(controller.utils).toEqual(jasmine.any(Object));
    });
    
    it('should initialize utils URStack', function() {
        expect(controller.utils.URStack).toBeDefined();
        expect(controller.utils.URStack).toEqual(jasmine.any(Function));
    });

    it('should URStack add action', function() {
        var commands = $rootScope.urstack.getCommands();

        $rootScope.urstack.add(urAction);
        expect(commands.undo.length).toEqual(1);
    });

    it('should URStack undo action', function() {
        var commands = $rootScope.urstack.getCommands();

        $rootScope.urstack.add(urAction);
        expect(commands.undo.length).toEqual(1);

        controller.routeEditorPlan.setWaypoints(testWaypoints);
        
        $rootScope.urstack.undo(controller.routeEditorPlan);
        expect(commands.undo.length).toEqual(0);
    });

    it('should URStack redo action', function() {
        var commands = $rootScope.urstack.getCommands();

        $rootScope.urstack.add(urAction);
        $rootScope.urstack.add(urAction);
        $rootScope.urstack.add(urAction);
        expect(commands.undo.length).toEqual(3);

        controller.routeEditorPlan.setWaypoints(testWaypoints);

        $rootScope.urstack.undo(controller.routeEditorPlan);
        $rootScope.urstack.undo(controller.routeEditorPlan);
        expect(commands.undo.length).toEqual(1);

        $rootScope.urstack.redo(controller.routeEditorPlan);
        expect(commands.undo.length).toEqual(2);
    });

    it('should URStack hasUndo', function() {
        var hasUndo;

        hasUndo = $rootScope.urstack.hasUndo();
        expect(hasUndo).toEqual(false);
        
        $rootScope.urstack.add(urAction);
        hasUndo = $rootScope.urstack.hasUndo(); 
        expect(hasUndo).toEqual(true);
    });

    it('should URStack hasRedo', function() {
        var hasRedo;
        
        $rootScope.urstack.add(urAction);
        hasRedo = $rootScope.urstack.hasRedo();
        expect(hasRedo).toEqual(false);

        $rootScope.urstack.undo(controller.routeEditorPlan);
        hasRedo = $rootScope.urstack.hasRedo();
        expect(hasRedo).toEqual(true);
    });

    it('should URStack sort undo', function() {
        var result;

        result = $rootScope.urstack.sort.undoSort({ wpIndex: 1}, { wpIndex: 2});
        expect(result).toEqual(-1);

        result = $rootScope.urstack.sort.undoSort({ wpIndex: 5}, { wpIndex: 3});
        expect(result).toEqual(1);

        result = $rootScope.urstack.sort.undoSort({ wpIndex: 4}, { wpIndex: 4});
        expect(result).toEqual(0);
    });

    it('should URStack sort redo', function() {
        var result;

        result = $rootScope.urstack.sort.redoSort({ wpIndex: 1}, { wpIndex: 2});
        expect(result).toEqual(1);

        result = $rootScope.urstack.sort.redoSort({ wpIndex: 5}, { wpIndex: 3});
        expect(result).toEqual(0);

        result = $rootScope.urstack.sort.redoSort({ wpIndex: 4}, { wpIndex: 4});
        expect(result).toEqual(-1);
    });
    
    it('should create marker', function() {
        var result = controller.createMarker(0, {latLng: [0,0]});
        expect(result).toEqual(jasmine.any(Object));
    });

    it('should remove marker', function() {
        var result = controller.removeMarker(0);
        expect(result).toEqual(jasmine.any(Object));
    });
    
    it('should hide show correction icon', function() {
        var result = controller.showHideCorrectionsMarkers();
        expect(result).toEqual(jasmine.any(Object));
    });

    it('should create loadPoint', function() {
        var result = controller.createLoadPoint(0, {latLng: [0,0]});
        expect(result).toEqual(jasmine.any(Object));
    });

    it('should add waypoint', function() {
        controller.routeEditorPlan.setWaypoints(testWaypoints);
        
        var wps = controller.routeEditorPlan._waypoints;

        expect(wps.length).toEqual(3);
        controller.routeEditorPlan.spliceWaypoints(wps.length, 0, {latLng: [3,3]});
        controller.routeEditorPlan.spliceWaypoints(wps.length, 0, {latLng: [5,5]});
        controller.routeEditorPlan.spliceWaypoints(wps.length, 0, {latLng: [7,7]});
        expect(wps.length).toEqual(6);
    });

    it('should remove waypoint', function() {
        controller.routeEditorPlan.setWaypoints(testWaypoints);

        var wps = controller.routeEditorPlan._waypoints;
        
        expect(wps.length).toEqual(3);
        controller.routeEditorPlan.spliceWaypoints(0,1);
        expect(wps.length).toEqual(2);
    });

    it('should prepare indexes for remove waypoints', function() {
        var result = controller.prepareremoveIndexes(0, testWaypoints);
        expect(result).toEqual(jasmine.any(Object));
        expect(result.start).toEqual(jasmine.any(Number));
        expect(result.end).toEqual(jasmine.any(Number));
        expect(result.info).toEqual(jasmine.any(Object));
    });

    it('should save waypoints to geoJSON string', function() {
        var result = controller.saveToGeoJSON(testWaypoints, testRouteCoords);
        expect(result).toEqual(jasmine.any(String));
    });

    it('should load waypoints from geoJSON', function() {
        var result = controller.loadFromGeoJSON(geoJSONString);
        expect(result).toEqual(jasmine.any(Object));
        expect(result.waypoints).toEqual(jasmine.any(Object));
        expect(result.route).toEqual(jasmine.any(Object));
    });

    it('should init undoRedo panel', function() {
        var panel = $rootScope.panels.undoRedo;
        expect(panel).toBeDefined();
        expect(panel).toEqual(jasmine.any(Object));
    });

    it('should init routeControl panel', function() {
        var panel = $rootScope.panels.routeControl;
        expect(panel).toBeDefined();
        expect(panel).toEqual(jasmine.any(Object));
    });

    it('should init errors panel', function() {
        var panel = $rootScope.panels.errors;
        expect(panel).toBeDefined();
        expect(panel).toEqual(jasmine.any(Object));
    });

    it('should init waypoints panel', function() {
        var panel = $rootScope.panels.waypoints;
        expect(panel).toBeDefined();
        expect(panel).toEqual(jasmine.any(Object));
    });

    it('should init routeCorrection panel', function() {
        var panel = $rootScope.panels.routeCorrection;
        expect(panel).toBeDefined();
        expect(panel).toEqual(jasmine.any(Object));
    });

    it('should init openSaveRoute panel', function() {
        var panel = $rootScope.panels.openSaveRoute;
        expect(panel).toBeDefined();
        expect(panel).toEqual(jasmine.any(Object));
    });

    it('should init openRoute panel', function() {
        var panel = $rootScope.panels.openRouteModal;
        expect(panel).toBeDefined();
        expect(panel).toEqual(jasmine.any(Object));
    });
});