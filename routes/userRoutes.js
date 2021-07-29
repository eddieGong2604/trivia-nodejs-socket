const { Router } = require("express");
const userController = require("../controller/userController")
const router = Router();

router.post('/login',userController.login_post);
router.put('/points',userController.update_points);

module.exports = router;