$(document).ready(function() {
    let selectedAmenities = {};
    let selectedStates = {};
    let selectedCities = {};

    $('input[type="checkbox"]').change(function() {
        let id = $(this).attr('data-id');
        let name = $(this).attr('data-name');
        let type = $(this).closest('li').attr('class').split('-')[0];

        if ($(this).is(':checked')) {
            if (type === 'amenity') {
                selectedAmenities[id] = name;
            } else if (type === 'state') {
                selectedStates[id] = name;
            } else if (type === 'city') {
                selectedCities[id] = name;
            }
        } else {
            if (type === 'amenity') {
                delete selectedAmenities[id];
            } else if (type === 'state') {
                delete selectedStates[id];
            } else if (type === 'city') {
                delete selectedCities[id];
            }
        }

        let locationsList = Object.values(selectedStates).concat(Object.values(selectedCities)).join(', ');
        if (locationsList === '') {
            locationsList = '&nbsp;';
        }
        $('.locations h4').html(locationsList);

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
            data: JSON.stringify({
                amenities: Object.keys(selectedAmenities),
                states: Object.keys(selectedStates),
                cities: Object.keys(selectedCities)
            }),
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
    $('button').click(function() {
        fetchPlacesData();
    });
});

