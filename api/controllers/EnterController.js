/**
 * enterController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    enter: function(req, res) {
        /*
        Users.find().exec(function (err, records) {
            console.log('connect');
            console.log(records);
            res.send(req.body);
        })
        */
        console.log('peni');
        if(true) return res.redirect("/singer");
        else return res.redirect("/");
        //const password = module.exports.createRandomPassword();
        //await Users.create({name: req.body.name, password: password, twitterID: req.body.twitterID, instagramID: req.body.instagramID});
    },
};
