
(function($, hljs){
    var current_category; 
    $(document).ready(function(){

        if($('.content').length){

            // Syntax highlighting
            hljs.initHighlightingOnLoad();

            // Add Bootstrap styling to tables
            $('.content table').addClass('table');

            // FitVids
            $('.content').fitVids();

        }

        if($('.home-categories').length){
            $('.home-categories').masonry({
                columnWidth: '.col',
                itemSelector: '.col',
                transitionDuration: 0
            });
        }
        $(".goto-edit").click(function(){
            window.location.href = window.location.href + "/edit";
        });
        $("#delete-page-confirm").click(function(){
            $('#deleteModal').modal('hide');

            $.post(
                "/rn-delete", 
                {
                    "file": window.location.pathname
                }, 
                function(data){
                    switch(data.status){
                        case 0:
                            window.location = "/";
                            break;
                    }
                }
            );
        });
        $("#add-page-confirm").click(function(){
            $('#addModal').modal('hide');
            name = $("#page-name").val().replace(/\s+/g, "-")
            $.post(
                "/rn-add-page", 
                {
                    "name": name,
                    "category": current_category
                }, 
                function(data){
                    switch(data.status){
                        case 0:
                            window.location = "/" + current_category + "/" + name + "/edit";
                            break;
                    }
                }
            );
        });
        $(".add-page").click(function(){
            text = $(this)
                .closest("h5")
                .clone()    
                .children() 
                .remove()   
                .end()
                .text()
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "-");
                
            current_category = text;
        });
        $("#newCategory").keypress(function(e) {
            if(e.which == 13) {
                $.post(
                    "/rn-add-category",
                    {
                        "category": $(this)
                            .val()
                            .trim()
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                    },
                    function(data){
                         location.reload();
                    }
                );
            }
        });
        $(".close-edit").click(function(){
            var the_arr = window.location.href.split('/');
            the_arr.pop();
            to_location = the_arr.join('/');
            window.location = to_location;
        });
        $(".save-page").click(function(){
            file_arr = window.location.pathname.split('/');
            file_arr.pop();
            $("#entry-markdown").next('.CodeMirror')[0].CodeMirror.save()
            
            $.post(
                "/rn-edit", 
                {
                    "file": file_arr.join('/'),
                    "content": $("#entry-markdown").val()
                }, 
                function(data){
                    switch(data.status){
                        case 0:
                            $("#edit-status").slideUp(function(){
                                $("#edit-status").text("Page Successfully Saved");
                                $("#edit-status").removeClass();
                                $("#edit-status").addClass("alert alert-success");
                                 $("#edit-status").slideDown();
                            });
                            break;
                        case 1:
                            $("#edit-status").slideUp(function(){
                                $("#edit-status").text("Error Saving Page");
                                $("#edit-status").removeClass();
                                $("#edit-status").addClass("alert alert-warning");
                                $("#edit-status").slideDown();
                            });
                            break;
                    }
                }
            );
        });

    });
    


})(jQuery, hljs);
