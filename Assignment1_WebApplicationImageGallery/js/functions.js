/*******************************************************************
                HTML elements display functions
*******************************************************************/
let categoryNameList = ["Baseball", "Basketball", "Football", "Figure skating", "Tennis"];

/*--------------------------------------*/
/*        Home page section             */
/*--------------------------------------*/

function homeHeaderHeight(){
  let currentHeight = $(window).height();
  // set up home page header_image_container height 
  let heightResize = currentHeight * 0.45;
  $("#header_image_container").css({
    "height": heightResize+"px"
  });//css end
}


// make home page header_image_container responsive
function homeHeaderHeightResize(){
  $(window).resize(function(){
    homeHeaderHeight();
  });
}

/*--------------------------------------*/
/*           Header section             */
/*--------------------------------------*/

//Hide or Show clear buttons, clear search text
function searchFieldInteraction(){
  console.log("searchFieldInteraction() working!");
  
  //Hide and show clear button denpend if there is text in the search field
  $("#searchClear, #home_searchClear").hide();
  $("#searchInput, #home_searchInput").keyup(function(){
    let keyUpValLen = $(this).val().length;
    if( keyUpValLen >  0){
      $("#searchClear, #home_searchClear").show();
    } else {
      $("#searchClear, #home_searchClear").hide();
    }
  });//key up end
  
  //press the clear button to clear the search field
  $("#searchClear, #home_searchClear").click(function(){
    keyUpValLen = 0;
    $("#searchInput, #home_searchInput").val("");
    $("#searchClear, #home_searchClear").hide();
  });//clear search end
} //searchFieldInteraction end



/*--------------------------------------*/
/*        Navigation section            */
/*--------------------------------------*/
// Add navigation list according to given category name
function addNavElement(){
  console.log("addNavElement() working!");
  //add navigation list to home page navigation
  for (let i = 0; i < categoryNameList.length; i++){
    let navIndividual = `<ul class="home_navCategory"><li class="home_navCategoryName">${categoryNameList[i]}</li></ul>`;
    $("#home_navCategories").append(navIndividual);
  }// for loop end
  
  /*--------------------------------------*/
  
  //add navigation list to main display page navigation
  for (let i = 0; i < categoryNameList.length; i++){
    let navIndividual = `<ul class="navCategory"><li class="navCategoryName">${categoryNameList[i]}</li></ul>`;
    $("#navCategories").append(navIndividual);
  }// for loop end
}//addNavElement end


//change navigation css style when user click it
function navInteraction(){
  console.log("navInteraction() working!");
  //Show or Hide navigation
  $("#showNav").click(function(){
    $("#showNav").hide();
    $("#hideNav").show();
    $("#navigation").slideDown("slow");
  });//show nav click event end
  
  $("#hideNav").click(function(){
    $("#showNav").show();
    $("#hideNav").hide();
    $("#navigation").slideUp("slow");
  });//hide nav click event end

  /*--------------------------------------*/
  // when click logo, refresh page -> go back to home page
  $("#logo").click(function(){
    location.reload();
  });//click End
}//navInteraction end


/*--------------------------------------*/
/*        Photo section                 */
/*--------------------------------------*/

function addPhotoElement(){
  console.log("addPhotoElement() working!");
  //photoContent >>> photoCategoryName
  //photoContent >>> mainCategories >>> mainThumbnails >>> figure >>> img + figcaption
  let categoryNameStr = "";
  let h4 = `<h4 class="photoCategoryName">Welcome to the Sports Gallery!!</h4>`;
  let mainThumbnails = `<div class="mainThumbnails"></div>`;
  categoryNameStr += `${h4}${mainThumbnails}</div>`;
  $("#photoContent").html(categoryNameStr);
}//addPhotoElement end



/*--------------------------------------*/
/*        Modal section                 */
/*--------------------------------------*/
// set modalContent max height 
function modalHeightSize(){
  let currentHeight = $(window).height();
  // make navigation and about section scroll if overflow
  if($(window).width() > 1042){
    let elementHeight = currentHeight - 130 - 50; //130 header, 50 footer
    $("#about, #firstSection").css({
      "max-height": elementHeight+"px",
      "overflow": "scroll",
      "padding-bottom": "10px"
    });//css end
  }// if end
  
  // modalContent max height adjust
  let modalHeight = currentHeight * 0.95; //95% of the window height
  $("#modalContent").css({
    "max-height": modalHeight + "px"
  });//css end

  // modalPhoto max height adjust
  let photoHeight = modalHeight * 0.8; // 80% of the modalContent height
  $("#modalPhoto").css({
    "max-height": photoHeight+"px"
  });//css end
  
}//modalHeightSize() end

