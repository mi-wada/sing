/**
 * SingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    joinRoom: function(req, res) {
        if(!req.isSocket) {
            return res.badRequest();
        }
        sails.sockets.join(req, 'greetRoom');
        return res.ok();
    },
    broadcastMessage: function(req, res) {
        sails.sockets.broadcast('greetRoom', req.body.eventName, { id: req.body.id, fromId: req.body.fromId, SDP: req.body.SDP }, req);
        return res.ok();
    },

};
