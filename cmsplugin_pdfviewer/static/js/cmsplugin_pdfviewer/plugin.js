/**
 * Inspired by jQuery PDF-DOC Plugin
 */


PDFJS.disableWorker = true;

(function ( $ ){
    $.fn.PDFViewer = function(options){
        var settings = $.extend({
              'page': 1,
              'scale': 1
        }, options);

        if(!settings.source){
            $.error('No PDF document source was given');
            return this; 
        }

        var mydoc = this;
        var page_count = 0;
        var canvas = $(mydoc).find('canvas');

        renderPage = function (mydoc, the_page, canvas, scale){
            var pdf = $(mydoc).data('pdf');
            pdf.getPage(the_page).then(function(page) {
                var viewport = page.getViewport(scale);
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                page.render( { canvasContext: context, viewport: viewport } );
                $(mydoc).find('.h-pdf-pageinput').val(the_page);
            });
        }

        var resize_canvas = function(){
            $(mydoc).find('.h-pdf-canvas-container').css('height', mydoc.height() - $(mydoc).find('.h-pdf-toolbar').height());
        }

        canvas.on('dblclick', function(){
            var scale = mydoc.data('scale') + 0.5;
            mydoc.data('scale', scale);
            renderPage(mydoc, mydoc.data('current_page'), $(this).get()[0], scale);
            $(mydoc).find('.h-pdf-zoom-select').val(scale);
        });

        $(mydoc).find('.h-pdf-next').on('click', function(){
            var current_page = mydoc.data('current_page');
            if(current_page < page_count){
                current_page++;
                renderPage(mydoc, current_page, canvas.get()[0], mydoc.data('scale'));
            }
            mydoc.data('current_page', current_page);
        });

        $(mydoc).find('.h-pdf-prev').on('click', function(){
            var current_page = mydoc.data('current_page');
            if(current_page > 1){
                current_page--;
                renderPage(mydoc, current_page, canvas.get()[0], mydoc.data('scale'));
            }
            mydoc.data('current_page', current_page);
        });

        $(mydoc).find('.h-pdf-pageinput').on('keypress', function(event){
            console.log(event.which)
            if(event.which == 13){
                current_page = parseInt($(this).val());
                renderPage(mydoc, current_page, canvas.get()[0], mydoc.data('scale'));
                mydoc.data('current_page', current_page);
            }
            else if((event.which < 48 || event.which > 57) && ( event.which != 8 && event.which != 0)){
                return false;
            }
        });

        $(mydoc).find('.h-pdf-zoom-select')
            .on('change', function(){
                var scale = parseFloat($(this).val());
                renderPage(mydoc, mydoc.data('current_page'), canvas.get()[0], scale);
                mydoc.data('scale', scale);
            })
            .val(settings.scale);

        $(mydoc).find('.h-pdf-download').on('click', function(){
            var delim = '?';
            if(url =~ /\?/){
                delim = '&';
            }
            var url = settings.source;
            window.open(url, '_parent');
        });

        resize_canvas();

        PDFJS.getDocument(settings.source).then(
            function getDocumentCallback(pdf) {
                canvas.show();
                page_count = pdf.numPages;
                $(mydoc).find('.h-pdf-pagecount').html(page_count);
                mydoc.data('pdf', pdf);
                renderPage(mydoc, settings.page,  canvas.get()[0], settings.scale);
            },
            function getDocumentError(message, exception) {
                $.error(message);
            }
        );

        this.data('current_page', settings.page);
        this.data('scale', settings.scale);
        
        $(window).resize(function(){
            resize_canvas();
        });
        
        return this;
    };
})(jQuery);
