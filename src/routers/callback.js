import express from "express";

const router = express.Router();

router.route("/").get(async (req, res) => {
  res.send('Authorization successful!');
});

export default router;
