const fs = require('fs');


let data = "nodejs is awesome"
// write file
// https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_writefile_file_data_options_callback
fs.writeFile('./tailieu.txt',data, function(err){
  if(!err){
    console.log('-->write file successfully');
  }
})

// read file
// https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_readfile_path_options_callback
fs.readFile('./tailieu.txt', 'utf8', function(err, data){
  if(!err){
    console.log('-->read file successfully')
    console.log(data);
  }
})

