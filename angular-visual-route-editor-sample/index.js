'use strict';
//CSS
require('font-awesome/css/font-awesome.css');
require('leaflet/dist/leaflet.css');
require('leaflet-routing-machine/dist/leaflet-routing-machine.css');
require('leaflet-fullscreen/dist/leaflet.fullscreen.css');
require('leaflet.locatecontrol/dist/L.Control.Locate.css');
require('leaflet-pulse-icon/dist/L.Icon.Pulse.css');

//JS
require('leaflet');
require('leaflet-fullscreen');
require('leaflet-realtime');
require('leaflet.locatecontrol');
require('leaflet-pulse-icon');
require('leaflet-routing-machine');
require('angular-leaflet-directive');

require('./libs/control-geocoder.js');
require('./libs/leaflet-google.js');
require('./libs/leaflet-ru.js');

var routes = require("./route-editor.routes");
var service = require("./route-editor.service");
var ctrl = require("./route-editor.ctrl");
var title = require("../utils/set-page-title.js");

var RouteEditorModule = angular.module("RouteEditorModule", ['leaflet-directive', title])
    .config(routes)
    .service("RouteEditorService", service)
    .controller("MapEditorToolkit", ctrl)
    .name;

module.exports = RouteEditorModule;