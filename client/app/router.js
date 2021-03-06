"use strict";

import adminTemplate from './admin/admin.html';
import checkoutTemplate from './checkout/checkout.html';
import homeTemplate from './home/home.html';
import notFoundTemplate from './404/404.html';
import matchTemplate from './match/match.html';
import sectorTemplate from './sector/sector.html';
import ticketsTemplate from './tickets/tickets.html';
import accountTemplate from './account/login/login.html';
import recoveryTemplate from './account/recovery/recovery.html';
import signupTemplate from './account/signup/signup.html';
import settingsTemplate from './account/settings/settings.html';

export function routerConfig($cookiesProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
  'ngInject';

  $urlRouterProvider.otherwise('/404');
  let n = new Date();
  $cookiesProvider.defaults.expires = new Date(n.getFullYear(), n.getMonth(), n.getDate(), n.getHours() + 6);
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('cashbox', {
      url: "/cashbox",
      component: 'cashbox'
    })
    .state('cashbox.abonementTicket', {
      url: "/abonementTicket",
      component: 'abonementTicket'
    })
    .state('cashbox.daysStatistic', {
      url: "/daysStatistic",
      component: 'cashierDaysStatistic',
      resolve: {
        dayStatistics: (CashboxService) => {
          'ngInject';
          return CashboxService.getStatistics({
            date: new Date(),
            metod: 'day'
          })
        },
      }
    })
    .state('cashbox.lastTickets', {
      url: "/lastTickets",
      component: 'cashierLastTickets',
      resolve: {
        lastTickets: (CashboxService) => {
          'ngInject';
          return CashboxService.getStatistics({
            date: new Date(),
            metod: 'event'
          })
        },
      }
    });

    $stateProvider.state('main.tickets', {
      url: '/my/tickets',
      component: 'ticketsComponent'  
    });

  $stateProvider.state('main', {
    abstract: true,
    url: '',
    template: '<ui-view />',
    resolve: {
      cart: (CartService) => {
        'ngInject';
        return CartService.loadCart()
          .catch((error) => {
            console.log(error);
          });
      }
    }
  });

  $stateProvider.state('admin', {
    url: '/admin',
    component: 'adminComponent',
    authenticate: 'admin'
  });

  $stateProvider.state('main.home', {
    url: '/',
    component: 'homeComponent'
  });

  $stateProvider.state('main.match', {
    url: '/match/:id/sectors',
    component: 'matchComponent',
    //templateUrl: matchTemplate,
    //controller: 'MatchController',
    //controllerAs: 'matchCtrl',

    resolve: {
      match: (MatchService, $stateParams, $state) => {
        'ngInject';
        return MatchService
          .fetchMatch($stateParams.id)
          .catch((error) => {
            console.error(error);
            $state.go('404');
          })
          ;
      },
      cart: (CartService) => {
        'ngInject';
        return CartService.data.cart;
      }
    }
  });

  $stateProvider.state('main.checkout', {
    url: '/checkout',
    templateUrl: checkoutTemplate,
    controller: 'CheckoutController',
    controllerAs: 'vm'
  });

  $stateProvider.state('main.sector', {
    url: '/match/:id/tribune/:tribune/sectors/:sector',
    templateUrl: sectorTemplate,
    controller: 'SectorController',
    controllerAs: 'vm',
    resolve: {
      //sector:  $stateParams,

      sector: ($stateParams) => {
'ngInject';
return $stateParams;
},

      //sector: (Stadium, $stateParams) => {
      //
      //console.log('$stateParams', $stateParams);
      //
      //
      //  'ngInject';
      //  return Stadium['tribune_' + $stateParams.tribune]['sector_' + $stateParams.sector];
      //},
      match: (MatchService, $stateParams, $state) => {
        'ngInject';
        return MatchService
          .fetchMatch($stateParams.id)
          .catch((error) => {
            console.log(error);
            $state.go('404');
          });
      }
    }
  });

  

  $stateProvider.state('login', {
    url: '/login?referrer',
    referrer: 'main.home',
    templateUrl: accountTemplate,
    controller: 'LoginController',
    controllerAs: 'vm'
  })
    .state('logout', {
      url: '/logout',
      template: '',
      controller: 'LogoutController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: signupTemplate,
      controller: 'SignupController',
      controllerAs: 'vm'
    })
    .state('recovery', {
      url: '/recovery',
      templateUrl: recoveryTemplate,
      controller: 'RecoveryController',
      controllerAs: 'vm'
    })
    .state('settings', {
      url: '/settings',
      templateUrl: settingsTemplate,
      controller: 'SettingsController',
      controllerAs: 'vm',
      authenticate: true
    });

  $stateProvider.state('404', {
    url: '/404',
    templateUrl: notFoundTemplate,
    controller: '404Controller',
    controllerAs: 'vm'
  });
}