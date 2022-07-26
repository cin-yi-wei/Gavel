import consumer from "./consumer"

const createDemoChannel = function(name, connection) {
  return consumer.subscriptions.create({channel: "VideoChannel", name}, {
    connected() {
      connection.channel = this
      console.log("Channel connected")
      console.log("<<< Sending TOKEN message to server")
      this.send({ type: "TOKEN" })
    },

    disconnected() {
      console.log("disconnected")
    },

    received(data) {
      switch (data.type) {
        case "TOKEN":
          if (!connection.peerConnection) {
            console.log("get ice servers");
            connection.createPeerConnection(data.servers)
          }
          break;
        case "OFFER":
          if (connection.identifier == connection.roomOwnerId ) {
            let offer = JSON.parse(data.sdp)
            connection.createAnswer(offer,data.name)
          }
          break;
        case "ANSWER":
          console.log("debuggerrrdebuggerrrdebuggerrr");
          console.log(connection.identifier,data.name);
          if (connection.identifier == data.name) {
            let answer = JSON.parse(data.sdp)
            connection.receiveAnswer(answer)
          }
          break;
        case "CANDIDATE":
          console.log("收到 ice_candidate");
          console.log(connection.peerConnection.iceConnectionState);
          let iceConnectionSuccessState = ["checking","connected","completed"]
          if (data.name == "server"){
            if ( !iceConnectionSuccessState.includes(connection.peerConnection.iceConnectionState) ) {
              let candidate = JSON.parse(data.sdp)
              connection.addCandidate(candidate)
            }
          }else{
            if (connection.identifier == data.name) {
              let candidate = JSON.parse(data.sdp)
              connection.addCandidate(candidate)
            }
          }
          break;
        default:
          console.log(`Unknown data type: ${data.type}`)
          break;
      }
    }
  });
}

export default createDemoChannel;
