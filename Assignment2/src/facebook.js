import $ from "jquery";
const APP_ID = '2057475444520469';
let displayNav_cb;
let displayInfo_cb;

export function loginToFB(infoCb, NavCb) {
  displayInfo_cb = infoCb; //view.js line 112, main.js line 32
  displayNav_cb = NavCb; //view.js line 95, main.js line 28
  
  $.ajaxSetup({ cache: true });
  $.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
    FB.init({
      appId: APP_ID,
      version: 'v3.0' // or v2.1, v2.2, v2.3, ...
    }); 
    FB.getLoginStatus(updateStatusCallback);
  });
}

function updateStatusCallback (response) {
  if (response.status === 'connected') {
    console.log('Logged in.');
    apiFB('info', displayInfo_cb);
    apiFB('likes', displayNav_cb);
    $("#login").hide();
    $("#logout").show();
  }
  else {
    login();
  }
}

function login(){
  console.log("in login function");
  FB.login(function(response){
    console.log(response);
    apiFB('info', displayInfo_cb);
    apiFB('likes', displayNav_cb);
    $("#login").hide();
    $("#logout").show();
  }, {scope: 'user_posts, user_likes'});
}

export function logout(){
  FB.logout(function(response){
    console.log(response);
    console.log("logged out");
    $("#logout").hide();
    $("#login").show();
  });
}

function apiFB(field, cbFunction){
/*
  M = Nov
  j = The day of the month.
  Y = The year in 4 digits. (lower-case y gives the year's last 2 digits)
*/
  FB.api('me?fields=id,name,picture,posts{caption,description,full_picture,message,created_time},likes{category,about,link,name}&date_format=M j, Y', function(data){
    console.log(data);
    let userInfoData = {};
    let userPostsData = {};
    let userLikesData = {};
    let userPhotosData = {};
    let dataNone;
    if (field == 'info') {
      userInfoData['gender'] = data.gender;
      userInfoData['name'] = data.name;
      userInfoData['icon'] = data.picture.data.url;
      cbFunction(userInfoData); //view.js line 112, main.js line 32
    } else if (field == 'posts') {
      if (data.posts !== undefined){
      userPostsData['data'] = data.posts.data;
      cbFunction(userPostsData); //view.js line 118, main.js line 71
      } else {
        dataNone = undefined;
        cbFunction(dataNone); //view.js line 118, main.js line 71
      }
    } else if (field == 'likes') {
      if (data.likes !== undefined){
      userLikesData['data'] = data.likes.data;
      cbFunction(userLikesData); //view.js line 95, main.js line 28
      } else {
        dataNone = undefined;
        cbFunction(dataNone); //view.js line 95, main.js line 28
      }
    }
  });
}

export function getUserPosts(cb){ //view.js line 118, main.js line 71
  apiFB('posts', cb);
}