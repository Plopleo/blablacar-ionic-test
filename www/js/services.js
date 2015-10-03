angular.module('blablacar.services', ['ngResource'])

    .factory('Trajets', function ($resource) {
        return $resource('http://localhost:8100/trajets/:trajetId');
    })


    .factory('TrajetsRecherche', function ($http) {
	    var result = {};

	    result.getTrajetsByVilles = function (villeDepart, villeArrivee, date) {
	      return $http({
	        method: 'GET', 
	        url: 'http://localhost:8100/trajets?villeDepart='+ villeDepart +'&villeArrivee='+villeArrivee+'&date='+date
	      });
	    }

	    return result;
  })

    .factory('TrajetCreer', function ($http) {
        var result = {};

        result.createOne = function (villeDepart, villeArrivee, date, nbPlaces) {
            return $http({
                method: "POST",
                url: "http://localhost:8100/trajets",
                data: {
                    villeDepart: villeDepart,
                    villeArrivee: villeArrivee,
                    date: date,
                    nbPlaces: nbPlaces
                }
            });           
        }

        return result;
  })

    .factory('UtilisateurCreer', function ($http) {
        var result = {};

        result.createOne = function (nom, prenom, mail, password) {
            return $http({
                method: "POST",
                url: "http://localhost:8100/utilisateurs",
                data: {
                    nom: nom,
                    prenom: prenom,
                    mail: mail,
                    password: password
                }
            });           
        }

        return result;
  })

    .service('AuthService', function ($q, $http, USER_ROLES) {
    	var LOCAL_TOKEN_KEY = 'yourTokenKey';
    	var username = '';
    	var isAuthenticated = false;
    	var role = '';
    	var authToken;

    	function loadUserCredentials() {
    		var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    		if (token) {
    			useCredentials(token);
    		}
    	}

    	function storeUserCredentials(token) {
    		window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    		useCredentials(token);
    	}

    	function useCredentials(token) {
            splited = token.split('£');
            username = splited[0];
            nom = splited[1];
    		prenom = splited[2];
    		isAuthenticated = true;
    		authToken = token;

    		if (username == 'admin') {
    			role = USER_ROLES.admin
    		}
    		if (username == 'user') {
    			role = USER_ROLES.public
    		}

            // Set the token as header for your requests!
            $http.defaults.headers.common['X-Auth-Token'] = token;
        }

        function destroyUserCredentials() {
        	authToken = undefined;
        	username = '';
        	isAuthenticated = false;
        	$http.defaults.headers.common['X-Auth-Token'] = undefined;
        	window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        }

        var login = function (mail, password) {
            return $q(function(resolve, reject) {
                $http({
                    method: 'GET', 
                    url: 'http://localhost:8100/utilisateurs?mail='+ mail +'&password='+password
                }).success(function(data, status, headers, config) {
                    if (data.nom) {
                        storeUserCredentials(mail + '£' + data.nom + '£' + data.prenom +'£yourServerToken');
                        resolve('Login success.');
                    } else {
                       reject('Login Failed.');
                    }
                });               
            });
        };
        
        var logout = function() {
        	destroyUserCredentials();
        };
        
        var isAuthorized = function (authorizedRoles) {
        	if (!angular.isArray(authorizedRoles)) {
        		authorizedRoles = [authorizedRoles];
        	}
        	return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
        };
        
        loadUserCredentials();

        return {
        	login: login,
        	logout: logout,
        	isAuthorized: isAuthorized,
        	isAuthenticated: function() {return isAuthenticated;},
        	username: function() {return username;},
        	role: function() {return role;}
        };
    })

    .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    	return {
    		responseError: function (response) {
    			$rootScope.$broadcast({
    				401: AUTH_EVENTS.notAuthenticated,
    				403: AUTH_EVENTS.notAuthorized
    			}[response.status], response);
    			return $q.reject(response);
    		}
    	};
    })

    .config(function ($httpProvider) {
    	$httpProvider.interceptors.push('AuthInterceptor');
    });
