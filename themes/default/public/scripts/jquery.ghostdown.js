(function ($, ShowDown, CodeMirror) {
    "use strict";

    $.widget( "b4m.ghostDown", {
        editor: null,
        markdown: null,
        html: null,
        converter: null,
        _create: function() {
            this.converter = new ShowDown.converter();
            this.editor = CodeMirror.fromTextArea(this.element.find('textarea')[0], {
                mode: 'markdown',
                tabMode: 'indent',
                lineWrapping: true
            });

            this.editor.on("change", $.proxy(function () {
                this._updatePreview();
            }, this));

            $('.entry-markdown header, .entry-preview header', this.element).click(function (e) {
                $('.entry-markdown, .entry-preview', this.element).removeClass('active');
                $(e.target, this.element).closest('section').addClass('active');
            });

            $('.CodeMirror-scroll', this.element).on('scroll', $.proxy(function (e) {
                this._syncScroll(e);
            }, this));

            // Shadow on Markdown if scrolled
            $('.CodeMirror-scroll', this.element).scroll(function(e) {
                if ($(e.target).scrollTop() > 10) {
                    $('.entry-markdown', this.element).addClass('scrolling');
                } else {
                    $('.entry-markdown', this.element).removeClass('scrolling');
                }
            });
            // Shadow on Preview if scrolled
            $('.entry-preview-content', this.element).scroll(function(e) {
                if ($('.entry-preview-content', $(e.target).scrollTop()).scrollTop() > 10) {
                    $('.entry-preview', this.element).addClass('scrolling');
                } else {
                    $('.entry-preview', this.element).removeClass('scrolling');
                }
            });

            this._updatePreview();
        },
        _updatePreview: function() {
            var preview = this.element.find('.rendered-markdown');
            this.markdown = this.editor.getValue();
            this.html = this.converter.makeHtml(this.markdown);
            preview.html(this.html);
            this._updateWordCount();
        },
        getHtml: function () {
            return this.html;
        },
        getMarkdown: function () {
            return this.markdown;
        },
        _syncScroll: function (e) {
            // vars
            var $codeViewport = $(e.target),
                $previewViewport = $('.entry-preview-content'),
                $codeContent = $('.CodeMirror-sizer'),
                $previewContent = $('.rendered-markdown'),
                // calc position
                codeHeight = $codeContent.height() - $codeViewport.height(),
                previewHeight = $previewContent.height() - $previewViewport.height(),
                ratio = previewHeight / codeHeight,
                previewPostition = $codeViewport.scrollTop() * ratio;

            // apply new scroll
            $previewViewport.scrollTop(previewPostition);
        },
        _updateWordCount: function() {
            var wordCount = this.element.find('.entry-word-count'),
            editorValue = this.markdown;
            if (editorValue.length) {
                wordCount.html(editorValue.match(/\S+/g).length + ' words');
            }
        }
    });
}(jQuery, Showdown, CodeMirror));
