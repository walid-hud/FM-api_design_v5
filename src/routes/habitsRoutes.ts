import { Router } from "express"
import z from "zod"
import { validateBody, validateParams } from "../middleware/validation.ts"
const router = Router()

const createHabitSchema = z.object({
    name:z.string().nonempty()
})
const completeParamsSchema = z.object(
    {id:z.string().nonempty().length(8 , {error:"invalid id"})}
)



router.post("/" , validateBody(createHabitSchema) ,(req,res,next)=>{
    return res.json({success:true, name:req.body.name})
})




router.post("/:id/complete" , validateParams(completeParamsSchema) , (req,res,next)=>{
    return res.json({success:true , id:req.params.id})
})






export default router


