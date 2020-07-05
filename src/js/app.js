const url = 'https://api.thecatapi.com/v1/images/search';
const breedsUrl = 'https://api.thecatapi.com/v1/breeds';
let count = 0;
let catNames;
let imageLinks = [];

function fetchImage() {
  $('.cat-list').empty();
  $('.image-1 > img').remove();
  $('#name-1').text('');
  $('.loading-text').removeClass('hidden');
  $.ajax({
    url,
    type: 'get',
    headers: {
      'x-api-key': '8b43e25f-85d5-4540-b319-6cc6a7b481b8',
    },
    data: {
      limit: 5,
    }

  })
    .done((data) => {
      data.forEach((item) => {
        $(`<div class="cat-item">
          <img src="${item.url}" alt="">
        </div>`).appendTo('.cat-list');
        imageLinks.push(item.url);
      });

      $('.cat-item > img').click(function() {
        selectImage(this);
      });

      $('.cat-item > img')[0].click();
      $('.loading-text').addClass('hidden');
    });
}

function selectImage(target) {
  $('.image img').remove();
  $('#name-1').text(catNames[imageLinks.indexOf(target.src)]);
  $('.image-1').append($(target).clone());

  $('.cat-item').removeClass('selected');
  $(target).closest('.cat-item').addClass('selected');
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
    });
}

function setNames(id) {
  function catName() {
    return catNames[Math.floor(Math.random() * catNames.length) + 1];
  }

  $(id).text(catName());
}

function incrementCount() {
  count += 1;
  $('.count').text(count);
}

$(() => {
  fetchNames();
  fetchImage();
});

$('#fetch-button').click(() => {
  fetchImage();
  incrementCount();
});
