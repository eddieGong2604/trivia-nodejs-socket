const User = require("../models/User");

module.exports.login_post = async (req, res) => {
    const {username} = req.body;
    await User.findOne({username},null,null,async (err, user) => {
        if (!user) {
            const user = await User.create({username});
            res.status(201).json(user);
        }
        else{
            res.status(200).json(user);
        }
    });

}

module.exports.update_points = async (req, res) => {
    const {username, point} = req.body;
    try {
        User.findOneAndUpdate({username: username}, {$inc: {'points': point}}, {useFindAndModify: false}, (err, user) => {
            res.status(200).json({user});
        });
    } catch (err) {

    }
}