function modalMarginTop(){
  let marginTop;
  // modalContent margin adjust
  if ($(window).width() < $(window).height()){
    marginTop = $(window).height() * 0.2;
    $("#modalContent").css({
      "margin-top": marginTop+"px"
    });//css end
  } else if (($(window).width() - $(window).height()) > 200){
    marginTop = $(window).height() * 0.05;
    $("#modalContent").css({
      "margin-top": marginTop+"px"
    });//css end
  }// if end
}//modalMarginTop() end

function modalHeightResize(){
  console.log("modalHeightResize() working!");
  $(window).resize(function(){
    modalHeightSize();
    modalMarginTop();
  });
}//modalHeightResize() end



/**************************************************************************
                HTML elements display functions end
***************************************************************************
***************************************************************************
***************************************************************************
                     Fetch photo functions start
**************************************************************************/



/*******************************************************************
                        Fetch photo functions
*******************************************************************/
let API_KEY = "api_key=3232f59db05cf16e2847859bcace5435";
let categoryName;//Category text value when useer clicked
let photoGetIdStr;//Flickr search string
let photos = []; //photos obj data such as title, url etc
let photoCategoryNameElement = {}; //name text to display in HTML element as content title
let nRequest;
let ownerIconReceived;


/*--------------------------------------*/
/*          Display photos              */
/*--------------------------------------*/
//complete the photoGetIdStr and get data from flickr search url
function photosDisplay(){
  console.log("photosDisplay() function is working!");
  /* CLICK EVENT
      when click navigation
        - change clicked element style
        - get element value to complete photoGetIdStr
  */
  $(".navCategoryName, .home_navCategoryName").click(function(){
    $("#home_page").hide();
    $("#main_display_page").show();
    photos = [];
    let currentClick = $(this);
    let notClick = $(".navCategoryName").not(this);
    
    //change the element style when clicked
    currentClick.css({
        "border-bottom": "1px solid black",
        "font-weight": "bold"
    }); //css end
    notClick.css({
        "border-bottom": "none",
        "font-weight": "normal"
    }); //css end
    /*--------------------------------------*/
    
    // when screen width less than 768, after click, hide navigation
    $(window).resize(function(){
      if ($(window).width() < 768){
      $("#navButton").show();
      $("#showNav").show();
      $("#navigation").hide();
      $("#hideNav").hide();
      }// if end
      if ($(window).width() > 768){
        $("#navButton").hide();
        $("#navigation").show();
      }// if end
    });// resize end
    /*--------------------------------------*/
    
    //get current click navigation name to complete search url
    photoCategoryNameElement.categoryName = currentClick.text();
    categoryName = currentClick.text().toLowerCase().replace(" ", "+");
    // add html element for display photos
    let categoryNameStr = "";
    let h3 = `<h3 class="photoCategoryName">${photoCategoryNameElement.categoryName}</h3>`;
    let mainCategories = `<div class="mainCategories">`;
    let mainThumbnails = `<div class="mainThumbnails"></div>`;
      categoryNameStr += `${h3}${mainCategories}${mainThumbnails}</div>`;
    $("#photoContent").html(categoryNameStr);
    $("title").html(`SportsPhoto - ${photoCategoryNameElement.categoryName}`);

    // complete photoGetIdStr url
    photoGetIdStr = "https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=10&sort=relevant&content_type=4&format=json&nojsoncallback=1&" + API_KEY + "&tags=" + categoryName + "&text=" + categoryName;
    getPhotos(photoGetIdStr);
  });//categoryName click end
  /*//////////////////////nav click event end//////////////////////////*/

  /* SEARCH
       - get user input value
       - complete photoGetIdStr url
  */
  $("#searchInput, #home_searchInput").keypress(function(event){
    //Ensure user type something when hit return
    if( event.which == 13 && $(this).val().length > 0){
      $("#home_page").hide();
      $("#main_display_page").show();
      let categoryName = $(this).val().toLowerCase().replace(" ", "+");
      let categoryNameStr = "";
      let searchResult = $(this).val();
      let mainCategories = `<div class="mainCategories">`;
      let mainThumbnails = `<div class="mainThumbnails"></div>`;
        categoryNameStr += `<h3 class="photoCategoryName">Search Results for: ${searchResult}</h3>${mainCategories}${mainThumbnails}</div>`;
      $("#photoContent").html(categoryNameStr);

      photoGetIdStr = "https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=10&sort=relevant&content_type=4&format=json&nojsoncallback=1&" + API_KEY + "&tags=" + categoryName + "&text=" + categoryName;
      $(this).val("");//clear input field after press enter
      $("#searchClear, #home_searchClear").hide();
      $(".navCategoryName").css({
        "border-bottom": "none",
        "font-weight": "normal"
      }); //css end
      getPhotos(photoGetIdStr);
    }//if end
  });//get user search input value end
}//photosDisplay end


