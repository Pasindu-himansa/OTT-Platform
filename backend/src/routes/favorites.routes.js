const { Router } = require("express");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} = require("../controllers/favorites.controller");
const { protect } = require("../middleware/auth");

const router = Router();

router.get("/", protect, getFavorites);
router.post("/", protect, addFavorite);
router.get("/check/:videoId", protect, checkFavorite);
router.delete("/:videoId", protect, removeFavorite);

module.exports = router;
