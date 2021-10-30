let video=document.querySelector("video");
let recordBtn=document.querySelector(".record");
let captureBtn=document.querySelector(".capture");
let timercont=document.querySelector(".timer-cont");
let filterColor="transparent";
let normal="#ffffff00";
let blue="#0000ff54";
let red="#ff000054";
let black="#00000082";

constraints={
    video:true,
    audio:true
}
let chunk=[];
let recorder;
let recordflag=false;
let captureflag=false;
navigator.mediaDevices.getUserMedia(constraints)
.then(function(stream) {

    //here stream is nothing but every hing hat capture by your media deice video ,audio
    recorder=new MediaRecorder(stream);
//MediaRecorder is use to record our stream .
    video.srcObject=stream;
    recorder.addEventListener("start",function(e){
        chunk=[];
    })
  recorder.ondataavailable = function(e) {
    chunk.push(e.data);
    console.log(chunk);
  }
  recorder.addEventListener("stop",function(e){
      //convert chunk into blob beacue we want URl to download that video and we have function URL.createobjectURL(blob)
      
      let blob= new Blob(chunk,{type:"video/mp4"});
      console.log(blob);
      videoURL=URL.createObjectURL(blob);
      if(db)
      {
          let vid=shortid();
          let dbtransaction=db.transaction("video","readwrite");
          let videoStore=dbtransaction.objectStore("video");
          let videoentry={
              id:`vid-${vid}`,
              blobdata:blob
          }
          videoStore.add(videoentry);
      }
    //   let a=document.createElement("a");
    //   a.href=videoURL;
    //   a.download="stream";
    //   a.click();
  })
})
captureBtn.addEventListener("click",function(e){

captureBtn.classList.add("scale-capture");
let canvas=document.createElement("canvas");
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
let cxt=canvas.getContext("2d");
cxt.drawImage(video,0,0,canvas.width,canvas.height);
cxt.fillStyle = filterColor;
cxt.fillRect(0, 0, canvas.width, canvas.height);
let imageURl=canvas.toDataURL();
if(db)
{
    let Imid=shortid();
    let dbtransaction=db.transaction("image","readwrite");
    let ImageStore=dbtransaction.objectStore("image");
    let imageentry={
        id:`img-${Imid}`,
        URLi:imageURl
    }
    ImageStore.add(imageentry);
    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    }, 500)
}
// let atag=document.createElement("a");
// atag.setAttribute("download","photo.jpg");
// atag.setAttribute("href",imageURl);
// atag.click();
})
recordBtn.addEventListener("click",function(e){
    if(!recorder)
    {
        return;
    }
    recordflag=!recordflag;
    if(recordflag)
    {
        recorder.start();
        recordBtn.classList.add("scale-record");
        timercont.classList.add("active");
        startTimer();
    }
    else{
        recorder.stop();
        recordBtn.classList.remove("scale-record");
        timercont.classList.remove("active");
        stopTimer();
    }
})
let timer=document.querySelector(".timer");
let timerID;
let cont=0;
function startTimer()
{
    function display()
    {
        let tsec=cont;
        let hr=Number.parseInt(tsec/3600);
        tsec=tsec%3600;
        let min=Number.parseInt(tsec/60);
        tsec=tsec%60;

        let sec=tsec;
        hr=hr<10?`0${hr}`:hr;
        min=min<10?`0${min}`:min;
        sec=sec<10?`0${sec}`:sec;
        timer.innerText=`${hr}:${min}:${sec}`;
        cont++;
    }
    timerID=setInterval(display,1000);
}
function stopTimer()
{
    clearInterval(timerID);
    timer.innerText="00:00:00";
    cont=0;
}
let filtercont=document.querySelectorAll(".filter");
let filterlayer=document.querySelector(".filter-color");
for(let i=0;i<filtercont.length;i++)
{
    filtercont[i].addEventListener("click",function(){
       if(filtercont[i].classList.contains("normal"))
       {
        filterColor=normal;
       }
       else if(filtercont[i].classList.contains("blue")){
        filterColor=blue;
       }
       else if(filtercont[i].classList.contains("red")){
        filterColor=red;
       }
       else{
        filterColor=black;
       }
        filterlayer.style.backgroundColor=filterColor;
    })
}
