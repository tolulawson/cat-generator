const url = 'https://api.thecatapi.com/v1/images/search';
let count = 0;

function fetchImage() {
  $('#image').addClass('hidden').remove();
  $('.loading-text').toggleClass('hidden');
  $.ajax({
    url,
    type: 'get',
    headers: {
      'x-api-key': '8b43e25f-85d5-4540-b319-6cc6a7b481b8',
    },

  })
    .done((data) => {
      const newImage = $('<img id="image" class="hidden">');
      newImage.attr('src', data[0].url).appendTo('.image');
      $('#image').on('load', () => {
        $('#image').removeClass('hidden');
        $('.loading-text').toggleClass('hidden');
      })
    });
}

function incrementCount() {
  count += 1;
  $('.count').text(count);
}

$(() => {
  fetchImage();
});

$('#fetch-button').click(() => {
  fetchImage();
  incrementCount();
});
