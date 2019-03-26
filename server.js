const path = require('path')
const cors = require('cors');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const {readDB, findById, idFactory, writeDB, updateById, deleteById} = require('./helper')

app.use(cors());
// middlewares
app.use(express.static(path.join(__dirname, 'public')))

// parse form
app.use(bodyParser.urlencoded({extended: false}))
// parse json
app.use(bodyParser.json())
// routers
app.get('/', function (req, res, next) {
  res.status(200).render('index.html')
})

// LIST
app.get('/api/v1/todos', (req, res, next) => {
  // read the json
  readDB('./DB/todo.json').then(data => {
    if (typeof data === 'string') {
      res.set('Content-Type', 'application/json')
      res.json(JSON.parse(data))
    }
  }).catch(err => {throw err})
})

// CREATE
app.post('/api/v1/todos', (req, res, next) => {
  readDB('./DB/todo.json').then(data => {
    let todos = JSON.parse(data).todos
    console.log('new Id: ', idFactory(todos))
    let newo = {
      id: idFactory(todos),
      name: req.body.name,
      status: false,
    }
    writeDB('./DB/todo.json', newo).then(() => {
      res.status(200).json({status: 200, message: 'create thanh cong', data: newo})
    }).catch(err => {
      res.status(404).json({status: 404, message: 'create that bai'});
    })
  })
})

// DETAIL
app.get('/api/v1/todos/:id', (req, res, next) => {
  readDB('./DB/todo.json').then(data => {
    let todos = JSON.parse(data).todos
    let findedTodo = findById(req.params.id, todos)
    if (findedTodo && typeof findedTodo === 'object') {
      res.status(200).json(findedTodo)
    } else {
      Promise.reject(err);
    }
  }).catch(err => {
    res.status(404).json({status: 404, message: 'Opps! Resource cannot found'});
  })
})


// UPDATE
app.put('/api/v1/todos/:id', (req, res, next) => {
  let updatedTodo = {
    id: ~~req.params.id,
    name: req.body.name,
    status: req.body.status,
  }
  updateById('./DB/todo.json', updatedTodo).then(() => {
    res.status(200).json({status: 200, message: 'update thanh cong', data: updatedTodo})
  }).catch(err=>{
    res.status(404).json({status: 404, message: 'update that bai'});
    next()
  })
})

// DELETE
app.delete('/api/v1/todos/:id', (req, res, next)=>{
  console.log('delete route');
  deleteById('./DB/todo.json', ~~req.params.id).then(()=>{
    res.status(200).json({status: 200, message: 'delete thanh cong'})
  }).catch(err=>{
    res.status(404).json({status: 404, message: 'delete that bai'});
  })
})

// ERROR HANDLER


//listen
let port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('server is openning . . .')
  console.log('http://localhost:' + port)
})

