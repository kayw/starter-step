module.exports = {
    'jquery': '$',
    'underscore': '_',
    'showdown': 'Showdown',
    'jquery.cookie': {
      'exports': '$.cookie',
      'depends': {
         'jquery':'$'
      }
    },
    'bootstrap': {
      'depends': {
         'jquery':'$'
      }
    }
};
