$(document).ready(function (){
  console.log("main.js ready function is working!");
  // Show page is loading
  $(document).ajaxStart(function(){
    $("body").css("cursor","progress");
  }).ajaxStop(function(){
    $("body").css("cursor","auto");
  });


  /*----------------------------------------*/
  /*         HTML Display function          */
  /*----------------------------------------*/
  // Home page section
  homeHeaderHeight();
  homeHeaderHeightResize();
  displayPhotoWhenPageLoad();
  $("#main_display_page").hide();
  $("#home_page").show();
  
  // Header section
  searchFieldInteraction();

  // Navigation section
  addNavElement();
  navInteraction();

  // Photo content section
  addPhotoElement();
  
  // Modal section
  modalHeightSize();
  modalHeightResize();
  modalMarginTop();
  
  /*----------------------------------------*/
  /*           Fetch photo function         */
  /*----------------------------------------*/
  photosDisplay();
  thumbnail(); // click recent review thumbnail to open modal
});//ready end
