import { Controller } from "stimulus"
import createDemoChannel from "../channels/video_channel"
import Connection from "./video_connection"
// this.element.dataset.user
export default class extends Controller {
  static targets = [ "main", "remote" ]
  connect() {
    this.getUserMedia()
  }
  disconnect(){
    console.log("dis");
    this.mainTarget.srcObject = null
  }

  constructor(props) {
    super(props)
    this.connection = new Connection
    // if (!this.element.dataset.islivestreamer){
      this.connection.remoteStreamTarget = this.remoteTarget
    // }
    this.channel = createDemoChannel("my-room", this.connection)
  }
  getUserMedia() {
    navigator.mediaDevices.getUserMedia({
      audio: false,//{echoCancellation: false},
      video: { width: 1920, height: 720 }
    }).then((stream) => {
      this.connection.localStream = stream
     if (this.element.dataset.islivestreamer){
        this.mainTarget.srcObject = stream
      }
      this.channel.send({type: "TOKEN"})
      console.log("okkkk");
    })
  }

  joinRoom() {
    console.log("qqq");
    // if (!this.element.dataset.islivestreamer){
      this.connection.loadStream()
    // }

    this.connection.createOffer()
  }
}
