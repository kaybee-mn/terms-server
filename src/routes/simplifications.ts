import express from "express";
import verifyJWT from "../middleware/verifyJWT";
import { supabaseAdmin } from "../config/supabaseAdmin";
import { error } from "console";

const router = express.Router();

router.post(
  "/",
  verifyJWT,
  async (req: express.Request, res: express.Response) => {
    const user_id = req.user?.id;
    const { title, content } = req.body;
    try {
      // check if the title already exists in this user
      const { data, error: selectionError } = await supabaseAdmin
        .from("Documents")
        .select("id")
        .eq("user_id", user_id)
        .eq("title", title);

      if (selectionError) {
        res.status(401).json({ error: "selection error" }).end();
      }
      let title_id;

      if (data && data.length > 0) {
        title_id = data[0].id;
      } else {
        // if the title doesn't already exist for this user, insert a new title
        const { data: newDoc, error: insertError } = await supabaseAdmin
          .from("Documents")
          .insert({ title: title, user_id: user_id }).select("id");
        if (insertError) {
          res.status(401).json({ error: "insertion error" }).end();
        }
        title_id = newDoc ? newDoc[0].id : null;
      }

      await supabaseAdmin
        .from("Simplifications")
        .insert([{ title_id, content }]);
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
    if (!user_id) {
      res.status(401).json({ error: "Unauthorized" }).end();
    }
    try {
      const result = await supabaseAdmin
        .from("Documents")
        .select("title")
        .eq("user_id", user_id);
      res.json(result);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while retrieving title list." });
    }
  }
);

router.get(
  "/titles/:title_id",
  verifyJWT,
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await supabaseAdmin
        .from("Simplifications")
        .select()
        .eq("title_id", req.params.title_id);
      res.json(result);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while retrieving title list." });
    }
  }
);

export default router;
