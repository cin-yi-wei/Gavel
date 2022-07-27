class Connection {
  peerConnection
  localStream
  remoteStreamTarget
  channel
  islivestreamer
  trackArray
  roomOwnerId
  constructor() {
    this.identifier = null//nanoid()
    this.localICECandidates = []
    this.connected = false
    this.islivestreamer = ""
    this.trackArray = []
    // this.roomOwnerId = ""
  }

  createPeerConnection(servers) {
    this.peerConnection = new RTCPeerConnection({
      iceServers: servers
    });
    this.peerConnection.ontrack = ({track, streams}) => {
      this.remoteStreamTarget.srcObject = streams[0]
    }
    this.peerConnection.onicecandidate = ({candidate}) => {
      if (candidate) {
        if (this.connected) {
          this.channel.send({
            type: "CANDIDATE",
            name:  this.islivestreamer == "true" ? "server" : this.roomOwnerId,
            sdp: JSON.stringify(candidate)
          })
        } else {
          this.localICECandidates.push(candidate)
        }
      }
    }
  }

  loadStream(mode) {
    switch(mode){
      case "main":
        for (const track of this.localStream.getTracks()) {
          try {
            this.trackArray.push(this.peerConnection.addTrack(track, this.localStream))
          } catch (error) {
          }
        }
        break;
      case "remote":
        this.peerConnection.addTransceiver('video', { direction: 'recvonly' })
        break;
    }
  }

  createOffer() {
    let that = this;
    this.peerConnection.createOffer(
      function(offer) {
        that.peerConnection.setLocalDescription(offer)
        that.channel.send({
          type: "OFFER",
          name: that.identifier,
          sdp: JSON.stringify(offer)
        })
      },
      function(err) {
        console.log(err)
      }
    )
  }

  createAnswer(offer,repliedUser) {
    this.connected = true
    let rtcOffer = new RTCSessionDescription(offer);
    let that = this
    this.peerConnection.setRemoteDescription(rtcOffer);
    this.loadStream("main")
    this.peerConnection.createAnswer(
      function(answer) {
        that.peerConnection.setLocalDescription(answer)
        that.channel.send({
          type: "ANSWER",
          name: repliedUser,
          sdp: JSON.stringify(answer)
        })
      },
      function(err) {
        console.log(err)
      }
    )
  }

  receiveAnswer(answer) {
    let rtcAnswer = new RTCSessionDescription(answer);
    let that = this
    this.peerConnection.setRemoteDescription(rtcAnswer)
    this.connected = true
    this.localICECandidates = []
  }

  addCandidate(candidate) {
    let rtcCandidate = new RTCIceCandidate(candidate);
    this.peerConnection.addIceCandidate(rtcCandidate)
  }
  connectionReset(){
    this.trackArray.forEach((track)=>{
      this.peerConnection.removeTrack(track)
    })
    this.connected = false
  }
}

export default Connection;
