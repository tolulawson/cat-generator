$(function(){var i={init:function(){return this.url="https://api.thecatapi.com/v1/images/search",this.breedsUrl="https://api.thecatapi.com/v1/breeds",this.clickCount=0,this.catNames=[],this.imageLinks=[],this.selectedIndex=0,this.nameOffset=0,Promise.all([i.fetchImages(),i.fetchNames()])},fetchImages:function(){var e=this;return new Promise(function(n){$.ajax({url:e.url,type:"get",headers:{"x-api-key":"8b43e25f-85d5-4540-b319-6cc6a7b481b8"},data:{limit:5}}).done(function(e){var t=[];e.forEach(function(e){t.push(e.url)}),i.imageLinks=t,n()})})},fetchNames:function(){var e=this;return new Promise(function(t){$.ajax({url:e.breedsUrl,type:"get",headers:{"x-api-key":"8b43e25f-85d5-4540-b319-6cc6a7b481b8"}}).done(function(e){i.catNames=e.map(function(e){return e.name}),i.setNameOffset(),t()})})},setNameOffset:function(){i.nameOffset=Math.floor(Math.random()*(i.catNames.length-5))+1},getImages:function(){return this.imageLinks},getCatName:function(e){return this.catNames[e]},setSelectedIndex:function(e){this.selectedIndex=Number(e)},getSelectedIndex:function(){return this.selectedIndex}},c={init:function(){i.init().then(function(){t.init(),n.init()}),e.init(),a.init()},refreshImages:function(){$(".loading-text").removeClass("hidden"),n.mainImage.find("img").remove(),n.imageName.text(""),t.catList.empty(),Promise.all([i.fetchImages(),i.fetchNames()]).then(function(){i.selectedIndex=0,t.init(),n.init()})},getImagesLinks:function(){return i.getImages()},updateSelected:function(e){i.setSelectedIndex(e),n.render(),c.updateSelector()},updateSelector:function(){t.catList.children().removeClass("selected"),$(t.catList.children()[i.getSelectedIndex()]).addClass("selected")},getCatName:function(){return i.getCatName(i.selectedIndex+i.nameOffset)},getClickDescriptorText:function(){return i.clickCount<2?" time.":" times."},setClickDescriptorText:function(){e.countDescriptor.text(c.getClickDescriptorText())},setClickCountText:function(){e.counterText.text(i.clickCount)},increaseCount:function(){i.clickCount+=1},updateCounterText:function(){e.counterText.text(i.clickCount),e.render()},updateCatName:function(e){i.catNames[i.selectedIndex]=e,n.render()},updateCatImageURL:function(e){i.imageLinks[i.selectedIndex]=e,t.init(),n.render()},resetClickCount:function(){i.clickCount=0,c.updateCounterText()}},t={init:function(){this.catList=$(".cat-list"),this.fetchButton=$("#fetch-button"),this.fetchButton.off().click(function(){c.refreshImages(),c.increaseCount(),c.updateCounterText()}),this.imageItems=c.getImagesLinks().map(function(e,t){return $('<div class="cat-item">\n          <img src="'.concat(e,'" alt="" data-index="').concat(t,'">\n        </div>'))}),t.render()},render:function(){t.catList.empty(),t.imageItems.forEach(function(e){t.catList.append(e)}),$(".cat-item").click(function(){var e=Number($(this).find("img").attr("data-index"));c.updateSelected(e)}),c.updateSelector()},getSelectedImage:function(){return this.imageItems[i.getSelectedIndex()].clone()}},n={init:function(){this.mainImage=$(".image-1"),this.imageName=$("#name-1"),n.render()},render:function(){$(".loading-text").addClass("hidden"),this.mainImage.find("img").remove(),this.mainImage.append(t.getSelectedImage()),this.imageName.text(c.getCatName())}},e={init:function(){this.counterText=$(".count-text-info"),this.countDescriptor=$(".count-descriptor"),e.render()},render:function(){c.setClickDescriptorText(),c.setClickCountText()}},a={init:function(){var t=$("#admin-form"),n=$("#new-cat-name"),i=$("#cat-image-url"),a=$("#refresh-count-check");t.submit(function(e){e.preventDefault(),0<n.val().length&&(c.updateCatName(n.val()),c.setCatName()),0<i.val().length&&($(".loading-text").removeClass("hidden"),c.updateCatImageURL(i.val())),a.is(":checked")&&c.resetClickCount(),$("#adminModal").modal("hide"),t[0].reset()})}};c.init()});