import $ from "jquery";
import style from "./css/main.css";
import mediaQuery from "./css/mediaQuery.css";
import * as view from "./view.js";
import * as flickr from "./flickr.js";
import * as facebook from "./facebook.js";

$(document).ready(function (){
  console.log("main.js ready function is working!");

/*----------------------------------------------------------------------------*/
/*                          HTML Display function                             */
/*----------------------------------------------------------------------------*/
  view.start(); // display start page 49
  view.introElementSize(); //Add padding to let footer stay on bottom line 207
  
  $(document).on("click", ".getStart", function(){ // display main page
    view.displayMain(); //view.js line 58
    view.showNavBaseWidth(); //view.js line 362
    view.loginButtonStyle(); //view.js line 224
    view.contentElementHeight(); //view.js line 317
  });
  
  
  $(document).on("click", "#login", function(){
    // store view.showNavigation() to parse to facebook.js
    let getNav = (data) => { 
      view.showNavigation(data); //view.js line 95
    };
    // store view.showUserInfo() to parse to facebook.js
    let getInfo = (data) => {
      view.showUserInfo(data); //view.js line 112
    };
    facebook.loginToFB(getInfo, getNav); // call loginToFB, parse on functions
    $("#navContainer").slideDown(1000); //show navigation with slideDown effect
    view.contentElementHeight(); // add padding to element let footer stay on bottom line 317
  });
  
  $(document).on("click", "#logout", function(){
    facebook.logout();
    view.afterLogout(); //view.js line 86
    $("#navContainer").slideUp(1000);
    view.contentElementHeight(); //view.js line 317
  });

  $(document).on("click", "#hideNav", function(){
    view.hideNavDisplay(); //view.js line 342
  });
  $(document).on("click", "#showNav", function(){
    view.showNavDisplay(); //view.js line 352
  });

  
  // Modal section
  view.modalHeightSize(); //view.js line 263
  view.modalHeightResize(); //view.js line 305
  view.modalMarginTop(); //view.js line 289
  
  /*----------------------------------------*/
  /*           Fetch photo function         */
  /*----------------------------------------*/
  getFlickrPhotos(); // line 91
  getModal(); //line 119
  
  $(document).on("click", "#modalClose", function(){
    $("#modal").hide();
  });
  
  // facebook.getUserPosts(displayUserPosts);
  $(document).on("click", "#fbPosts", function(){
    let displayUserPosts = (data) => {
      view.displayFbPosts(data); //view.js line 118
    };
    facebook.getUserPosts(displayUserPosts);
  });

  $(document).on("click", ".facebookCategory", function(){
    // facebook.getUserPosts(displayUserPosts);
    view.hideNavDisplay(); //view.js line 342
    view.contentElementHeight(); //view.js line 317
    let currentClick = $(this); 
    let notClick = $(".facebookCategory").not(this);
    view.clickOrNotStyle(currentClick, notClick); //view.js line 377
    view.cancelFlickrNavStyle(); //view.js line 417
  });
  
  
});//ready end
////////////////////////////////////////////////////////////////////////////
function getFlickrPhotos(){
  let categoryName;//Category text value when useer clicked
  $(document).on("click", ".navCategoryName", function(){
    let currentClick = $(this); 
    let notClick = $(".navCategoryName").not(this);
    view.clickOrNotStyle(currentClick, notClick); //view.js line 377
    /*--------------------------------------*/
    // when screen width less than 768, after click, hide navigation
    view.hideNavigation(); //view.js line 252
    /*--------------------------------------*/
    
    // get current click and display to the html as current content's heading
    let categoryNameStr = currentClick.text(); //$(this).text()  --> Baseball
    view.createPhotoElement(categoryNameStr); //view.js line 141
    view.showLoading(); //view.js line 81
    //get current click navigation name to complete search url
    categoryName = currentClick.text().toLowerCase().split(' ').join('+');
    categoryName = categoryName.replace("/", "%2F");
    // categoryName ---> figure+skating
    console.log("categoryName --->", categoryName);
    let displayFlickrPhotos = (data) => {
      view.figDisplay(data); //view.js line 148
    };
    flickr.getFlickr(categoryName, displayFlickrPhotos);
  }); //click end
}


function getModal(){
  $(document).on('click', ".imgContainer, .recentThumb", function (){
    let modalObj = {};
    modalObj['imageSrc'] = $(this).attr("modalUrl");
    modalObj['href'] = $(this).attr("modalProfile");
    modalObj['iconSrc'] = $(this).attr("modalOwIcon");
    modalObj['caption'] = $(this).attr("modalCaption");
    modalObj['recentThumb'] = $(this).attr("recentThumb");
    view.displayModal(modalObj); //view.js line 181
    view.displayRecentRev(modalObj); //view.js line 186
    $("#modal").show();
    $("#recentRev").show();
    // console.log('$(this).attr("modalUrl") --->', $(this).attr("modalUrl"));
  });
  
}


