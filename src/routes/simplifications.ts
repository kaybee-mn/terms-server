import express from "express";
import verifyJWT from "../middleware/verifyJWT";
import { supabaseAdmin } from "../config/supabaseAdmin";

const router = express.Router();

router.post(
  "/",
  verifyJWT,
  async (req: express.Request, res: express.Response) => {
    const user_id = req.user?.id;
    const { title, content } = req.body;
    try {
      await supabaseAdmin
        .from("Simplifications")
        .insert([{ user_id, title, content }]);
    } catch (error) {
      console.error("Save error:", error);
      res
        .status(500)
        .json({ error: "An error occurred while saving the text." });
    }
    res.json({ success: true });
  }
);

router.get(
  "/titles",
  verifyJWT,
  async (req: express.Request, res: express.Response) => {
    const user_id = req.user?.id;
    console.log(user_id)
    if (!user_id) {
      res.status(401).json({ error: "Unauthorized" }).end();
    }
    try {
      const result = await supabaseAdmin
        .from("Documents")
        .select("title")
        .eq("user_id", user_id);
      console.log(result);
      res.json({ titles: result });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while retrieving title list." });
    }
  }
);

export default router;
