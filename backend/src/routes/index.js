const { Router } = require("express");
const router = Router();

router.use("/auth", require("./auth.routes"));
router.use("/users", require("./user.routes"));
router.use("/videos", require("./video.routes"));
router.use("/channels", require("./channel.routes"));
router.use("/categories", require("./category.routes"));
router.use("/subscriptions", require("./subscription.routes"));
router.use("/payments", require("./payment.routes"));
// router.use('/search',        require('./search.routes'));
// router.use('/admin',         require('./admin.routes'));

router.get("/", (req, res) => {
  res.json({ success: true, message: "OTT Platform API v1", phase: 2 });
});

module.exports = router;
