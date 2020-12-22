import $ from "jquery";
let API_KEY = "api_key=3232f59db05cf16e2847859bcace5435";
let photoGetIdStr;//Flickr search string
let photos = []; //photos obj data such as title, url etc
let nRequest;
let ownerIconReceived;
let flickrDisplayCb;

export function getFlickr(categoryName, cb){ //main.js line 113, view.js line 148
  flickrDisplayCb = cb; //view.js line 148
  photoGetIdStr = "https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=10&sort=relevant&content_type=4&format=json&nojsoncallback=1&" + API_KEY + "&text=" + categoryName;
  getPhotos(photoGetIdStr);
}


/*--------------------------------------*/
/*          fetch, promise all          */
/*--------------------------------------*/
function getPhotos(photoGetIdStr){
  fetch(photoGetIdStr).then((response)=>response.json()).then((data)=>{
    console.log(data);
    photos = [];

    let searchPhotoArray = data.photos.photo;
    // searchPhotoArray ---> [{id: "41433476165", owner: "9767389@N07", …}, {id: "41433473015", …}]
    
    for (let i = 0; i < searchPhotoArray.length; i++){
      nRequest = searchPhotoArray.length; //decide when to display
      ownerIconReceived = 0; //decide when to display
      
      //sorting data
      let photoObj = {caption: searchPhotoArray[i].title, photoId: searchPhotoArray[i].id, ownerId: searchPhotoArray[i].owner.replace("@", "%40")};
      photos.push(photoObj);
      
      //fetch getSizes + getInfo
      let getSizesStr = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=512351e3d9cb0cf0c762bcba677f5b5b&format=json&nojsoncallback=1&" + API_KEY + "&photo_id=" + photoObj.photoId;
      let getOwnerInfoStr = "https://api.flickr.com/services/rest/?method=flickr.people.getInfo&format=json&nojsoncallback=1&" + API_KEY + "&user_id=" + photoObj.ownerId;
      let sizeDataProm = fetch(getSizesStr).then((response)=>response.json());
      let ownerDataProm = fetch(getOwnerInfoStr).then((response)=>response.json());
      
      Promise.all([sizeDataProm, ownerDataProm]).then(data => {
        /* data
        [{sizes: {…}, stat: "ok"}, {person: {…}, stat: "ok"}]
        */
        // call getSizes parse the data
        getSizes(data[0], photoObj); //line 58
        getOwnerInfo(data[1], photoObj); //line 76
      }); // pormise.all end
    }// for loop end
    
    /* Sample result of photos object
    photos --> [{caption: "DSC_0029", photoId: "41433476165", ownerId: "9767389%40N07"},
                {caption: "DSC_0032", photoId: "41433473015", ownerId: "9767389%40N07"}, ...]
    */
  });
}

function getSizes(data, photoObj){
  let getSizesArray = data.sizes.size;
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
  } // for end
}// getSizes end

//Get photo owner icon -> flickr.people.getInfo
function getOwnerInfo(data, photoObj){
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
    flickrDisplayCb(photos); //view.js line 148
  }//if end
}// getOwnerInfo() end
