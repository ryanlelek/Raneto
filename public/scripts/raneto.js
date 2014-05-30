(function($, hljs){

    $(document).ready(function(){

        if($('.content').length){

            // Syntax highlighting
            hljs.initHighlightingOnLoad();

            // Add Bootstrap styling to tables
            $('.content table').addClass('table');

            // FitVids
            $('.content').fitVids();

        }

    });

})(jQuery, hljs);
