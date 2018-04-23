var inSearch = false;

function execSuggest()
{
	// Execute a search to lookup viable movies
	var q = encodeURIComponent($("#q").val());
	var searchAPI = "/api/search?value=" + q;
	inSearch= true;
    $.ajax({
        url: searchAPI,
        beforeSend: function (request) {
            request.setRequestHeader("Content-Type", "application/json");
           
        },
        type: "GET",
        success: function (data) {
			$( "#mediaContainer" ).html('');
			for (var item in data)
			{
				var id = data[item].Id;
				var title = data[item].Id;

				var imageURL = "/Content/pdf_logo.png";
				var entities = data[item].entities;
				$( "#mediaContainer" ).append( '<div class="col-md-4" style="text-align:center"><a href="javascript:void(0);" onclick="openMovieDetails(\'' + title + '\',\'' + id + '\');"><img src="' + imageURL + '" height=200><br><div style="height:100px"><b>' + title + '</b></a></div></div>' );
			}
			inSearch= false;
        }
    });
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