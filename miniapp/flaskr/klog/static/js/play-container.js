(function () {
  'use strict';
  $(document).ready(function () {
    setupPlaygroundView();
    $('#mw-mf-main-menu-button').on('click', function (ev) {
      ev.preventDefault();
      $('body').toggleClass('sv-nav-enabled');
    });
    if (readCookie('playgroundImports') === 'true') {
      $('#imports').attr('checked','checked');
    }
    $('#imports').change(function() {
      createCookie('playgroundImports', $(this).is(':checked') ? 'true' : '');
    });
 
    function createCookie(name, value) {
      document.cookie = name + '=' + value + '; path=/';
    }
 
    function readCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
  });

  function setupPlaygroundView() {
    'use strict';
    playground({
      'codeEl':       '.play-input .play-code-area',
      'outputEl':     '.play-output',
      'runEl':        '.play-buttons .run',
      'fmtEl':        '.play-buttons .fmt',
      'enableHistory': true
    });
    $('.play-input .play-code-area').linedtextarea();
    $('.play-input .play-code-area').attr('wrap', 'off');
  }

})();
