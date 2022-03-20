/*
const socket = io();
const myPeer = new Peer();
const videoGrid = document.getElementById('video-grid');
const newVideo = document.createElement('video');

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
})
.then(stream => {
  addVideoStream(newVideo,stream);

  myPeer.on("call", (call)=>{
    call.answer(stream);
    call.on("stream", userVideoStream => {
      const newVideo = document.createElement('video');
      addVideoStream(newVideo,userVideoStream);
    })
  })

  socket.on('user_connected', userId => {
    connectToNewUser(userId, stream)
  })
})
.catch(e => {
  console.log(e);
})

myPeer.on('open',(id) => {
  socket.emit('join-room', ROOM_ID, id);
})

function addVideoStream(newVideo,stream){
  newVideo.srcObject = stream;
  newVideo.addEventListener("loadedmetadata", function(){
    newVideo.play()
  });

  videoGrid.append(newVideo);
}

function connectToNewUser(userId,stream){
  const call = myPeer.call(userId, stream);
  //WHEN THEY SEND ME BACK THEIR STREAM
  const newVideo = document.createElement('video');
  call.on("stream", userVideoStream => {
    addVideoStream(newVideo,userVideoStream);
  })
  call.on("close", ()=>{
    newVideo.close();
  })
}
*/

const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer();
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: false
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
}).catch(e => {
  console.log(e);
})

socket.on('user-disconnected', userId => {
  if (peers[userId]){
    peers[userId].close();
    console.log("closed");
  }
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  let videoHTML = `
  <video width="300" height="300" muted autoplay>
  </video>
  `
  video.innerHTML = videoHTML;
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}
