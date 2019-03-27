const fs = require('fs')
const md5 = require('md5')

const Helpers = {
  readLimitDB: function (path, limit, page) {
    return new Promise((resolve, reject) => {
      Helpers.readDB(path).then(data => {
          let aData = JSON.parse(data).todos,
            lastIndex = aData.length - 1,
            start = limit * (page - 1),
            end = lastIndex >= (start + limit - 1) ? start + limit : undefined,
            returnData = aData.slice(start, end);
            jsonData = {
              data: returnData,
            }
            if(end !== undefined){
              page++;
              jsonData.nextPageUrl = `/api/v1/todos?page=${page}`;
              jsonData.nextPage = page;
            }else {
              jsonData.nextPageUrl = null;
              jsonData.nextPage = null;
            }
        resolve(jsonData)
        }).catch(err => {
          console.log(err);
          reject(err);
        })
      },
    )
  },
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
      if (item.id === id) return item
    })
    if (newarr.length === 1) return newarr[0]
    return null
  },
  idFactory: function () {
    return md5(JSON.stringify(new Date()))
  },
  writeDB: function (path, data) {
    return new Promise((resolve, reject) => {
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
    return new Promise((resolve, reject) => {
      Helpers.readDB(path).then(response => {
        let todos = JSON.parse(response).todos
        todos = todos.map((item) => {
          if (item.id == updatedData.id) {
            item = updatedData
          }
          return item
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

  deleteById: function (path, deletedId) {
    return new Promise((resolve, reject) => {
      Helpers.readDB(path).then(response => {
        let todos = JSON.parse(response).todos
        let originLength = todos.length
        todos = todos.filter((item) => {
          return item.id !== deletedId
        })
        if (todos.length !== originLength) {
          let jsonData = JSON.stringify({todos: todos})
          // write data to todo
          return new Promise(() => {
            fs.writeFile(path, jsonData, (err) => {
              if (err) reject(err)
              else resolve()
            })
          })
        } else {
          reject()
        }
      })
    })
  },
}
module.exports = Helpers

