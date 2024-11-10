(function() {
    'use strict';
  
    angular.module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MenuSearchService', MenuSearchService)
      .directive('foundItems', FoundItemsDirective);
  
    // Main Controller
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      const narrowCtrl = this;
      narrowCtrl.searchTerm = '';
      narrowCtrl.found = [];
  
      // Search function
      narrowCtrl.narrowItDown = function() {
        if (!narrowCtrl.searchTerm) {
          narrowCtrl.found = [];
          return;
        }
  
        MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm)
          .then(function(result) {
            narrowCtrl.found = result;
          })
          .catch(function(error) {
            console.error("Something went wrong!", error);
          });
      };
  
      // Remove item function
      narrowCtrl.removeItem = function(index) {
        narrowCtrl.found.splice(index, 1);
      };
    }
  
    // Menu Search Service
    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
      const service = this;
  
      service.getMatchedMenuItems = function(searchTerm) {
        return $http({
          method: "GET",
          url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
        }).then(function(response) {
          const foundItems = [];
          const menuItems = response.data;
  
          // Filter items based on the search term
          for (const key in menuItems) {
            if (menuItems.hasOwnProperty(key)) {
              const item = menuItems[key];
              if (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                foundItems.push(item);
              }
            }
          }
  
          return foundItems;
        });
      };
    }
  
    // Directive for found items
    function FoundItemsDirective() {
      return {
        restrict: 'E',
        templateUrl: 'foundItems.html',
        scope: {
          items: '<',
          onRemove: '&'
        },
        controller: FoundItemsDirectiveController,
        controllerAs: 'list',
        bindToController: true
      };
    }
  
    function FoundItemsDirectiveController() {
      const list = this;
    }
  })();
  