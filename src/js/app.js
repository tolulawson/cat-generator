const url = 'https://api.thecatapi.com/v1/images/search';
const breedsUrl = 'https://api.thecatapi.com/v1/breeds';
let count = 0;
let catNames;

function fetchImage() {
  $('#image-1').addClass('hidden').remove();
  $('#image-2').addClass('hidden').remove();
  $('.loading-text').removeClass('hidden');
  $.ajax({
    url,
    type: 'get',
    headers: {
      'x-api-key': '8b43e25f-85d5-4540-b319-6cc6a7b481b8',
    },
    data: {
      limit: 2,
    }

  })
    .done((data) => {
      const newImage1 = $('<img id="image-1" class="hidden">').attr('src', data[0].url);
      const newImage2 = $('<img id="image-2" class="hidden">').attr('src', data[1].url);

      newImage1.appendTo('.image-1');
      newImage2.appendTo('.image-2');

      $('#image-2').on('load', () => {
        $('#image-2').removeClass('hidden');
        $('.loading-text').addClass('hidden');
      });
      $('#image-1').on('load', () => {
        $('#image-1').removeClass('hidden');
        $('.loading-text').addClass('hidden');
      });

    });
}

function fetchNames() {
  $.ajax({
    url: breedsUrl,
    type: 'get',
    headers: {
      'x-api-key': '8b43e25f-85d5-4540-b319-6cc6a7b481b8',
    },
  })
    .done((data) => {
      catNames = data.map((item) => item.name);
      setNames();
    });
}

function setNames() {
  function catName() {
    return catNames[Math.floor(Math.random() * catNames.length) + 1];
  }

  $('#name-1').text(catName());
  $('#name-2').text(catName());
}

function incrementCount() {
  count += 1;
  $('.count').text(count);
}

$(() => {
  fetchImage();
  fetchNames();
});

$('#fetch-button').click(() => {
  fetchImage();
  incrementCount();setNames();
});
