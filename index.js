import express from 'express'
// import axios from 'axios'
import bodyParser from 'body-parser'
import pg from 'pg'
const db= new pg.Client({
    user:"postgres",
    password:"kiran@637",
    host:"localhost",
    port:5432,
    database:"TODO"
})
db.connect()
async function getData() {
    const result=await db.query("select * from todos")
    return result.rows
}
async function getDays(){
    const days=[]
    const today=new Date()
    const day=today.getDay()
    const monday=new Date(today)
    monday.setDate(today.getDate()-((day+6)%7))
    for(var i=0;i<7;i++){
        const current = new Date(monday);              
        current.setDate(monday.getDate() + i);
        days.push(String(current.getDate()).padStart(2,'0'))
    }
    return days
}
const PORT=3000;
const app=express()
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',async(req,res)=>{
    const result=await getData()
    console.log(result)
   const days=await getDays()
    const weeks=["mon","tue","wed","thu","fri","sat","sun"]
    const today=new Date().getDate()
    console.log(today)
    res.render('index.ejs',{tasks:result,weeks,days,today})
})
app.get('/new',(req,res)=>{
    res.render('new.ejs');
})
app.post('/update-status/:id', async (req, res) => {
  const id = req.params.id;
  const status = req.body.status === 'on'; // 'on' if checked

  try {
    await db.query("UPDATE todos SET status = $1 WHERE id = $2", [status, id]);
  } catch (err) {
    console.error("Error updating status:", err);
  }

  res.redirect('/');
});
app.post('/add',async(req,res)=>{
    const title=req.body.title
    const description=req.body.description
    const status=false
    try{
        await db.query("insert into todos (title,description,status) values ($1,$2,$3)",[title,description,status])
    }catch(err){
        console.log("somthing wrong",err)
    }
    res.redirect("/")
})
app.get("/delete/:id",async(req,res)=>{
    const id =req.params.id;
   const delete1 = await db.query("Delete FROM todos where id =($1) returning *;",[id]) 
   console.log("deletd task:",delete1.rows[0]);
    res.redirect("/")
})
app.get('/edit2/:id',async (req,res)=>{
    const id=req.params.id
try{
    const result=await db.query("select * from todos where id=($1)",[id])
res.render('edit.ejs',{task:result.rows[0]})
}catch(err){
       console.log("Something went wrong", err);
}

})
app.post("/edit/:id",async(req,res)=>{
    
    const id=req.params.id
     const result=await db.query("select * from todos where id=($1)",[id])
     const existing=result.rows[0]
    const title=req.body.title || existing.title
    const description=req.body.description||existing.description
    const status=req.body.status || existing.status
try {
    await db.query(
      "UPDATE todos SET title = $1, description = $2, status = $3 WHERE id = $4",
      [title, description, status, id]
    );
  } catch (err) {
    console.log("Something went wrong", err);
  }

    res.redirect("/")
})
app.listen(PORT,()=>{
    console.log(`surver is running on port ${PORT}`)
})