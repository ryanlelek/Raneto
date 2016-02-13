
jQuery(document).ready(function () {

  'use strict';

  // Form validation
  $('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea')
    .on('focus', function () {
      $(this).removeClass('input-error');
    });

  $('.login-form')
    .on('submit', function (e) {
      e.preventDefault();

      $(this).find('input[type="text"], input[type="password"], textarea').each(function () {
        if ($(this).val() === '') {
          e.preventDefault();
          $(this).addClass('input-error');
        } else {
          $(this).removeClass('input-error');
        }
      });

      if ($('.input-error').length === 0) {
        $.post('/rn-login', $(this).serialize(), function (data) {

          swal({
            type              : data.status ? 'success' : 'warning',
            title             : data.message,
            timer             : data.status ? 2000 : null,
            showConfirmButton : true
          });

          if (data.status) {
            window.setTimeout(function () {
              window.location = '/';
            }, 1500);
          }

        });
      }
    });

});
