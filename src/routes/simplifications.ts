import express from "express";
import verifyJWT from "../middleware/verifyJWT";
import { supabaseAdmin } from "../config/supabaseAdmin";

const router = express.Router();

router.post(
  "/",
  verifyJWT,
  async (req:express.Request, res:express.Response)=>{
    const {user_id,title,content}=req.body;
    try{
      await supabaseAdmin.from('Simplifications').insert([{user_id, title, content}]);
    } catch (error) {
      console.error("Save error:", error);
      res
        .status(500)
        .json({ error: "An error occurred while saving the text." });
    }
    res.json({success:true})
  }
)

export default router;