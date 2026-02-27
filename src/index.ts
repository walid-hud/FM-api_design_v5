import env from "../env.ts"
import { app } from "./server.ts"


app.listen(env.PORT , ()=>{
    console.info(`server running on http://localhost:${env.PORT}`)
})