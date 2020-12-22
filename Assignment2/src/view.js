import $ from "jquery";
/*----------------------------------------------------------------------------*/
/*                                  Icons                                     */
/*----------------------------------------------------------------------------*/
import searchIcon from "./icons/search_icon.png";
import flickrIcon from "./icons/flickr.png";
import facebookIcon from "./icons/facebook.png";
import headerBackground from "./backgroundImg/headerBackground.jpg";
import navBackground from "./backgroundImg/navBackground.jpg";
/*----------------------------------------------------------------------------*/
/*                              Screenshoot                                   */
/*----------------------------------------------------------------------------*/
import desktopView from "./screenshots/desktopView.png";
import mobileView from "./screenshots/mobileView.png";
import facebookApi from "./screenshots/facebookApi.png";
import flickrApi from "./screenshots/flickrApi.png";
import flickrPhotoSearch from "./screenshots/flickrPhotoSearch.png";
/*----------------------------------------------------------------------------*/
/*                                 Template                                   */
/*----------------------------------------------------------------------------*/
import startPage from "./templates/startPage.handlebars";
import mainPage from "./templates/mainPage.handlebars";
import navigation from "./templates/navigation.handlebars";
import loading from "./templates/loading.handlebars";
import welcome from "./templates/welcome.handlebars";
//-------------------------------Flickr Content----------------------------------
import flickrPhotos from "./templates/flikr/flikrPhotos.handlebars";
//------------------------------Photo Content------------------------------------
import photoContainer from "./templates/imageTemplate/photoContainer.handlebars";
import photoModal from "./templates/imageTemplate/photoModal.handlebars";
import recentView from "./templates/imageTemplate/recentView.handlebars";
//-------------------------------Facebook Content--------------------------------
import facebookPosts from "./templates/facebook/facebookPotos.handlebars";
import noData from "./templates/facebook/noData.handlebars";
import userInfo from "./templates/facebook/userInfo.handlebars";


/******************************************************************************/
/*                                                                            */
/*                                 Display                                    */
/*                                                                            */
/*----------------------------------------------------------------------------*/


                      /*--------------------------------------*/
                      /*        Start page section            */
                      /*--------------------------------------*/
                      
export function start(){
  let data = {desktop: desktopView, mobile: mobileView, fbApi: facebookApi, flickrApiA: flickrApi, flickrApiB: flickrPhotoSearch};
  $("#start_page").html(startPage(data));
}

                    /*--------------------------------------*/
                    /*          Main page section           */
                    /*--------------------------------------*/

export function displayMain(){
  $("#start_page").hide();
  
  // Apply template
  let iconData = {headerBgImg: headerBackground, navBgImg:navBackground, search: searchIcon, flickr: flickrIcon, facebook: facebookIcon};
  $("#bodyContainer").html(mainPage(iconData));
  $("#welcome").html(welcome());
  
  // Depend on the browser width, add background image to navigation bar
  if($(window).width() >= 1024){
    $("#navBar").css("background-image", `url(${navBackground})`);
  } else {
    $("#navBar").css("background-image", "none");
  }
  $(window).resize(function(){
    if($(window).width() >= 1024){
      $("#navBar").css("background-image", `url(${navBackground})`);
    } else {
      $("#navBar").css("background-image", "none");
    }
  });
}

export function showLoading(){ // show loading animation
  $("#contentContainer").html(loading());
  contentElementHeight(); // line 317
}

export function afterLogout(){ // show welcom page after logout
  $("#contentContainer").html(welcome());
  contentElementHeight(); // line 317
}

                    /****************************************/
                    /*       Facebook content section       */
                    /*--------------------------------------*/
// recevive data from facebook.js, call by main.js
export function showNavigation(data){ 

  // if user have likes, then show the names as navigation, else show the message of not have likes
  let navData = {haveData: false};
  if (data != undefined){
    navData['haveData'] = true;
    navData['categoryNames'] = data.data;
  } else {
    let wordData = {word: "like any pages", alternative: "your posts on facebook"};
    $("#contentContainer").html(noData(wordData));
    contentElementHeight(); // line 317
  } // if else end
  
  $("#navigation").html(navigation(navData));
}// showNavigation end

