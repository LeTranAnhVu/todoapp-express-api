const fs = require('fs')

const Helpers = {
  readDB: function (path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
          if (err) reject(err)
          else resolve(data)
        })
      },
    )
  },
  findById: function (id, db) {
    let newarr = db.filter(item => {
      if (item.id === ~~id) return item
    })
    if (newarr.length === 1) return newarr[0]
    return null
  },
  idFactory: function (db) {
    return db.reduce((acc, item) => {
      return acc + item.id
    }, 0)
  },
  writeDB: function (path, data) {
    return new Promise((resolve, reject)=>{
      Helpers.readDB(path).then(response => {
        let todos = JSON.parse(response).todos
        todos.push(data)
        console.log('data', data)
        let jsonData = JSON.stringify({todos: todos})
        console.log(jsonData)
        // write data to todo
        return new Promise(() => {
          fs.writeFile(path, jsonData, (err) => {
            if (err) reject(err)
            else resolve()
          })
        })
      })
    })
  },
  updateById: function (path, updatedData) {
    return new Promise((resolve, reject)=>{
      Helpers.readDB(path).then(response => {
        let todos = JSON.parse(response).todos
        todos = todos.map((item) => {
          if (item.id == updatedData.id) {
            item = updatedData
          }
          return item;
        })
        let jsonData = JSON.stringify({todos: todos})
        // write data to todo
        return new Promise(() => {
          fs.writeFile(path, jsonData, (err) => {
            if (err) reject(err)
            else resolve()
          })
        })
      })
    })
  },

  deleteById: function (path, deletedId){
    return new Promise((resolve, reject) => {
      Helpers.readDB(path).then(response => {
        let todos = JSON.parse(response).todos
        let originLength = todos.length;
        todos = todos.filter((item) => {
          return item.id !== deletedId;
        })
        if(todos.length !== originLength){
          let jsonData = JSON.stringify({todos: todos})
          // write data to todo
          return new Promise(() => {
            fs.writeFile(path, jsonData, (err) => {
              if (err) reject(err)
              else resolve()
            })
          })
        }else {
          reject();
        }
      })
    })
  }
}
module.exports = Helpers

