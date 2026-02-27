import e from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { isTest } from '../env.ts'
import authRoutes from './routes/authRoutes.ts'
import userRoutes from './routes/usersRoutes.ts'
import habitsRoutes from './routes/habitsRoutes.ts'

const app = e()

app.use(helmet())
app.use(cors())
app.use(e.json())
app.use(e.urlencoded({extended:true}))
app.use(morgan('dev', { skip: () => isTest() }))


app.use("/api/auth" , authRoutes)
app.use("/api/users" , userRoutes)
app.use("/api/habits" , habitsRoutes)



// server health check
app.get("/health" , (_,res)=>{
    res.json({sucess:true})
})


// catch all
app.all('/*splat' , (_,r,n)=>{
    return r.status(404).json({success:false , error:"not found"})
})


export { app }