// receieve data from facebook.js, call by main.js
export function showUserInfo(data){ 
  let userData = {info: data};
  $("#userInfo").html(userInfo(userData));
} //showUserInfo end

// receieve data from facebook.js, call by main.js
export function displayFbPosts(data){
  // if user don't have any posts, show the message, else show the posts
  if (data == undefined) {
    let wordData = {word: "make any post", alternative: "the categories you like on facebook"};
    $("#contentContainer").html(noData(wordData));
    
    contentElementHeight(); //adjust padding to let footer stay on bottom // line 317
  } else {
    let postsData = {posts: data.data};
    $("#contentContainer").html(facebookPosts(postsData));
    
    // if is not flickr photo, then let the main container have posts as title
    let title = {flickr: false, titleName: "Facebook Postos"};
    $("#title").html(photoContainer(title));

    contentElementHeight(); //adjust padding to let footer stay on bottom // line 317
  } //if else end
}// displayFbPosts() end

                    /****************************************/
                    /*        Flickr photos section         */
                    /*--------------------------------------*/

export function createPhotoElement(name){
  // if is flickr photo, then let the main container have user liked page's name as title
  let nameData = {flickr: true, currentName: name};
  $("#title").html(photoContainer(nameData));
}

// receive data from template
export function figDisplay(photos){ 
  
  // sorting data
  let photosData = [];
  photos.forEach((photo) => {
    let photoObj = {};
    if (photo.hasOwnProperty("largUrl")){
      photoObj['modalUrl'] = photo.largUrl;
    } else {
      photoObj['modalUrl'] = photo.largestUrl;
    } // if for large size end
    if (photo.hasOwnProperty("smallUrl")){
      photoObj['figSrc'] = photo.smallUrl;
    } else {
      photoObj['figSrc'] = photo.smallestUrl;
    }
    photoObj['figTitle'] = photo.caption;
    photoObj['ownerSrc'] = photo.ownerIcon;
    photoObj['ownerUrl'] = photo.ownerProfile;
    photoObj['recentThumb'] = photo.recReUrl;
    photosData.push(photoObj);
  }); //forEach end
  
  // apply template
  let photoData = {fkPhotos: photosData};
  $("#contentContainer").html(flickrPhotos(photoData));
  
}// figDisplay() end

                    /****************************************/
                    /*    Modal & recentReview section      */
                    /*--------------------------------------*/

export function displayModal(modalObj){
  let modalData = {modal: modalObj};
  $("#modalTemplate").html(photoModal(modalData));
}

export function displayRecentRev(modalObj){
  console.log("work!!");
  let modalData = {modal: modalObj};
  $("#recentRevTemplate").prepend(recentView(modalData));
  let figureLength = $("#recentRevTemplate > figure").length;
  // make sure no more than 5 thumbnails
  if (figureLength > 5){
    $("#recentRevTemplate > figure")[figureLength - 1].remove();
  }
  
}

/******************************************************************************/
/*                                                                            */
/*                          Adjust element style                              */
/*                                                                            */
/*----------------------------------------------------------------------------*/
                      /*--------------------------------------*/
                      /*            Start page                */
                      /*--------------------------------------*/
                      
export function introElementSize(){
  console.log($(window).height());
  let currentHeight = $(window).height();
  let elementHeight = currentHeight * 0.85; //80% of the window height
  $(".startContentContainer").css({
    "height": elementHeight + "px",
  });//css end
  let introHeight = currentHeight * 0.4;
  $("#intro").css("height", introHeight + 'px');
  
}


                      /*--------------------------------------*/
                      /*             Navigation               */
                      /*--------------------------------------*/

export function loginButtonStyle(){
  let currentHeight = $(window).height();
  let newHeight = currentHeight * 0.5;
  console.log(newHeight);
  
  if ($(window).width() >= 1024){
    $("#login").css({
      "height": '100%'
    });
  } else {
    $("#login").css({
      "height": newHeight + 'px'
    });
  }
  $(window).resize(function(){
    if ($(window).width() >= 1024){
      $("#login").css({
        "height": '100%'
      });
    } else {
      $("#login").css({
        "height": newHeight + 'px'
      });
    }
  });
}

