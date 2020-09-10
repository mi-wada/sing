new Vue({
    el: '#listener',
    data: {
        socketID: null,
        socketIDfrom: null,
        peerConnection: null
    },
    created: function(){
        var _this = this;
        io.socket.get('/joinRoom', function(resData) {
            _this.socketID = resData;
        });

        io.socket.on('offer SDP', function(event) {
            if(_this.socketID === event.id) {
                _this.socketIDfrom = event.fromId;
                //let offerSDP = new RTCSessionDescription(event.offerSDP);
                _this.makeAnswer(event.fromId, event.SDP);
                console.log(event.SDP);
                console.log('offerSDP');
            }
            //offer SDPを保存
            //offer SDPを送ってきたやつに対して，send SDP
        });

        io.socket.on('set SDP', function(event) {
            if(_this.socketID === event.id) {
                _this.setRemoteSDP(_this.peerConnection, event.SDP);
                console.log('--setSDP--');
                console.log(_this.peerConnection.remoteDescription.sdp);
            }
        })
    },
    methods: {
        sendCall: function() {
            console.log('sendCall');
            var _this = this;
            io.socket.get('/broadcastMessage', {eventName: 'call me', id: _this.socketID, fromId: '', SDP: null});
        },
        prepareNewConnection: function(id) {
            var _this = this;
            pc_config = { "iceServers": [] };
            let peer = new RTCPeerConnection(pc_config);
            peer.ontrack = function(event) {
                console.log('ontrack');
                let stream = event.streams[0];
                _this.attachRemoteVideo(id, stream);
            };
            peer.onicecandidate = function(event) {
                console.log('onicecandidate');
                if(event.candidate) {
                    console.log(event.candidate);
                }else {
                    console.log(event);
                    io.socket.get('/broadcastMessage', { eventName: 'set SDP', id: _this.socketIDfrom, fromId: _this.socketID, SDP: peer.localDescription });
                }
            };
            return peer;
        },
        makeAnswer: function(id, offerSDP) {
            var _this = this;
            this.peerConnection = this.prepareNewConnection(id);
            this.setRemoteSDP(_this.peerConnection, offerSDP);
            (this.peerConnection).createAnswer()
            .then(function (sessionDescription) {
                io.socket.get('/broadcastMessage', { eventName: 'answer SDP', id: id, fromId: _this.socketID, SDP: sessionDescription });
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
        attachRemoteVideo: function(id, stream) {
            let remoteVideo = document.getElementById('remote_audio');
            remoteVideo.srcObject = stream;
        },
        cheer: function() {
            var _this = this;
            io.socket.get('/broadcastMessage', {eventName: 'cheer', id: _this.socketIDfrom, fromId: '', SDP: null});
        }
    }
})
