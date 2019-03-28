const axios = require('axios')
const url = 'https://todoapp-express-api.herokuapp.com/api/v1/todos'

console.log('first log')

// this is non-blocking or asyncronous
axios.get(url).then(response =>{
  // vao day khi data da co
  console.log('log when data is arrived');
})

console.log('second log');
