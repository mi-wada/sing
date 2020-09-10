new Vue({
    el: '#registerSinger',
    data: {
        name: '',
        twitterID: '',
        instagramID: ''
    },
    methods: {
        registerUserInfo: function() {
            io.socket.post('/registerUserInfo', {name: this.name, twitterID: this.twitterID, instagramID: this.instagramID});
        }
    }
})