/*--------------------------------------*/
/*          Working with APIs           */
/*--------------------------------------*/
function getPhotos(photoGetIdStr){
  $.get(photoGetIdStr, function(data){
    photos = [];
    fetchPhoto (data);
  });//get method end
}

function fetchPhoto(data){
  console.log("fetchPhoto() function is working!");
  let searchPhotoArray = data.photos.photo;
  for (let i = 0; i < searchPhotoArray.length; i++){
    nRequest = searchPhotoArray.length;
    ownerIconReceived = 0;
    let photoObj = {caption: searchPhotoArray[i].title, photoId: searchPhotoArray[i].id, ownerId: searchPhotoArray[i].owner.replace("@", "%40")};
    photos.push(photoObj);
    getSizes(photoObj);
    getOwnerInfo(photoObj);
  }// for loop end
}//fetchPhoto end

//creat getSize function
function getSizes(photoObj){
  let getSizesStr = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=512351e3d9cb0cf0c762bcba677f5b5b&format=json&nojsoncallback=1&" + API_KEY + "&photo_id=" + photoObj.photoId;

  $.get(getSizesStr, function(data){
    //console.log(data);
    let getSizesArray = data.sizes.size;
    //console.log(getSizesArray[0].label);
    for (let i = 0; i < getSizesArray.length; i++){
      let labelName = getSizesArray[i].label.toLowerCase();
      if (labelName === "small"){
        photoObj.smallUrl = getSizesArray[i].source;
      } else if (labelName === "thumbnail"){
        photoObj.recReUrl = getSizesArray[i].source;
      } else if (labelName === "large"){
        photoObj.largUrl = getSizesArray[i].source;
      } else if (labelName === "original"){
        photoObj.largestUrl = getSizesArray[i].source;
      }
      photoObj.smallestUrl = getSizesArray[0].source;
    }// for loop end
  });//get method end
}// getSizes end

//Get photo owner icon -> flickr.people.getInfo
function getOwnerInfo(photoObj){
  let getOwnerInfoStr = "https://api.flickr.com/services/rest/?method=flickr.people.getInfo&format=json&nojsoncallback=1&" + API_KEY + "&user_id=" + photoObj.ownerId;
  $.get(getOwnerInfoStr, function(data){
    ownerIconReceived ++;
    let iconFarm;
    let iconServer;
    let ownerIcon;
    if (data.person.iconfarm > 0 && data.person.iconserver > 0){
      iconFarm = data.person.iconfarm;
      iconServer = data.person.iconserver;
      ownerIcon = `https://farm${iconFarm}.staticflickr.com/${iconServer}/buddyicons/${photoObj.ownerId}.jpg`;
    } else {
      ownerIcon = `https://www.flickr.com/images/buddyicon.gif`;
    }
    photoObj.ownerIcon = ownerIcon;
    photoObj.ownerProfile = data.person.profileurl._content;
    //Display photos when ownerIconReceived is = to nRequest
    if (nRequest == ownerIconReceived){
      figDisplay(photos);
    }//if end
  });//get end
}// getOwnerInfo() end

