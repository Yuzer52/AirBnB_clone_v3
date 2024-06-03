$(document).ready(function() {
    let selectedAmenities = {};

    $('input[type="checkbox"]').change(function() {
        let amenityId = $(this).attr('data-id');
        let amenityName = $(this).attr('data-name');

        if ($(this).is(':checked')) {
            selectedAmenities[amenityId] = amenityName;
        } else {
            delete selectedAmenities[amenityId];
        }

        let amenitiesList = Object.values(selectedAmenities).join(', ');
        if (amenitiesList === '') {
            amenitiesList = '&nbsp;'; 
        }
        $('.amenities h4').html(amenitiesList);
    });

    function updateApiStatus() {
        $.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
            if (data.status === 'OK') {
                $('#api_status').addClass('available');
            } else {
                $('#api_status').removeClass('available');
            }
        });
    }

    updateApiStatus();

    setInterval(updateApiStatus, 5000);

    function fetchPlacesData() {
        $.ajax({
            type: "POST",
            url: "http://0.0.0.0:5001/api/v1/places_search/",
            contentType: "application/json",
            data: JSON.stringify({}),
            success: function(data) {
                $('.places').empty(); 

                data.forEach(function(place) {
                    let article = '<article>' +
                        '<div class="title_box">' +
                        '<h2>' + place.name + '</h2>' +
                        '<div class="price_by_night">$' + place.price_by_night + '</div>' +
                        '</div>' +
                        '<div class="information">' +
                        '<div class="max_guest">' + place.max_guest + ' Guest' + (place.max_guest != 1 ? 's' : '') + '</div>' +
                        '<div class="number_rooms">' + place.number_rooms + ' Bedroom' + (place.number_rooms != 1 ? 's' : '') + '</div>' +
                        '<div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom' + (place.number_bathrooms != 1 ? 's' : '') + '</div>' +
                        '</div>' +
                        '<div class="description">' + place.description + '</div>' +
                        '</article>';
                    $('.places').append(article);
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching places data:', error);
            }
        });
    }

    fetchPlacesData();
});

