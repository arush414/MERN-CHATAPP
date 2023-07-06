const express= require('express');
const {registerUser, authUser,allUsers}= require("../controllers/userControllers");
const router= express.Router();
const {protect}= require("../middleware/authmiddleware");

// app.use('/api/user',userRoutes);

router.route("/").post(registerUser)
router.route("/").get(protect, allUsers);
router.post('/login',authUser);

module.exports=router;
