import { nanoid } from 'nanoid'

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
    console.log("servers",servers);
    this.peerConnection = new RTCPeerConnection({
      iceServers: servers
    });
    console.log("this.peerConnection",this.peerConnection);
    this.peerConnection.ontrack = ({track, streams}) => {
      this.remoteStreamTarget.srcObject = streams[0]
      console.log("<<< Received new track")
    }
    this.peerConnection.onicecandidate = ({candidate}) => {
      console.log("ice candidate debugerrr");
      console.log(candidate);
      if (candidate) {

        console.log(`<<< Received local ICE candidate from STUN/TURN server (${candidate.address})`)
        if (this.connected) {
          console.log(`>>> Sending local ICE candidate (${candidate.address})`)
          this.channel.send({
            type: "CANDIDATE",
            // name: this.identifier,
            name:  this.islivestreamer == "true" ? "server" : this.roomOwnerId,
            // sender: ,
            // receiver: ,
            sdp: JSON.stringify(candidate)
          })
        } else {
          console.log(`>>> Buffer local candidate (${candidate.address})`)
          this.localICECandidates.push(candidate)
        }
      }
    }
    // this.peerConnection.oniceconnectionstatechange = (e) => {
    //   console.log("client ice change",this.islivestreamer);
    //   if (e.target.iceConnectionState === 'disconnected') {
    //     if(this.islivestreamer == "true"){
    //       this.connectionReset()
    //       // this.remoteStreamTarget.srcObject  = null
    //       console.log("closestreamer");
    //     }
    //   }
    // }

    // this.peerConnection.onaddstream = ({ stream }) => {
    //   // 接收流並顯示遠端視訊
    //   console.log("video2video2video2video2video2video2video2video2video2video2video2");
    //   this.remoteStreamTarget.srcObject = stream[0]
    // }
  }

  loadStream(mode) {
    // console.log("getTracksgetTracksgetTracksgetTracks",getTracks);
    switch(mode){
      case "main":
        for (const track of this.localStream.getTracks()) {
          console.log("track",track);
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
        console.log(">>> Sending offer to receivers")
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

/*
    try {
      // 創建SDP信令
      const localSDP = await this.peerConnection.createOffer()
      // 設定本地SDP信令
      await this.peerConnection.setLocalDescription(localSDP)
      that.channel.send({
        type: "OFFER",
        name: that.identifier,
        sdp: JSON.stringify(this.peerConnection.localDescription)
      })
    } catch (err) {
      throw err
    }
    */
  }

  createAnswer(offer,repliedUser) {
    console.log("<<< Answering to caller")
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
    console.log(">>> Receive remote answer")
    let rtcAnswer = new RTCSessionDescription(answer);
    let that = this
    this.peerConnection.setRemoteDescription(rtcAnswer)
    console.log("!!!RemoteDescription",this.peerConnection);
    this.connected = true
    console.log("123");
    console.log(this.localICECandidates);
    // this.localICECandidates.forEach(candidate => {
    //   console.log(`>>> Sending local ICE candidate (${candidate.address})`)
    //   this.channel.send({
    //     type: "CANDIDATE",
    //     name: this.identifier,
    //     sdp: JSON.stringify(candidate)
    //   })
    // })
    console.log("456");
    this.localICECandidates = []
  }

  addCandidate(candidate) {
    let rtcCandidate = new RTCIceCandidate(candidate);
    console.log(`<<< Adding ICE candidate (${rtcCandidate.address} - ${rtcCandidate.relatedAddress})`)
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
