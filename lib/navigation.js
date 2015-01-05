var _ = require('underscore');

var menuItems = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'Admin Login',
    path: '/admin/login'
  },
  {
    name: 'Survey Setup',
    path: '/admin/setup',
    loggedIn: true
  },
  {
    name: 'Run Event',
    path: '/admin/event',
    loggedIn: true
  },
  {
    name: 'Logout',
    path: '/admin/logout',
    loggedIn: true
  }
];

module.exports = function getMenuItems(currentPath, loggedIn){
  var selected = _.find(menuItems, function(item) { return item.path === currentPath; });
  if (!selected) { selected = menuItems[0]; }

  return _.reduce(menuItems, function(items, item) {
            if ((item.loggedIn && loggedIn) || (!item.loggedIn && !loggedIn)) {
              item.selected = item.path === currentPath;
              items.push(item);
            } 
            return items;
          }, []);
}