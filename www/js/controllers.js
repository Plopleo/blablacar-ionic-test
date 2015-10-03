angular.module('blablacar.controllers', [])

    .controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
        $scope.username = AuthService.username();

        $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
            var alertPopup = $ionicPopup.alert({
                title: 'Unauthorized!',
                template: 'You are not allowed to access this resource.'
            });
        });

        $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
            AuthService.logout();
            $state.go('login');
            var alertPopup = $ionicPopup.alert({
                title: 'Session Lost!',
                template: 'Sorry, You have to login again.'
            });
        });

          $scope.setCurrentUsername = function(name) {
            $scope.username = name;
        };
    })
    
    .controller('LoginCtrl', function ($scope, $state, $ionicPopup, AuthService, UtilisateurCreer) {
        $scope.data = {};

        $scope.login = function(data) {
            AuthService.login(data.username, data.password).then(function(authenticated) {
                $state.go('tab.trajets', {}, {reload: true});
                $scope.setCurrentUsername(data.username);
        }, function(err) {
            var alertPopup = $ionicPopup.alert({
                title: 'Connexion refusée',
                template: 'Vérifiez votre email & password'
            });
        });
    };

        $scope.register = function(data) {            
            $scope.data = {}

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
              template: '<label>Nom:</label><input type="text" ng-model="data.nom"></br><label>Prenom:</label><input type="text" ng-model="data.prenom"></br>'+
                        '<label>Email:</label><input type="email" ng-model="data.email"></br><label>Mot de passe:</label><input type="password" ng-model="data.password">'+
                        '</br><span class="assertive">{{message}}</span>',
              title: 'Créez votre compte:',
              scope: $scope,
              buttons: [
                { text: 'Annuler' },
                {
                  text: '<b>Créer!</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    if ($scope.data.nom && $scope.data.prenom && $scope.data.email && $scope.data.password) {
                        UtilisateurCreer.createOne($scope.data.nom, $scope.data.prenom, $scope.data.email, $scope.data.password).success(function (message) {
                            $scope.messageCreation = message;
                        });      
                    } else if(!$scope.data.email){
                        e.preventDefault();
                        $scope.message = "* Le champ mail n'est pas valide";
                    } else {
                        e.preventDefault();
                        $scope.message = "* Vous devez renseigner tous les champs !";
                    }
                  }
                }
              ]
            });
        };

    })    

    .controller('RechercherCtrl', function ($scope, TrajetsRecherche) {
        $scope.searchTrajet = function (villeDepart, villeArrivee, date) {
            TrajetsRecherche.getTrajetsByVilles(villeDepart, villeArrivee, date).success(function (trajets) {
               $scope.trajets = trajets;
            });
        }
    })

    .controller('RechercherDetailCtrl', function ($scope, $stateParams, Trajets) {
        $scope.trajet = Trajets.get({trajetId: $stateParams.trajetId});
    })

    .controller('ProposerCtrl', function ($scope, TrajetCreer) {
         $scope.createTrajet = function (villeDepart, villeArrivee, date, nbPlaces) {
            TrajetCreer.createOne(villeDepart, villeArrivee, date, nbPlaces).success(function (message) {
               $scope.message = message;
            });
        }
    })
    
    .controller('ProfilCtrl', function ($scope, AuthService, $state) {
        $scope.logout = function() {
            AuthService.logout();
            $state.go('login');
        };
    })

    .controller('TrajetsCtrl', function ($scope, Trajets) {
        $scope.trajets = Trajets.query();
    })

    .controller('TrajetsDetailCtrl', function ($scope, $stateParams, Trajets) {
        $scope.trajet = Trajets.get({trajetId: $stateParams.trajetId});
    });