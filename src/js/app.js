$(() => {
  const model = {
    init() {
      this.url = 'https://api.thecatapi.com/v1/images/search';
      this.breedsUrl = 'https://api.thecatapi.com/v1/breeds';
      this.clickCount = 0;
      this.catNames = [];
      this.imageLinks = [];
      this.selectedIndex = 0;
      this.nameOffset = 0;
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
            model.setNameOffset();
            resolve();
          });
      });
    },

    setNameOffset() {
      model.nameOffset = Math.floor(Math.random() * (model.catNames.length - 5)) + 1;
    },

    getImages() {
      return this.imageLinks;
    },

    getCatName(index) {
      return this.catNames[index];
    },

    setSelectedIndex(index) {
      this.selectedIndex = Number(index);
    },

    getSelectedIndex() {
      return this.selectedIndex;
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
      adminView.init();
    },

    refreshImages() {
      $('.loading-text').removeClass('hidden');
      mainImageView.mainImage.find('img').remove();
      mainImageView.imageName.text('');
      catListView.catList.empty();
      Promise.all([model.fetchImages(), model.fetchNames()])
        .then(() => {
          model.selectedIndex = 0;
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

    getCatName() {
      return model.getCatName(model.selectedIndex + model.nameOffset);
    },

    getClickDescriptorText() {
      if (model.clickCount < 2) {
        return ' time.';
      }
      return ' times.';
    },

    setClickDescriptorText() {
      countView.countDescriptor.text(controller.getClickDescriptorText());
    },

    setClickCountText() {
      countView.counterText.text(model.clickCount);
    },

    increaseCount() {
      model.clickCount += 1;
    },

    updateCounterText() {
      countView.counterText.text(model.clickCount);
      countView.render();
    },

    updateCatName(newName) {
      model.catNames[model.selectedIndex] = newName;
      mainImageView.render();
    },

    updateCatImageURL(url) {
      model.imageLinks[model.selectedIndex] = url;
      catListView.init();
      mainImageView.render();
    },

    resetClickCount() {
      model.clickCount = 0;
      controller.updateCounterText();
    }
  };

  const catListView = {
    init() {
      this.catList = $('.cat-list');
      this.fetchButton = $('#fetch-button');
      this.fetchButton.off().click(() => {
        controller.refreshImages();
        controller.increaseCount();
        controller.updateCounterText();
      });
      this.imageItems = controller.getImagesLinks().map((link, index) =>
        $(`<div class="cat-item">
          <img src="${link}" alt="" data-index="${index}">
        </div>`));
      catListView.render();
    },

    render() {
      catListView.catList.empty();
      catListView.imageItems.forEach((imageItem) => {
        catListView.catList.append(imageItem);
      });
      function getSelectedImageIndex(target) {
        return Number($(target).find('img').attr('data-index'));
      }

      $('.cat-item').click(function () {
        const targetIndex = getSelectedImageIndex(this);
        controller.updateSelected(targetIndex);
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
      $('.loading-text').addClass('hidden');
      this.mainImage.find('img').remove();
      this.mainImage.append(catListView.getSelectedImage());
      this.imageName.text(controller.getCatName());
    },
  };

  const countView = {
    init() {
      this.counterText = $('.count-text-info');
      this.countDescriptor = $('.count-descriptor');
      countView.render();
    },

    render() {
      controller.setClickDescriptorText();
      controller.setClickCountText();
    }
  }

  const adminView = {
    init() {
      const adminForm = $('#admin-form');
      const newCatName = $('#new-cat-name');
      const catImageURL = $('#cat-image-url');
      const refreshCountCheck = $('#refresh-count-check');

      adminForm.submit((event) => {
        event.preventDefault();
        if (newCatName.val().length > 0) {
          controller.updateCatName(newCatName.val());
          controller.setCatName();
        }
        if (catImageURL.val().length > 0) {
          $('.loading-text').removeClass('hidden');
          controller.updateCatImageURL(catImageURL.val());
        }
        if (refreshCountCheck.is(':checked')) {
          controller.resetClickCount();
        }
        $('#adminModal').modal('hide');
        adminForm[0].reset();
      });
    },
  }

  controller.init();
});
