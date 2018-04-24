var inSearch = false;
var facetMain;

function execSuggest()
{
	// Execute a search to lookup viable movies
	var q = encodeURIComponent($("#q").val());
    var searchAPI = "/api/search?value=" + q + "&facet=" + facetMain;
	inSearch= true;
    $.ajax({
        url: searchAPI,
        beforeSend: function (request) {
            request.setRequestHeader("Content-Type", "application/json");
           
        },
        type: "GET",
        success: function (data) {
            $("#mediaContainer").html('');
            UpdateFacets(data.Facets.entities);

			for (var item in data.Results)
			{
				var id = data.Results[item].Document.id;
                var title = data.Results[item].Document.id;

				var imageURL = "/Content/pdf_logo.png";
                var entities = data.Results[item].Document.entities;
				$( "#mediaContainer" ).append( '<div class="col-md-4" style="text-align:center"><a href="javascript:void(0);" onclick="openMovieDetails(\'' + title + '\',\'' + id + '\');"><img src="' + imageURL + '" height=200><br><div style="height:100px"><b>' + title + '</b></a></div></div>' );
			}
			inSearch= false;
        }
    });

}
var graphVisible = false;
function toggleGraph() {
    setGraphVisible(!graphVisible)
}

function setGraphVisible(visible) {
    var q = encodeURIComponent($("#q").val());
    if (!graphVisible) {
        getFDNodes(q);
    }
    graphVisible = visible;
    if (graphVisible)
        $("#fdGraph").show();
    else
        $("#fdGraph").hide()
}

function UpdateFacets(data) {
    var facetResultsHTML = '';
    for (var i = 0; i < data.length; i++) {
        facetResultsHTML += '<li><a href="javascript:void(0)" onclick="ChooseFacet(\'' + data[i].value + '\');">' + data[i].value + ' (' + data[i].count + ')</span></a></li>';
    }

    $("#facets").html(facetResultsHTML);
}

function ChooseFacet(facet) {
    facetMain = facet;
    execSuggest();
}

function openMovieDetails(title, id, text)
{
	// Open the dialog with the recommendations
	$("#modal-title").html(title);
	$("#recDiv").html('Loading recommendations...');

	var recommendatationAPI = "https://api.datamarket.azure.com/data.ashx/amla/recommendations/v2/ItemRecommend?$format=json&modelId='" + azureMLModelId + "'&numberOfResults=5&buildId=" + azureMLBuildId + "&includeMetadata=false&apiVersion='1.0'&itemIds='" + id + "'";

	$.ajax({
		url: recommendatationAPI,
		beforeSend: function (request) {
			request.setRequestHeader("Authorization", "Basic QWNjb3VudEtleTpIK0ZDVldETWZZbnpja2ZUa3pxNDlzT01aR2dFVDlVNFdqL2xCSHhZeStzPQ==");
		},
		type: "GET",
		success: function (data) {
			$("#recDiv").html('');
			for (var item in data.d.results)
				$( "#recDiv" ).append( '<p>' + data.d.results[item].Name + '</p>' );
		}
	});

	$('#myModal').modal('show');
}