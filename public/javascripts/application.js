$(document).ready(function() {
    initializeTabs();
    bindAutocomplete();

    $map = new google.maps.Map(document.getElementById("map"), {
        zoom: 3,
        center: new google.maps.LatLng(0, 0),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    $currentPolygons = []
})


// DRAW POLYGON TO GOOGLE MAP
function drawPolygon(geoHash) {
    geoHash = jQuery.parseJSON(geoHash).coordinates[0][0]

    var coords = []

    $.each(geoHash, function() {
        coords.push(new google.maps.LatLng(this[1], this[0]))
    })

    polygon = new google.maps.Polygon({
        paths: coords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: "#FF0000",
        fillOpacity: 0.35
    });

    polygon.setMap($map);
    $currentPolygons.push(polygon)
}


// DRAW THE ARRAY OF POLYGONS TO GOOGLE MAP
function drawPolygons(geoHashes) {

    if (!($currentPolygons.length == 0)) {
        for (var i = 0, len = $currentPolygons.length; i < len; ++i) {
            $currentPolygons[i].setMap(null)
        }
    }

    for (var i = 0, len = geoHashes.length; i < len; ++i) {
        drawPolygon(geoHashes[i])
    }
}


// GOOGLE IMAGES SEARCH
function searchImageComplete(searcher) {
    if (searcher.results && searcher.results.length > 0) {
        var contentDiv = document.getElementById('photos');
        contentDiv.innerHTML = '';

        var results = searcher.results;
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var imgContainer = document.createElement('div');
            var newImg = document.createElement('img');
            newImg.src = result.tbUrl;
            imgContainer.appendChild(newImg);
            contentDiv.appendChild(imgContainer);
        }
    }
}

function searchWebComplete(searcher) {
    if (searcher.results && searcher.results.length > 0) {
        var contentDiv = document.getElementById('info');
        contentDiv.innerHTML = '';

        var results = searcher.results;
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var textContainer = document.createElement('div');
            textContainer.appendChild(result.html);
            $(textContainer).addClass("text");
            contentDiv.appendChild(textContainer);
        }
    }
}

function searchForImages(term) {
    var imageSearch = new google.search.ImageSearch();
    imageSearch.setRestriction(google.search.ImageSearch.RESTRICT_IMAGESIZE, google.search.ImageSearch.IMAGESIZE_MEDIUM);
    imageSearch.setSearchCompleteCallback(this, searchImageComplete, [imageSearch]);
    imageSearch.execute(term);
}

function searchForTexts(term) {
    var textSearch = new google.search.WebSearch();
    textSearch.setSearchCompleteCallback(this, searchWebComplete, [textSearch]);
    textSearch.execute(term);
}

function initializeTabs() {
    $('.microtabs').microTabs({
        selected: 0
    });
}


function bindAutocomplete() {
    $("#autocomplete").autocomplete({
        source: "/animals.json",
        minLength: 2,
        select: function(event, ui) {
            term = ui.item.value
            $.ajax({
                url: "/animals/" + term ,
                dataType: 'json',
                success: function(data) {
                    $map.setZoom(3);
                    drawPolygons(data);
                    searchForImages(term);
                    searchForTexts(term);
                }
            });
        }
    });
}