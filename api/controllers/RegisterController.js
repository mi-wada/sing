/**
 * RegisterSingerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    register: async function(req, res) {
        const password = module.exports.createRandomPassword();
        await Users.create({name: req.body.name, password: password, twitterID: req.body.twitterID, instagramID: req.body.instagramID});
        return res.ok();
    },
    createRandomPassword: function() {
        const passwordLen = 15;
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const charsLen = chars.length;
        let password = "";
        for(let i = 0; i < passwordLen; ++i) {
            password += chars[Math.floor(Math.random() * charsLen)];
        }
        return password;
    },
};
