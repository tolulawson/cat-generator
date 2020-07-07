$(() => {
  const model = {
    init() {
      this.url = 'https://api.thecatapi.com/v1/images/search';
      this.breedsUrl = 'https://api.thecatapi.com/v1/breeds';
      this.count = 0;
      this.catNames = [];
      this.imageLinks = [];
      this.selectedIndex = 0;
      return Promise.all([model.fetchImages(), model.fetchNames()]);
    },

    fetchImages() {
      return new Promise((resolve) => {
        $.ajax({
          url: this.url,
          type: 'get',
          headers: {
            'x-api-key': '8b43e25f-85d5-4540-b319-6cc6a7b481b8',
          },
          data: {
            limit: 5,
          },
        })
          .done((data) => {
            let temp = [];
            data.forEach((item) => {
              temp.push(item.url);
            });
            model.imageLinks = temp;
            resolve();
          });
      });
    },

    fetchNames() {
      return new Promise((resolve) => {
        $.ajax({
          url: this.breedsUrl,
          type: 'get',
          headers: {
            'x-api-key': '8b43e25f-85d5-4540-b319-6cc6a7b481b8',
          },
        })
          .done((data) => {
            model.catNames = data.map((item) => item.name);
            resolve();
          });
      });
    },

    getImages() {
      return this.imageLinks;
    },

    getCatName(index) {
      return this.catNames[index];
    },

    setSelectedIndex(index) {
      this.selectedIndex = index;
    },

    getSelectedIndex() {
      return this.selectedIndex;
    },

    incrementCount() {
      console.log('Called');
      this.count += 1;
    },

    getCount() {
      return this.count;
    },
  };

  const controller = {
    init() {
      model.init()
        .then(() => {
          catListView.init();
          mainImageView.init();
        });
      countView.init();
    },

    refreshImages() {
      Promise.all([model.fetchImages(), model.fetchNames()])
        .then(() => {
          catListView.init();
          mainImageView.init();
        })
    },

    getImagesLinks() {
      return model.getImages();
    },

    updateSelected(index) {
      model.setSelectedIndex(index);
      mainImageView.render();
      controller.updateSelector();
    },

    updateSelector() {
      catListView.catList.children().removeClass('selected');
      $(catListView.catList.children()[model.getSelectedIndex()]).addClass('selected');
    },

    setCatName() {
      return model.getCatName(model.selectedIndex);
    },

    getClickCount() {
      return model.getCount();
    },

    updateClickCount() {
      model.incrementCount();
      countView.render();
    },

    getClickDescriptorText() {
      if (model.count < 2) {
        return ' time.';
      }
      return ' times.';
    }
  };

  const catListView = {
    init() {
      this.catList = $('.cat-list');
      this.fetchButton = $('#fetch-button');
      this.fetchButton.click(() => {
        controller.refreshImages();
        controller.updateClickCount();
      });
      this.imageItems = controller.getImagesLinks().map((link) =>
        $(`<div class="cat-item">
          <img src="${link}" alt="">
        </div>`));
      catListView.render();
    },

    render() {
      catListView.catList.empty();
      catListView.imageItems.forEach((imageItem) => {
        catListView.catList.append(imageItem);
      });
      function getClickedIndex(target) {
        return model.imageLinks.indexOf($(target).find('img').attr('src'));
      }

      $('.cat-item').click(function () {
        const target = getClickedIndex(this);
        controller.updateSelected(target);
      });

      controller.updateSelector();
    },

    getSelectedImage() {
      return this.imageItems[model.getSelectedIndex()].clone();
    },
  };

  const mainImageView = {
    init() {
      this.mainImage = $('.image-1');
      this.imageName = $('#name-1');
      mainImageView.render();
    },

    render() {
      this.mainImage.find('img').remove();
      this.mainImage.append(catListView.getSelectedImage());
      this.imageName.text(controller.setCatName());
    },
  };

  const countView = {
    init() {
      this.counter = $('.count-text-info');
      this.countDescriptor = $('.count-descriptor');
      countView.render();
    },

    render() {
      this.counter.text(model.count);
      this.countDescriptor.text(controller.getClickDescriptorText());
    }
  }
  controller.init();
});

// const url = 'https://api.thecatapi.com/v1/images/search';
// const breedsUrl = 'https://api.thecatapi.com/v1/breeds';
// let count = 0;
// let catNames;
// let imageLinks = [];
//
// function fetchImage() {
//   $('.cat-list').empty();
//   $('.image-1 > img').remove();
//   $('#name-1').text('');
//   $('.loading-text').removeClass('hidden');
//   $.ajax({
//     url,
//     type: 'get',
//     headers: {
//       'x-api-key': '8b43e25f-85d5-4540-b319-6cc6a7b481b8',
//     },
//     data: {
//       limit: 5,
//     }
//
//   })
//     .done((data) => {
//       data.forEach((item) => {
//         $(`<div class="cat-item">
//           <img src="${item.url}" alt="">
//         </div>`).appendTo('.cat-list');
//         imageLinks.push(item.url);
//       });
//
//       $('.cat-item > img').click(function() {
//         selectImage(this);
//       });
//
//       $('.cat-item > img')[0].click();
//       $('.loading-text').addClass('hidden');
//     });
// }
//
// function selectImage(target) {
//   $('.image img').remove();
//   $('#name-1').text(catNames[imageLinks.indexOf(target.src)]);
//   $('.image-1').append($(target).clone());
//
//   $('.cat-item').removeClass('selected');
//   $(target).closest('.cat-item').addClass('selected');
// }
//
//
//
// function fetchNames() {
//   $.ajax({
//     url: breedsUrl,
//     type: 'get',
//     headers: {
//       'x-api-key': '8b43e25f-85d5-4540-b319-6cc6a7b481b8',
//     },
//   })
//     .done((data) => {
//       catNames = data.map((item) => item.name);
//     });
// }
//
// function setNames(id) {
//   function catName() {
//     return catNames[Math.floor(Math.random() * catNames.length) + 1];
//   }
//
//   $(id).text(catName());
// }
//
// function incrementCount() {
//   count += 1;
//   $('.count').text(count);
// }
//
// $(() => {
//   fetchNames();
//   fetchImage();
// });
//
// $('#fetch-button').click(() => {
//   fetchImage();
//   incrementCount();
// });
