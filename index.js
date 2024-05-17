/* jshint node: true */
'use strict';

var path = require('path');

module.exports = {
  name: require('./package').name,
  options: {
    babel: {
      plugins: ['@babel/proposal-object-rest-spread']
    }
  },
  included: function(app) {
    this._super.included(app);
    app.import('vendor/intercom-shim.js');
  },


  treeForVendor: function() {
    return path.join(__dirname, 'client');
  }
};
