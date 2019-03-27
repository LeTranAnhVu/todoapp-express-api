const path = require('path')
const cors = require('cors')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const md5 = require('md5')

const {readDB, findById, idFactory, writeDB, updateById, deleteById, readLimitDB} = require(
  './helper')

app.use(cors())
// middlewares
app.use(express.static(path.join(__dirname, 'public')))

// parse form
app.use(bodyParser.urlencoded({extended: false}))
// parse json
app.use(bodyParser.json())
// routers
app.use(function(req, res, next){
  process.env.DOMAIN = req.get('host');
  next();
})
app.get('/', function (req, res, next) {
  res.status(200).render('index.html')
})

// LIST
app.get('/api/v1/todos', (req, res, next) => {
  // read the json
  let page = req.query.page ? ~~req.query.page : 1 ;

  readLimitDB('./DB/todo.json', 5, page).then(data => {

    if (typeof data === 'object') {
      res.set('Content-Type', 'application/json')
      res.json(data)
    }
  }).catch(err => {
    next({status: 404, message: 'Khong Tim Thay Tai Nguyen'});
  })
})

// CREATE
app.post('/api/v1/todos', (req, res, next) => {
  readDB('./DB/todo.json').then(data => {
    let todos = JSON.parse(data).todos
    let newo = {
      id: idFactory(),
      name: req.body.name,
      status: false,
    }
    if (newo.id) {
      writeDB('./DB/todo.json', newo).then(() => {
        res.status(200).
          json({status: 200, message: 'create thanh cong', data: newo})
      }).catch(err => {
        next({status: 404, message: 'create that bai'});
      })
    } else {
      next({status: 404, message: 'create that bai'});
    }
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
      next({status: 404, message: 'Khong Tim Thay Tai Nguyen'});
    }
  }).catch(err => {
    next({status: 404, message: 'Khong Tim Thay Tai Nguyen'});
  })
})

// UPDATE
app.put('/api/v1/todos/:id', (req, res, next) => {
  let updatedTodo = {
    id: req.params.id,
    name: req.body.name,
    status: req.body.status,
  }
  updateById('./DB/todo.json', updatedTodo).then(() => {
    res.status(200).
      json({status: 200, message: 'update thanh cong', data: updatedTodo})
  }).catch(err => {
    next({status: 404, message: 'update that bai'});
  })
})

// DELETE
app.delete('/api/v1/todos/:id', (req, res, next) => {
  deleteById('./DB/todo.json', req.params.id).then(() => {
    res.status(200).json({status: 200, message: 'delete thanh cong'})
  }).catch(err => {
    next({status: 404, message: 'delete that bai'});
  })
})

// ERROR HANDLER
app.use(function(err, req, res, next){
  if(err){
    res.status(err.status).json(err);
  }
})

//listen
let port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('server is openning . . .')
  console.log('http://localhost:' + port)
})