// when screen width less than 768, after click, hide navigation
export function hideNavigation(){
  if ($(window).width() < 1024){
      hideNavDisplay(); //line 342
  }
}


                    /*--------------------------------------*/
                    /*           Modal section              */
                    /*--------------------------------------*/
// set modalContent max height 
export function modalHeightSize(){
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

export function modalMarginTop(){
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

export function modalHeightResize(){
  console.log("modalHeightResize() working!");
  $(window).resize(function(){
    modalHeightSize(); // line 263
    modalMarginTop(); // libe 289
  });
}//modalHeightResize() end

                    /*--------------------------------------*/
                    /*                 Genral               */
                    /*--------------------------------------*/
// Adjust element padding to let footer stay on bottom
export function contentElementHeight(){
  let elementHeight = $("header").height() + $("footer").height() + $("#mainContent").height();
  
  if ($(window).height() - elementHeight > 0) {
    let newHeight = $(window).height() - elementHeight - 2; // 2px --> footer border-top
    $("#mainContent").css("padding-bottom", newHeight + "px");
  } else {
    $("#mainContent").css("padding-bottom", "0px");
  }
  
  /* sample
  $(window).height() --> 666
  $("header").height()--> 102
  $("footer").height()--> 50 + border-top: 2px
  $("#mainContent").height()--> 237
  666 - 102 - 52 - 237 = 275px padding add to mainContent
  */
}


/******************************************************************************/
/*                                                                            */
/*                        Element on click display                            */
/*                                                                            */
/*----------------------------------------------------------------------------*/
export function hideNavDisplay() {
  if ($(window).width() < 1024){
    $("#navBar").animate({
    width:'toggle'
    }, 1000, function(){
      $("#showNav").show(500);
    });
  }
  
}
export function showNavDisplay() {
  if ($(window).width() < 1024){
    $("#navBar").animate({
      width: "toggle"
    }, 1000, function(){
      $("#showNav").hide();
    });
  }
  
}
export function showNavBaseWidth(){
  $(window).resize(function(){
    if($(window).width() < 1024) {
      $("#navBar").show(1000, function(){
        $("#showNav").hide();
      });
    }
  });
  if($(window).width() < 1024) {
    $("#navBar").show(1000, function(){
      $("#showNav").hide();
    });
  }
}

export function clickOrNotStyle(clicked, notclicked) {
  if($(window).width() < 1024) {
    clicked.css({
      "box-shadow": "5px 0 rgb(113, 63, 63) inset"
    }); //css end
    notclicked.css({
      "box-shadow": "none"
    }); //css end
  } else {
    clicked.css({
      "box-shadow": "0 5px 8px -5px #561b00 inset",
      "background-color": "rgba(255, 255, 255, 0.45)"
    }); //css end
    notclicked.css({
      "box-shadow": "0 5px 5px -5px #561b00",
      "background-color": "background-color: rgba(255,255,255, 0.76);"
    }); //css end
  }
  $(window).resize(function(){
    if($(window).width() < 1024) {
      clicked.css({
        "box-shadow": "5px 0 rgb(113, 63, 63) inset"
      }); //css end
      notclicked.css({
        "box-shadow": "none"
      }); //css end
    } else {
      clicked.css({
        "box-shadow": "0 5px 8px -5px #561b00 inset",
        "background-color": "rgba(255, 255, 255, 0.45)"
      }); //css end
      notclicked.css({
        "box-shadow": "0 5px 5px -5px #561b00",
        "background-color": "background-color: rgba(255,255,255, 0.76);"
      }); //css end
    }
  });

}

export function cancelFlickrNavStyle() {
  if($(window).width() < 1024) {
    $(".navCategoryName").css({
      "box-shadow": "none"
    }); //css end
  } else {
    $(".navCategoryName").css({
      "box-shadow": "0 5px 5px -5px #561b00",
      "background-color": "background-color: rgba(255,255,255, 0.76);"
    }); //css end
  }
  $(window).resize(function(){
    if($(window).width() < 1024) {
      $(".navCategoryName").css({
        "box-shadow": "none"
      }); //css end
    } else {
      $(".navCategoryName").css({
        "box-shadow": "0 5px 5px -5px #561b00",
        "background-color": "background-color: rgba(255,255,255, 0.76);"
      }); //css end
    }
  });
}
