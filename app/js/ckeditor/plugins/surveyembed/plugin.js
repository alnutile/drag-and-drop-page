( function() {
    CKEDITOR.plugins.add( 'surveyembed',
        {
            icons: 'surveyembed',
            init: function( editor ) {

                editor.addCommand('browseSurveysDialog', new CKEDITOR.dialogCommand('browseSurveysDialog'));

                editor.ui.addButton('SurveyEmbed',
                    {
                        label: 'Survey Embed',
                        command: 'browseSurveysDialog',
                        toolbar: 'surveyembed'
                    });

                CKEDITOR.dialog.add('browseSurveysDialog', function (editor) {
                    return {
                        title: 'Survey Dialog',

                        contents: [
                            {
                                id: 'tab1',
                                minWidth: 500,
                                minHeight: 500,
                                label: "",
                                title: '',
                                expand: true, padding: 0,
                                elements: [
                                    {
                                        type: 'iframe',
                                        id: 'chosen',
                                        label: 'Choose a survey',
                                        src: '/survey_dialog',
                                        width: 800,
                                        height: 500,
                                        commit: function( element ) {
                                            element.setText( this.getValue() );
                                        }
                                    }
                                ]
                            }
                        ],
                        onShow: function() {
                            // The code that will be executed when a dialog window is loaded.
                        },
                        onOk: function () {
                            var path = CKEDITOR.getUrl('plugins/surveyembed/images/survey_preview.png');
                            var dialog = this;
                            var win = window.frames.length - 1;
                            var chosen = window.frames[win].document.getElementById('survey_set_chosen').value;
                            var div = editor.document.createElement('div');
                            var html = "<img src='" + path + "' >";
                            div.setHtml(html);
                            editor.insertElement(div);
                            $('input#campaign_related_survey_api_id').val(chosen);
                            noty({text:"Survey Chosen - the image will be replaced by the real survey when a user visits the page", type: "success"});
                        }
                    };
                });
            }
        });



})();
