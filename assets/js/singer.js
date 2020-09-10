new Vue({
    el: '#singer',
    data: {
        socketID: null,
        socketIDfrom: null,
        localStream: null,
        peerConnection: null,
        peerConnections: [],
        cheerCount: 0
    },
    created: function(){
        var _this = this;
        io.socket.get('/joinRoom', function(resData) {
            _this.socketID = resData;
        });

        io.socket.on('call me', function(event) {
            console.log('received call me');
            _this.socketIDfrom = event.id;
            _this.makeOffer(event.id);
        });

        io.socket.on('answer SDP', function(event) {
            console.log(event.id);
            if(_this.socketID === event.id) {
                console.log(_this.peerConnections[event.fromId]);
                _this.setRemoteSDP(_this.peerConnections[event.fromId], event.SDP);
                console.log('answerSDP');
            }
            //let answerSDP = new RTCSessionDescription(event.answerSDP);
            //call meを送ってきたやつに対してoffer SDP
        });
        io.socket.on('set SDP', function(event) {
            if(_this.socketID === event.id) {
                _this.setRemoteSDP(_this.peerConnections[event.fromId], event.SDP);
                console.log('--setSDP--');
                console.log(_this.peerConnections[event.fromId].remoteDescription.sdp);
            }
        });
        io.socket.on('cheer', function(event) {
            console.log('cheer');
            ++_this.cheerCount;
        });
    },
    methods: {
        sendCall: function() {
            var _this = this;
            io.socket.get('/broadcastMessage', {eventName: 'call me', id: _this.socketID, fromId: '', SDP: null});
        },
        prepareNewConnection: function(id) {
            var _this = this;
            pc_config = { "iceServers": [] };
            let peer = new RTCPeerConnection(pc_config);
            peer.onicecandidate = function(event) {
                console.log('onicecandidate');
                if(event.candidate) {
                    console.log(event.candidate);
                }else {
                    console.log(event);
                    io.socket.get('/broadcastMessage', { eventName: 'set SDP', id: _this.socketIDfrom, fromId: _this.socketID, SDP: peer.localDescription });
                }
            };
            (_this.localStream).getTracks().forEach(track => peer.addTrack(track, _this.localStream));
            return peer;
        },
        makeOffer: function(id) {//相手のid
            var _this = this;
            //peerConnectionを作成し，それをpeerConnectionsに保存
            this.peerConnection = this.prepareNewConnection(id);
            this.peerConnections[id] = this.peerConnection;
            (_this.peerConnection).createOffer()
            .then(function (sessionDescription) {
                io.socket.get('/broadcastMessage', { eventName: 'offer SDP', id: id, fromId: _this.socketID, SDP: sessionDescription });
                return _this.setLocalSDP(_this.peerConnection, sessionDescription);
            });
        },
        setLocalSDP: async function(peer, sessionDescription) {
            await peer.setLocalDescription(sessionDescription)
            .then(function() {
                console.log('setted localDescription');
            });
        },
        setRemoteSDP: async function(peer, sessionDescription) {
            await peer.setRemoteDescription(sessionDescription)
            .then(function() {
                console.log('setted remoteDescription');
            });
        },
        startVideo: function() {
            var _this = this;
            let localVideo = document.getElementById('local_audio');
            // start local video
            navigator.mediaDevices.getUserMedia({audio: false, video: true})
            .then(function (stream) { // success
                _this.localStream = stream;
                localVideo.srcObject = stream;
            })
            .catch(function (error) { // error
              console.error(error);
              return;
            });
        }
    }
})
