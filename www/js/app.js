angular.module('blablacar', ['ionic', 'blablacar.controllers', 'blablacar.services', 'blablacar.directives'])

.run(function ($ionicPlatform, $rootScope, $state, AuthService, AUTH_EVENTS) {
    $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {       
        if ('data' in next && 'authorizedRoles' in next.data) {
            var authorizedRoles = next.data.authorizedRoles;
            if (!AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                $state.go($state.current, {}, {reload: true});
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            }
        }

        if (!AuthService.isAuthenticated()) {
            if (next.name !== 'login') {
                event.preventDefault();
                $state.go('login');
            }
        }
    });

})

.config(function ($stateProvider, $urlRouterProvider, USER_ROLES) {

    $stateProvider

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })

    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    .state('tab.trajets', {
        url: '/trajets',
        views: {
          'tab-trajets': {
            templateUrl: 'templates/tab-trajets.html',
            controller: 'TrajetsCtrl'
        }
    }
})

    .state('tab.trajets-detail', {
        url: '/trajets/:trajetId',
        views: {
        'tab-trajets': {
            templateUrl: 'templates/tab-trajets-detail.html',
            controller: 'TrajetsDetailCtrl'
        }
      }        
    })

    .state('tab.rechercher', {
        url: '/rechercher',
        views: {
          'tab-rechercher': {
            templateUrl: 'templates/tab-rechercher.html',
            controller: 'RechercherCtrl'
            }
        }
    })

    .state('tab.rechercher-detail', {
        url: '/rechercher/:trajetId',
        views: {
        'tab-rechercher': {
            templateUrl: 'templates/tab-rechercher-detail.html',
            controller: 'RechercherDetailCtrl'
        }
      }        
    })

    .state('tab.proposer', {
        url: '/proposer',
        views: {
          'tab-proposer': {
            templateUrl: 'templates/tab-proposer.html',
            controller: 'ProposerCtrl'
        }
    }
})   

    .state('tab.profil', {
      url: '/profil',
      views: {
        'tab-profil': {
          templateUrl: 'templates/tab-profil.html',
          controller: 'ProfilCtrl'
      }
  }
})

    $urlRouterProvider.otherwise('/tab/trajets');

});