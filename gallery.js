
setTimeout(()=>{
    if(db)
{
    //retrive video
    let dbtransaction=db.transaction("video","readonly");
          let videoStore=dbtransaction.objectStore("video");
          let allvideo=videoStore.getAll();
          allvideo.onsuccess=(e)=>
          {
              let videoresult=allvideo.result;
              let gallerycont=document.querySelector(".gallery-cont");
              videoresult.forEach((videoObj) => {
                  let mediacont=document.createElement("div");
                  mediacont.setAttribute("class","media-cont");
                  mediacont.setAttribute("id",videoObj.id);

                  let ulr=URL.createObjectURL(videoObj.blobdata);
                  mediacont.innerHTML=`<div class="media">
                  <video autoplay loop src="${ulr}"></video>
              </div>
              <div class="download">Download</div>
              <div class="delete">Delete</div>`;
              gallerycont.appendChild(mediacont);
            
              let deleteBtn = mediacont.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener);
                let downloadBtn = mediacont.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener);
              });
          }
    //retriv images
    let dbtransactions=db.transaction("image","readonly");
          let imageStore=dbtransactions.objectStore("image");
          let allimage=imageStore.getAll();
          allimage.onsuccess=(e)=>
          {
              let imageresult=allimage.result;
              let gallerycont=document.querySelector(".gallery-cont");
              imageresult.forEach((imageobj) => {
                  let mediacont=document.createElement("div");
                  mediacont.setAttribute("class","media-cont");
                  mediacont.setAttribute("id",imageobj.id);

                  let ulr=imageobj.URLi;
                  mediacont.innerHTML=`<div class="media">
                  <img src="${ulr}"/>
              </div>
              <div class="download">Download</div>
              <div class="delete">Delete</div>`;
              gallerycont.appendChild(mediacont);

              let deleteBtn = mediacont.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener);
                let downloadBtn = mediacont.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener);
              });
          }
}
},100) 

// UI remove, DB remove
function deleteListener(e) {
    // DB removal
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);
    if (type === "vid") {
        let videoDBTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        videoStore.delete(id);
    }
    else if (type === "img") {
        let imageDBTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
        imageStore.delete(id);
    }

    // UI removal
    e.target.parentElement.remove();

}

function downloadListener(e) {
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);
    if (type === "vid") {
        let videoDBTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;

            let videoURL = URL.createObjectURL(videoResult.blobdata);

            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();
        }
    }
    else if (type === "img") {
        let imageDBTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let url=imageResult.URLi;
            let a = document.createElement("a");
            a.href = url;
            a.download = "image.jpg";
            a.click();
        }
    }
}