/*--------------------------------------*/
/*              Display                 */
/*--------------------------------------*/
function figDisplay(photos){
  console.log(photos);
  /*--------------------------------------*/
  // main display section
  let figureStr = "";
  for (let i = 0; i < photos.length; i ++){
    let figSrc;
    let modalUrl;
    // make sure have small size photos
    
    if (photos[i].hasOwnProperty("smallUrl")){
      figSrc = photos[i].smallUrl;
    } else {
      figSrc = photos[i].smallestUrl;
    }// if for small size end
    // make sure have large size photos
    if (photos[i].hasOwnProperty("largUrl")){
      modalUrl = photos[i].largUrl;
    } else {
      modalUrl = photos[i].largestUrl;
    } // if for large size end
    let figTitle = photos[i].caption;
    let ownerSrc = photos[i].ownerIcon;
    let ownerUrl = photos[i].ownerProfile;
    let recentThumb = photos[i].recReUrl;
    let figInfoElement = `<div class="figInfo"><a href="${ownerUrl}" target="_blank"><img src="${ownerSrc}" alt="" /></a><figcaption>${figTitle}</figcaption></div>`;
    let figureElement = `<figure><div class="imgContainer" modalUrl="${modalUrl}" recentThumb="${recentThumb}" modalOwIcon="${ownerSrc}" modalCaption="${figTitle}" modalProfile="${ownerUrl}"><img src="${figSrc}" alt="" /></div>${figInfoElement}</figure>`;
    figureStr += figureElement;
  } // for loop end
  $(".mainThumbnails").html(figureStr);
  /*--------------------------------------*/

  //Modal and recent reveiw section
  $(".imgContainer").each(function(){
    $(this).click(function(){
      // Modal section, show + display modal
      $("#modal").show();
      $("#modalPhoto").attr("src", $(this).attr("modalUrl"));
      $("#modalProfile").attr("href", $(this).attr("modalProfile"));
      $("#modalOwnerIcon > a > img").attr("src", $(this).attr("modalOwIcon"));
      $("#modalCaption").html($(this).attr("modalCaption"));
      /*--------------------------------------*/
      
      // Recent review, add to recent review
      let recentThumbUrl= $(this).attr("recentThumb");
      let figure = `<figure><img src="${recentThumbUrl}" alt="" /></figure>`;
      $("#recentRevThumbnails").prepend(figure);
      let figureLength = $("#recentRevThumbnails > figure").length;
      
      // make sure no more than 5 thumbnails
      if (figureLength > 5){
        $("#recentRevThumbnails > figure")[figureLength - 1].remove()
      }
      $("#recentRev").show();
      $("#photoContent").css("padding-top", "10px");
    });// click end
  });//each end
  
  // hide modal when modalClose clicked
  $("#modalClose").click(function(){
    $("#modal").hide();
  });//modal close click end
}// figDisplay() end


// click thumbnail photo show modal
function thumbnail(){
  $("#recentRevThumbnails").each(function(){
    $(this).click(function(){
      $("#modal").show();
    });//click end
  });//each end
}//thumbnail() end


/*--------------------------------------*/
/*        Home page Display             */
/*--------------------------------------*/
function displayPhotoWhenPageLoad(){
  photoGetIdStr = "https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=1&sort=relevant&content_type=4&format=json&nojsoncallback=1&&tags=sport&text=sport&" + API_KEY;
  $.get(photoGetIdStr, function(data){
    photos = [];
    let searchPhotoArray = data.photos.photo;
    for (let i = 0; i < searchPhotoArray.length; i++){
      let photoObj = {caption: searchPhotoArray[i].title, photoId: searchPhotoArray[i].id, ownerId: searchPhotoArray[i].owner.replace("@", "%40")};
      photos.push(photoObj);
      let getSizesStr = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=512351e3d9cb0cf0c762bcba677f5b5b&format=json&nojsoncallback=1&" + API_KEY + "&photo_id=" + photoObj.photoId;

      $.get(getSizesStr, function(data){
        let getSizesArray = data.sizes.size;
        // get original size
        for (let i = 0; i < getSizesArray.length; i++){
          let labelName = getSizesArray[i].label.toLowerCase();
          if (labelName === "original"){
            photoObj.original = getSizesArray[i].source;
          } else if (labelName === "large"){
            photoObj.large = getSizesArray[i].source;
          } // if end
        }// for loop of get size end
        console.log(photos);
        for (let i = 0; i < photos.length; i ++){
          let figSrc;
          if (photos[i].hasOwnProperty("original")){
            figSrc = photos[i].original;
          } else {
            figSrc = photos[i].large;
          } // if for large size end
          let figInfoElement = `<img src="${figSrc}" alt="" />`;
          //figureStr += figureElement;
          $("#header_image_container > img").replaceWith(figInfoElement);
        }// for loop of display end
      });//get size method end
    }// for loop of get id method end
  });//get id method end
}//displayPhotoWhenPageLoad ()
