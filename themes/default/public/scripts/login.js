
jQuery(document).ready(function () {

  'use strict';

  var base_url = (typeof rn_base_url === "undefined") ? "" : rn_base_url;

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
        $.post(base_url + '/rn-login', $(this).serialize(), function (data) {

          Swal.fire({
            type              : data.status ? 'success' : 'warning',
            title             : data.message,
            timer             : data.status ? 2000 : null,
            showConfirmButton : true
          });

          if (data.status) {
            window.setTimeout(function () {
              window.location = base_url + '/';
            }, 1500);
          }

        });
      }
    });

});
