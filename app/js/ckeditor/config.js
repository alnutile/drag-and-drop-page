CKEDITOR.editorConfig = function( config )
{
    config.templates_replaceContent = false;
    config.height = '200';
    //config.templates_files = ['js/ckeditor/plugins/templates/dialogs/templates.js']; //this made it not work
    config.image_previewText = "Choose Browse Server or Upload to insert your image. It will appear here for you to preview. You can then wrap, float etc as needed.";
    config.toolbar_Mini =
        [
            [

                'Templates',
                '-',
                'Bold',
                'Italic',
                'Underline',
                'Styles',
                'Font',
                'Format',
                '-',
                'NumberedList',
                'BulletedList',
                '-',
                'Cut',
                'Copy',
                'Paste',
                'PasteFromWord',
                '-',
                'Link',
                'Unlink',
                'MediaEmbed',
                'Image',
                'Table',
                '-',
                'Undo',
                'Redo',
                '-',
                'Scayt',
                '-',
                'About'
            ]
        ];

    config.toolbar = 'Basic';
    config.toolbar_Basic =
        [
            [
                'Templates',

                'SurveyEmbed',
                '-',
                'Bold',
                'Italic',
                'Underline',
                'Styles',
                'Font',
                'FontSize',
                'Format',
                '-',
                'NumberedList',
                'BulletedList',
                '-',
                'Cut',
                'Copy',
                'Paste',
                'PasteFromWord',
                '-',
                'Link',
                'Unlink',
                'MediaEmbed',
                'Image',
                'Table',
                '-',
                'Undo',
                'Redo',
                '-',
                'Scayt',
                'Source',
                '-',
                'About'
            ]
        ];

    config.removeButtons = 'Flash,NewPage,Preview,Save,Print,Form,Checkbox,RadioButton,TextField,Textarea,RadioButton,HiddenField,SelectionField,Button,ImageButton,ImageField';
    config.removePlugins = 'forms, bidi';
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';
    config.extraPlugins = 'mediaembed,surveyembed,iframedialog,templates,dialog';
    //config.menu_groups = "scayt_suggest,scayt_moresuggest,scayt_control,clipboard,form,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash,checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,mediaembed,div";
    /* Filebrowser routes */
    // The location of an external file browser, that should be launched when "Browse Server" button is pressed.
    config.filebrowserBrowseUrl = "/ckeditor/attachment_files";

    // The location of an external file browser, that should be launched when "Browse Server" button is pressed in the Flash dialog.
    config.filebrowserFlashBrowseUrl = "/ckeditor/attachment_files";

    // The location of a script that handles file uploads in the Flash dialog.
    config.filebrowserFlashUploadUrl = "/ckeditor/attachment_files";

    // The location of an external file browser, that should be launched when "Browse Server" button is pressed in the Link tab of Image dialog.
    config.filebrowserImageBrowseLinkUrl = "/ckeditor/pictures";

    // The location of an external file browser, that should be launched when "Browse Server" button is pressed in the Image dialog.
    config.filebrowserImageBrowseUrl = "/ckeditor/pictures";

    // The location of a script that handles file uploads in the Image dialog.
    config.filebrowserImageUploadUrl = "/ckeditor/pictures";

    // The location of a script that handles file uploads.
    config.filebrowserUploadUrl = "/ckeditor/attachment_files";

    // Rails CSRF token
    config.filebrowserParams = function(){
        var csrf_token, csrf_param, meta,
            metas = document.getElementsByTagName('meta'),
            params = new Object();

        for ( var i = 0 ; i < metas.length ; i++ ){
            meta = metas[i];

            switch(meta.name) {
                case "csrf-token":
                    csrf_token = meta.content;
                    break;
                case "csrf-param":
                    csrf_param = meta.content;
                    break;
                default:
                    continue;
            }
        }

        if (csrf_param !== undefined && csrf_token !== undefined) {
            params[csrf_param] = csrf_token;
        }

        return params;
    };

    config.addQueryString = function( url, params ){
        var queryString = [];

        if ( !params ) {
            return url;
        } else {
            for ( var i in params )
                queryString.push( i + "=" + encodeURIComponent( params[ i ] ) );
        }

        return url + ( ( url.indexOf( "?" ) != -1 ) ? "&" : "?" ) + queryString.join( "&" );
    };

    // Integrate Rails CSRF token into file upload dialogs (link, image, attachment and flash)
    CKEDITOR.on( 'dialogDefinition', function( ev ){
        // Take the dialog name and its definition from the event data.
        var dialogName = ev.data.name;
        var dialogDefinition = ev.data.definition;
        var content, upload;

        if (CKEDITOR.tools.indexOf(['link', 'image', 'attachment', 'flash'], dialogName) > -1) {
            content = (dialogDefinition.getContents('Upload') || dialogDefinition.getContents('upload'));
            upload = (content == null ? null : content.get('upload'));

            if (upload && upload.filebrowser && upload.filebrowser['params'] === undefined) {
                upload.filebrowser['params'] = config.filebrowserParams();
                upload.action = config.addQueryString(upload.action, upload.filebrowser['params']);
            }
        }
    });
};