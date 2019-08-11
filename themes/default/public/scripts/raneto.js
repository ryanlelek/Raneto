
;(function ($, hljs) {

  "use strict";

  var base_url = (typeof rn_base_url === "undefined") ? "" : rn_base_url;

  var current_category;

  $(document).ready(function () {

    // Enable Highlighting and other
    // things when there is content
    if ($(".content").length) {

      // Syntax highlighting
      hljs.initHighlightingOnLoad();

      // Add Bootstrap styling to tables
      $(".content table").addClass("table");

      // FitVids
      fitvids(".content");
    }

    // Deal with Home Categories
    if ($(".home-categories").length) {
      $(".home-categories").masonry({
        columnWidth        : ".col",
        itemSelector       : ".col",
        transitionDuration : 0
      });
    }

    // Modal: Add Page Confirm
    $("#add-page-confirm").click(function () {
      $("#addModal").modal("hide");
      var name = $("#page-name").val().replace(/\s+/g, "-");
      $.post(base_url + "/rn-add-page", {
        name     : name,
        category : current_category
      }, function (data) {
        switch (data.status) {

          case 0:
            var redirect = [""];
            if (current_category !== "") {
              redirect.push(current_category);
            }
            redirect.push(name);
            redirect.push("edit");
            window.location = base_url + redirect.join("/");
            break;
        }
      }).fail(function(data) {
        if (data.status === 403) { window.location = base_url + "/login"; }
      });
    });

    // Modal: Delete Page Confirm
    $("#delete-page-confirm").click(function () {
      var file_arr = window.location.pathname.split("/");
      var base_arr = base_url.split("/");
      file_arr.splice(0, base_arr.length, "");
      $("#deleteModal").modal("hide");
      $.post(base_url + "/rn-delete", {
        file : decodeURI(file_arr.join("/"))
      }, function (data) {
        switch (data.status) {
          case 0:
            window.location = base_url + "/";
            break;
        }
      }).fail(function(data) {
        if (data.status === 403) { window.location = base_url + "/login"; }
      });
    });

    // Add Page
    $(".add-page").click(function () {
      var text = $(this).closest("h5")
                    .clone()
                    .children()
                    .remove()
                    .end()
                    .text()
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, "-");
      current_category = text !== "main-articles" ? text : "";
    });

    // New Category
    $("#newCategory").keypress(function (e) {
      if (e.which === 13) {
        $.post(base_url + "/rn-add-category", {
          category : $(this).val()
                            .trim()
                            .toLowerCase()
                            .replace(/\s+/g, "-")
        }, function (data) {
          location.reload();
        }).fail(function(data) {
        if (data.status === 403) { window.location = base_url + "/login"; }
      });
      }
    });

    // Close Edit
    $(".close-edit").click(function () {
      // Remove the trailing "/edit"
      var the_arr = window.location.href.split("/");
      the_arr.pop();
      window.location = the_arr.join("/");
    });

    // get translations first, then register save handlers
    $.getJSON(base_url + "/translations/" + $("html").prop("lang") + ".json", null, function (lang) {

      // Save Page
      $(".save-page").click(function () {
        var file_arr = window.location.pathname.split("/");
        var base_arr = base_url.split("/");
        file_arr.splice(0, base_arr.length, "");
        file_arr.pop();
        $("#entry-markdown").next(".CodeMirror")[0].CodeMirror.save();
        $.post(base_url + "/rn-edit", {
          file    : decodeURI(file_arr.join("/")),
          content : $("#entry-markdown").val(),
          meta_title : $("#entry-metainfo-title").val(),
          meta_description : $("#entry-metainfo-description").val(),  
          meta_sort : $("#entry-metainfo-sort").val(),  
        }, function (data) {
          switch (data.status) {
            case 0:
              $("#edit-status").slideUp(function () {
                $("#edit-status").text(lang.edit.pageSaved);
                $("#edit-status").removeClass();
                $("#edit-status").addClass("alert alert-success");
                $("#edit-status").slideDown();
              });
              break;
            case 1:
              $("#edit-status").slideUp(function () {
                $("#edit-status").text(lang.edit.pageSaveError);
                $("#edit-status").removeClass();
                $("#edit-status").addClass("alert alert-warning");
                $("#edit-status").slideDown();
              });
              break;
          }
        }).fail(function(data) {
          if (data.status === 403) { window.location = base_url + "/login"; }
        });
      });

    });

  });

})(jQuery, hljs);
