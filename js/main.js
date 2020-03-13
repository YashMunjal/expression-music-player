const video=document.getElementById('video');
function startVideo(){
  navigator.getUserMedia({video},stream=>(video.srcObject = stream),
  err=>console.log(err)
  )
}
const audio = document.getElementById('audio');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
  faceapi.nets.faceExpressionNet.loadFromUri("./models"),
  faceapi.nets.ageGenderNet.loadFromUri("./models")
]).then(startVideo);

video.addEventListener("playing",()=>
{
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = {width:video.width,height:video.height};
  faceapi.matchDimensions(canvas,displaySize)


//audios
const happy_audios = ['./audios/happy_audio/2.mp3','/audios/happy_audio/1.mp3'];
const sad_sounds = ['./audios/sad_sounds/1.mp3'];
const angry_audios = ['./audios/angry_audio/1.mp3']; 

var flag_happy=0;
var flag_sad=1000;
var flag_angry=5000;
var flag_surprised=10000;
  //face-setInterval
setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions()
      .withAgeAndGender();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    //expression logic
    const happy  =resizedDetections[0].expressions.happy;
    const sad  =resizedDetections[0].expressions.sad;
    const surprised  =resizedDetections[0].expressions.surprised;
    const disgusted  =resizedDetections[0].expressions.disgusted;
    const angry  =resizedDetections[0].expressions.angry;
    const neutral  =resizedDetections[0].expressions.neutral;
    //The Issue
    if(happy>0.9)
    {
      flag_happy++;
      playAudio(happy_audios[Math.floor(Math.random()*happy_audios.length)],flag_happy);
    }
    
    else if(angry>0.75)
    {
      flag_angry++;
      playAudio(angry_audios[Math.floor(Math.random()*angry_audios.length)],flag_angry);
    }
    else if(neutral>0.6 || detections.length==0)
    {
      playAudio("",0);
    }
    else if(sad>0.8)
    {
      flag_sad++;
      playAudio(sad_sounds[Math.floor(Math.random()*sad_sounds.length)],flag_sad)
    }
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  },200)
  function playAudio(emit,f)
  {
    if(f==1)
    {
      //happy
    audio.src=emit;
    flag_sad=1000;
    flag_angry=5000;
    audio.play();
    }
    else if(f==1001)
    {
      //sad
      audio.src=emit;
      flag_happy=0;
      flag_angry=5000;
      audio.play();
    }
    else if(f==5001)
    {
      //angry
      audio.src=emit;
      flag_happy=0;
      flag_sad=1000;
      audio.play();
    }
    else if(f==0)
    {
      audio.src="";
      flag_happy=0;
      flag_sad=1000;
      flag_angry=5000;
    }
  }
})

