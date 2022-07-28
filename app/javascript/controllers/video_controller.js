import { Controller } from "stimulus"
import { createConsumer } from "@rails/actioncable";
import Connection from "./video_connection"

export default class extends Controller {
  static targets = [ "main", "remote" ]
  connections = []
  localStream

  initialize() {
    let thisController = this;
    this.channel = createConsumer().subscriptions.create({channel: "VideoChannel",name: `room-${this.element.dataset.room_id}`}, {
      connected() {
        if( thisController.element.dataset.islivestreamer == "false"){
          thisController.newConnction( thisController.element.dataset.user )
          this.send( { type: "CONNECT",id: thisController.element.dataset.user } )
        }
      },

      disconnected() {
        console.log( "disconnected" )
      },

      received(data) {
        switch ( data.type ) {
          case "CONNECT":
            if( thisController.element.dataset.user ==  thisController.element.dataset.ownerid ){
              thisController.connections[data.id] =  thisController.newConnction( thisController.element.dataset.user )
              thisController.connections[data.id].localStream = thisController.mainTarget.srcObject
            }else{
              this.send( { type: "TOKEN",id: thisController.element.dataset.user } )
            }
            if( thisController.connections[data.id] ){
              thisController.connections[data.id].channel = this
            }
          break
          case "TOKEN":
            if( !thisController.connections[data.id]?.connected ){
              thisController.connections[data.id]?.createPeerConnection( data.servers )
            }
            if( thisController.element.dataset.user !=  thisController.element.dataset.ownerid ){
              thisController.joinRoom()
            }
            break;
          case "OFFER":
            if( thisController.element.dataset.user ==  thisController.element.dataset.ownerid ){
              let offer = JSON.parse(data.sdp)
              thisController.connections[data.name].createAnswer(offer,data.name)
            }
            break;
          case "ANSWER":
            if( thisController.element.dataset.user  == data.name ) {
              let answer = JSON.parse(data.sdp)
              thisController.connections[data.name].receiveAnswer(answer)
            }
            break;
          case "CANDIDATE":
            let id = thisController.element.dataset.user
            let iceconnectionSuccessState = ["checking","connected","completed"]
            if (data.name == "server"){
              if ( !iceconnectionSuccessState.includes( thisController.connections[id].peerConnection.iceConnectionState ) ) {
                let candidate = JSON.parse( data.sdp )
                thisController.connections[id].addCandidate( candidate )
              }
            }else{
              if ( thisController.connections[id].identifier == data.name ) {
                let candidate = JSON.parse( data.sdp )
                thisController.connections[id].addCandidate( candidate )
              }
            }
            break;
          default:
            console.log( `Unknown data type: ${data.type}` )
            break;
        }
      }
    });
  }

  disconnect(){
    this.mainTarget.srcObject = null
  }

  constructor( props ) {
    super( props )
    this.getUserMedia()
  }
  newConnction(id){
    this.connections[id] = new Connection()
    this.connections[id].islivestreamer = this.element.dataset.islivestreamer
    this.connections[id].roomOwnerId = this.element.dataset.ownerid
    this.connections[id].identifier = this.element.dataset.user
    if ( this.element.dataset.islivestreamer == "false" ){
      this.connections[id].remoteStreamTarget = this.remoteTarget
    }
    return this.connections[id]
  }
  getUserMedia() {
    if ( this.element.dataset.islivestreamer == "true" ){
      navigator.mediaDevices.getUserMedia({
        audio: false,//{echoCancellation: false},
        video: { width: 1920, height: 720 }
      }).then(( stream ) => {
        this.mainTarget.srcObject = stream
      })
    }
  }

  joinRoom() {
    let id = this.element.dataset.user
    if( this.element.dataset.islivestreamer == "true" ){
      this.connections[id].loadStream( "main" )
    }else{
      this.connections[id].loadStream( "remote" )
    }
    this.connections[id].createOffer()
  }
}
