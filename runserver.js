var hujiserver = require('./hujiwebserver');
hujiserver.start(8000, './some/Folder', function(e) {
    e?(console.log(e)):(console.log('server is up. port 8000'));
});

