const express = require("express");
const router = express.Router();
const { amazonGet, amazonAdd, amazonDelete, amazonProductRanking } = require("../middleware/amazon.middleware");

const authenticateUser = (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(401).json({ message: "User ID is required" });
  }
  req.userId = userId;
  next();
};

router.get("/:userId", authenticateUser,amazonGet);

router.post("/", amazonAdd);


router.delete("/:id",amazonDelete );

router.post("/ranking",amazonProductRanking );

module.exports = router;
