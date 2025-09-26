import express from 'express'
// import axios from 'axios'
import bodyParser from 'body-parser'

const PORT=3000;
const app=express()
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',(req,res)=>{
res.render('index.ejs')
})
app.listen(PORT,()=>{
    console.log(`surver is running on port ${PORT}`)
})