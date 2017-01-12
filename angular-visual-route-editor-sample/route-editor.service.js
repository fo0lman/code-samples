"use strict";

function RouteEditorService($q, $http) {
    
    var reService = this,
        ROUTES_SERVER = 'http://localhost:8081/zozengo-route-service';

    reService.getLocation = function () {
        return $q(function (resolve) {
            resolve("Wellcome to route editor page");
        });
    };

    reService.addRoute = function(route) {
        return $http({
            method: 'POST',
            url: ROUTES_SERVER + '/route-editor/routes',
            data: {
                action: 'add',
                route: route
            },
            withCredentials: false
        }).then(function(response) {
            return response.data;
        });
    };

    reService.addRouteDefault = function() {
        return $http({
            method: 'POST',
            url: ROUTES_SERVER + '/route-editor/routes',
            data: {
                action: 'add',
                route: '{"type":"FeatureCollection","features":[{"type":"Feature","data":{"type":"point","name":"вулиця Караваєва, 19А, Дніпропетровськ, Дніпропетровська область, Украина"},"geometry":{"type":"Point","coordinates":[34.978065490722656,48.462791436756675]},"properties":{"options":{"allowUTurn":false}}},{"type":"Feature","data":{"type":"correction","name":"вулиця Чухновського, 139, Дніпропетровськ, Дніпропетровська область, Украина"},"geometry":{"type":"Point","coordinates":[34.97480392456055,48.4559042703728]},"properties":{"options":{"allowUTurn":false}}},{"type":"Feature","data":{"type":"correction","name":"вулиця Чухновського, 32, Дніпропетровськ, Дніпропетровська область, Украина"},"geometry":{"type":"Point","coordinates":[34.988365173339844,48.458124202908934]},"properties":{"options":{"allowUTurn":false}}},{"type":"Feature","data":{"type":"point","name":"Васильківська вулиця, 89Б, Дніпропетровськ, Дніпропетровська область, Украина"},"geometry":{"type":"Point","coordinates":[34.99197006225585,48.44947161005322]},"properties":{"options":{"allowUTurn":false}}},{"type":"Feature","data":{"type":"correction","name":"вулиця Володимира Хрінникова, Дніпропетровськ, Дніпропетровська область, Украина"},"geometry":{"type":"Point","coordinates":[35.00527381896973,48.45055326479933]},"properties":{"options":{"allowUTurn":false}}},{"type":"Feature","data":{"type":"point","name":"вулиця Дмитра Кедріна, 58-60, Дніпропетровськ, Дніпропетровська область, Украина"},"geometry":{"type":"Point","coordinates":[35.001840591430664,48.44058978410332]},"properties":{"options":{"allowUTurn":false}}},{"type":"Feature","data":{"type":"correction","name":"вулиця Новокримська, 6, Дніпропетровськ, Дніпропетровська область, Украина"},"geometry":{"type":"Point","coordinates":[35.00870704650879,48.427378042075105]},"properties":{"options":{"allowUTurn":false}}},{"type":"Feature","data":{"type":"point","name":"вулиця Січових Стрільців, 135, Дніпропетровськ, Дніпропетровська область, Украина"},"geometry":{"type":"Point","coordinates":[35.02424240112305,48.439678739773015]},"properties":{}},{"type":"Feature","data":{"type":"correction","name":"Курганська вулиця, 11, Дніпропетровськ, Дніпропетровська область, Украина"},"geometry":{"type":"Point","coordinates":[35.04243850708007,48.44918696023804]},"properties":{"options":{"allowUTurn":false}}},{"type":"Feature","data":{"type":"point","name":"вулиця Олеся Гончара, 5, Дніпропетровськ, Дніпропетровська область, Украина"},"geometry":{"type":"Point","coordinates":[35.05891799926758,48.45362731565214]},"properties":{"options":{"allowUTurn":false}}},{"type":"Feature","name":"ServerCoords","geometry":{"type":"LineString","coordinates":[[34.978623,48.462333],[34.977617,48.461794],[34.979042,48.460564],[34.976032,48.45895],[34.973224,48.457425],[34.9732,48.457002],[34.97321,48.455846],[34.974609,48.456014],[34.974616,48.455898],[34.974662,48.455155],[34.975385,48.455165],[34.97595,48.455194],[34.977471,48.455353],[34.977216,48.456291],[34.977164,48.456524],[34.979825,48.456851],[34.981944,48.457085],[34.984363,48.457356],[34.986789,48.457591],[34.987231,48.457679],[34.987681,48.457743],[34.988432,48.457814],[34.990231,48.457986],[34.990991,48.458068],[34.991031,48.457298],[34.990112,48.457202],[34.989875,48.457123],[34.989616,48.457096],[34.98969,48.456971],[34.989748,48.456833],[34.989839,48.456743],[34.990009,48.456639],[34.990357,48.45655],[34.990734,48.456506],[34.990927,48.45648],[34.991083,48.456433],[34.991193,48.456364],[34.991227,48.456308],[34.991224,48.456253],[34.99115,48.456109],[34.990633,48.455443],[34.990206,48.454888],[34.98999,48.454422],[34.989307,48.454603],[34.989216,48.45453],[34.989224,48.45435],[34.989128,48.454028],[34.988337,48.454031],[34.988339,48.453722],[34.988496,48.452022],[34.988294,48.451661],[34.988485,48.451559],[34.989402,48.451066],[34.989705,48.450976],[34.989931,48.450892],[34.990159,48.450788],[34.990266,48.45054],[34.990556,48.449954],[34.990696,48.449218],[34.991989,48.449273],[34.992572,48.449299],[34.992752,48.448386],[34.992677,48.44765],[34.993365,48.447641],[34.994729,48.44773],[34.996095,48.447862],[34.997561,48.44821],[34.997548,48.44827],[34.99789,48.448314],[34.998923,48.448094],[34.999189,48.448024],[35.000547,48.447684],[35.000714,48.447647],[35.000893,48.447604],[35.001859,48.449385],[35.002097,48.449329],[35.002425,48.449248],[35.002653,48.449261],[35.003084,48.44919],[35.003781,48.450604],[35.003975,48.45099],[35.005338,48.450679],[35.005606,48.450619],[35.005699,48.4506],[35.006359,48.450468],[35.005962,48.449241],[35.005648,48.448271],[35.005335,48.447316],[35.005316,48.44726],[35.005298,48.447204],[35.005106,48.44663],[35.004943,48.446177],[35.004603,48.445142],[35.004556,48.444882],[35.004554,48.444617],[35.004584,48.443843],[35.004584,48.443542],[35.004584,48.443496],[35.004584,48.443444],[35.004589,48.442836],[35.004562,48.442538],[35.004497,48.442248],[35.004358,48.44187],[35.003978,48.441165],[35.003626,48.440501],[35.003265,48.439853],[35.003053,48.439421],[35.001421,48.439803],[35.000206,48.440088],[34.99909,48.438026],[34.999022,48.437899],[35.001841,48.437229],[35.001991,48.437193],[35.00181,48.436848],[35.001767,48.436767],[35.001728,48.436693],[35.001666,48.436575],[35.001605,48.436462],[35.00157,48.436397],[35.00052,48.434471],[34.999584,48.432755],[34.999931,48.432673],[35.000548,48.432524],[35.000695,48.432491],[35.001612,48.432273],[35.002655,48.432021],[35.002812,48.431983],[35.00357,48.431806],[35.004721,48.431543],[35.004898,48.431499],[35.0056,48.431341],[35.006694,48.431089],[35.006923,48.431033],[35.006599,48.430425],[35.006565,48.430366],[35.006451,48.430123],[35.005971,48.429203],[35.005935,48.429133],[35.005816,48.428901],[35.005498,48.428324],[35.005582,48.428303],[35.008553,48.427589],[35.008669,48.427418],[35.008719,48.427408],[35.008851,48.427385],[35.008913,48.427503],[35.009001,48.427662],[35.009229,48.428081],[35.009468,48.428516],[35.009592,48.428744],[35.009931,48.42936],[35.010292,48.430035],[35.010395,48.430223],[35.010641,48.430165],[35.010759,48.430138],[35.011815,48.429891],[35.012123,48.429815],[35.013198,48.42955],[35.014226,48.4293],[35.014377,48.429263],[35.014479,48.429238],[35.01458,48.429212],[35.014636,48.429313],[35.015358,48.430569],[35.015426,48.430688],[35.015886,48.431492],[35.016414,48.432425],[35.016618,48.432756],[35.016891,48.433201],[35.016994,48.433382],[35.017421,48.434125],[35.017901,48.434962],[35.018456,48.435912],[35.018672,48.436246],[35.018949,48.43664],[35.019338,48.437194],[35.019379,48.437251],[35.019437,48.437325],[35.019962,48.437929],[35.020515,48.438547],[35.021152,48.43922],[35.021513,48.439616],[35.022211,48.440356],[35.022274,48.44042],[35.022434,48.440359],[35.023136,48.440091],[35.024212,48.439677],[35.02422,48.439686],[35.02483,48.440354],[35.027105,48.4428],[35.027789,48.443505],[35.028568,48.444318],[35.028805,48.444571],[35.02911,48.444906],[35.029155,48.444957],[35.029314,48.445124],[35.02945,48.445255],[35.031108,48.446859],[35.031561,48.447335],[35.031705,48.447485],[35.031955,48.447737],[35.032097,48.447878],[35.032156,48.447937],[35.033087,48.448866],[35.033894,48.44969],[35.034761,48.450526],[35.035667,48.451296],[35.035791,48.451239],[35.036167,48.451064],[35.037341,48.450517],[35.037563,48.450414],[35.038244,48.450012],[35.038571,48.449823],[35.038639,48.449649],[35.039504,48.44897],[35.040374,48.448328],[35.040854,48.448038],[35.041327,48.448383],[35.041864,48.448826],[35.042253,48.449259],[35.042334,48.449349],[35.040761,48.450059],[35.039755,48.450538],[35.03871,48.451033],[35.038314,48.451235],[35.037045,48.45183],[35.036692,48.451995],[35.036589,48.452043],[35.037488,48.452771],[35.038412,48.453534],[35.039389,48.454315],[35.040473,48.455188],[35.041122,48.455723],[35.04134,48.455903],[35.041546,48.456065],[35.041758,48.456233],[35.041915,48.456368],[35.04213,48.456555],[35.042343,48.45674],[35.042489,48.456866],[35.042688,48.457039],[35.043175,48.457473],[35.043242,48.457531],[35.043464,48.457724],[35.043815,48.458021],[35.04386,48.458059],[35.044122,48.458288],[35.044175,48.458335],[35.044253,48.4584],[35.044685,48.458758],[35.044792,48.458848],[35.044841,48.458888],[35.045042,48.459055],[35.045306,48.459273],[35.04535,48.45931],[35.045548,48.459482],[35.045761,48.459656],[35.046074,48.459923],[35.046176,48.460009],[35.046618,48.460364],[35.046709,48.460438],[35.046968,48.460652],[35.047433,48.461035],[35.047555,48.461135],[35.047601,48.461174],[35.047898,48.461418],[35.048479,48.461083],[35.048624,48.461004],[35.048875,48.460861],[35.049232,48.460668],[35.049369,48.46059],[35.049431,48.460555],[35.049533,48.460499],[35.04999,48.460248],[35.050696,48.459894],[35.051099,48.459666],[35.051409,48.459491],[35.05187,48.45923],[35.05223,48.459027],[35.052631,48.458801],[35.052895,48.458651],[35.053008,48.458588],[35.053169,48.458499],[35.053348,48.458402],[35.053768,48.458172],[35.05418,48.457946],[35.054694,48.457665],[35.054823,48.457595],[35.055498,48.457225],[35.055579,48.457181],[35.055872,48.457021],[35.056035,48.456936],[35.056125,48.456889],[35.05619,48.45685],[35.056344,48.456759],[35.056515,48.456671],[35.056933,48.456458],[35.057202,48.45632],[35.057363,48.456233],[35.057947,48.455915],[35.058672,48.455526],[35.059097,48.455297],[35.059191,48.455246],[35.059861,48.454884],[35.059321,48.454448],[35.05906,48.454237],[35.058964,48.45416],[35.058647,48.453904],[35.058582,48.453852],[35.058659,48.453811],[35.058869,48.453698],[35.05895,48.453654]]},"properties":{}}]}'
            },
            withCredentials: false
        }).then(function(response) {
            return response.data;
        });
    };

    reService.getRoute = function(id) {
        return $http({
            method: 'POST',
            url: ROUTES_SERVER + '/route-editor/routes',
            data: {
                action: 'getRoute',
                id: id
            },
            withCredentials: false
        }).then(function(response) {
            return response.data;
        });
    };

    reService.getRoutes = function() {
       return $http({
            method: 'POST',
           url: ROUTES_SERVER + '/route-editor/routes',
            data: {
                action: 'getRoutes'
            },
            withCredentials: false
        }).then(function(response) {
            return response.data;
        });
    };

    reService.clearRoutes = function() {
        return $http({
            method: 'POST',
            url: ROUTES_SERVER + '/route-editor/routes',
            data: {
                action: 'clear'
            },
            withCredentials: false
        }).then(function(response) {
            return response.data;
        });
    };

    reService.removeRoute = function(id) {
        return $http({
            method: 'POST',
            url: ROUTES_SERVER + '/route-editor/routes',
            data: {
                action: 'remove',
                id: id
            },
            withCredentials: false
        }).then(function(response) {
            return response.data;
        });
    };
}

RouteEditorService.$inject = ['$q', '$http'];

module.exports = RouteEditorService;
