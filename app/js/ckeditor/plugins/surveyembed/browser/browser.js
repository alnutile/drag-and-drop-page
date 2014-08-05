var CkEditorSurveyEmbed = {};

CkEditorSurveyEmbed.folders = [];
CkEditorSurveyEmbed.surveys = {}; //folder => list of images
CkEditorSurveyEmbed.ckFunctionNum = null;

CkEditorSurveyEmbed.$folderSwitcher = null;
CkEditorSurveyEmbed.$surveysContainer = null;

CkEditorSurveyEmbed.init = function () {
	CkEditorSurveyEmbed.$folderSwitcher = $('#js-folder-switcher');
	CkEditorSurveyEmbed.$surveysContainer = $('#js-survey-container table tbody');

	var baseHref = CkEditorSurveyEmbed.getQueryStringParam("baseHref");
	if (baseHref) {
		var h = (document.head || document.getElementsByTagName("head")[0]),
			el = h.getElementsByTagName("link")[0];
		el.href = location.href.replace(/\/[^\/]*$/,"/browser.css");
		(h.getElementsByTagName("base")[0]).href = baseHref;
	}

	CkEditorSurveyEmbed.ckFunctionNum = CkEditorSurveyEmbed.getQueryStringParam('CKEditorFuncNum');

	CkEditorSurveyEmbed.initEventHandlers();

	CkEditorSurveyEmbed.loadData(CkEditorSurveyEmbed.getQueryStringParam('listUrl'), function () {
		CkEditorSurveyEmbed.initFolderSwitcher();
	});
};

CkEditorSurveyEmbed.loadData = function (url, onLoaded) {
	CkEditorSurveyEmbed.survey = {};

	$.getJSON(url, function (list) {

        $.each(list, function (_idx, item) {
            if (typeof(item.folder) === 'undefined') {
                item.folder = 'Surveys';
            }

			CkEditorSurveyEmbed.addSurvey('Surveys', item);
		});

		onLoaded();
	}).error(function(jqXHR, textStatus, errorThrown) {
		var errorMessage;
		if (jqXHR.status < 200 || jqXHR.status >= 400) {
			errorMessage = 'HTTP Status: ' + jqXHR.status + '/' + jqXHR.statusText + ': "<strong style="color: red;">' + url + '</strong>"';
		} else if (textStatus === 'parsererror') {
			errorMessage = textStatus + ': invalid JSON file: "<strong style="color: red;">' + url + '</strong>": ' + errorThrown.message;
		} else {
			errorMessage = textStatus + ' / ' + jqXHR.statusText + ' / ' + errorThrown.message;
		}
		CkEditorSurveyEmbed.$surveysContainer.html(errorMessage);
    });
};

CkEditorSurveyEmbed.addSurvey = function (folderName, survey) {

    if (typeof(CkEditorSurveyEmbed.surveys[folderName]) === 'undefined') {
        CkEditorSurveyEmbed.folders.push(folderName);
        CkEditorSurveyEmbed.surveys[folderName] = [];
    }

    CkEditorSurveyEmbed.surveys[folderName].push({
        "name": survey.title,
        "id": survey.id
    });
};


CkEditorSurveyEmbed.initFolderSwitcher = function () {
	var $switcher = CkEditorSurveyEmbed.$folderSwitcher;

	$switcher.find('li').remove();

	$.each(CkEditorSurveyEmbed.folders, function (idx, folderName) {
		var $option = $('<li></li>').data('idx', idx).text(folderName);
		$option.appendTo($switcher);
	});


	if (CkEditorSurveyEmbed.folders.length === 0) {
		$switcher.remove();
		CkEditorSurveyEmbed.$surveysContainer.text('No Surveys.');
	} else {
		if (CkEditorSurveyEmbed.folders.length === 1) {
			$switcher.hide();
		}

		$switcher.find('li:first').click();
	}
};

CkEditorSurveyEmbed.renderSurveysForFolder = function (folderName) {
    var surveys = CkEditorSurveyEmbed.surveys[folderName],
        templateHtml = $('#js-template-survey').html();

    CkEditorSurveyEmbed.$surveysContainer.html('');
    $.each(surveys, function (_idx, surveyData) {

        var html = templateHtml;
        html = html.replace('%surveyUrl%', '/survey_sets/' + surveyData.id);
        html = html.replace('%surveyUrl2%', '/survey_sets/' + surveyData.id);
        html = html.replace('%title%', surveyData.name);

        var $item = $($.parseHTML(html));

        CkEditorSurveyEmbed.$surveysContainer.append($item);
    });
};

CkEditorSurveyEmbed.initEventHandlers = function () {
	$(document).on('click', '#js-folder-switcher li', function () {
		var idx = parseInt($(this).data('idx'), 10),
			folderName = CkEditorSurveyEmbed.folders[idx];

		$(this).siblings('li').removeClass('active');
		$(this).addClass('active');

		CkEditorSurveyEmbed.renderSurveysForFolder(folderName);
	});

	$(document).on('click', '.js-survey-link', function () {
		window.opener.CKEDITOR.tools.callFunction(CkEditorSurveyEmbed.ckFunctionNum, $(this).data('url'));
		window.close();
	});
};

CkEditorSurveyEmbed.getQueryStringParam = function (name) {
	var regex = new RegExp('[?&]' + name + '=([^&]*)'),
		result = window.location.search.match(regex);

	return (result && result.length > 1 ? decodeURIComponent(result[1]) : null);
};
