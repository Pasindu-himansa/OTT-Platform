const { Router } = require("express");
const router = Router();

router.use("/auth", require("./auth.routes"));
router.use("/users", require("./user.routes"));
router.use("/videos", require("./video.routes"));
router.use("/channels", require("./channel.routes"));
router.use("/categories", require("./category.routes"));
router.use("/subscriptions", require("./subscription.routes"));
router.use("/payments", require("./payment.routes"));
router.use("/favorites", require("./favorites.routes"));
router.use("/watch-history", require("./watchHistory.routes"));

router.get("/", (req, res) => {
  res.json({ success: true, message: "OTT Platform API v1" });
});

module.exports = router;
