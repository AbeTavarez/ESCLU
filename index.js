'use strict';

const fs = require('fs');
const axios = require('axios');
const request = require('request');
const program = require('commander');
const pkg = require('./package.json');

//* URL
const fullUrl = (path = '') => {
  let url = `http://${program.host}:${program.port}/`;

  if (program.index) {
    url += program.index + '/';
    if (program.type) {
      url += program.type + '/';
    }
  }
  // removes leading forward slashes /
  return url + path.replace(/^\/*/, '');
};

//* Response Handler
const handleResponse = (err, res, body) => {
  if (program.json) {
    console.log(JSON.stringify(err || body));
  } else {
    if (err) throw err;
    console.log(body);
  }
};

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('[options] <command> [...]')
  .option('-o --host <hostname>', 'hostname[localhost]', 'localhost')
  .option('-p, --port <number>', 'port number [9200]', '9200')
  .option('-j , --json', 'format outputas JSON')
  .option('-i, --index <name>', 'which index to use')
  .option('-t, --type <type>', 'default type for bulk operations')

  //Logs path
  .command('url [path]')
  .description('generates the URL for the options and path (default is /).')
  .action((path = '/') => console.log(fullUrl(path)));

program
  // GET Requests
  .command('get [path]')
  .description('perform an HTTP GET request for path (default is /).')
  .action((path = '/') => {
    // options object
    const options = {
      url: fullUrl(path),
      json: program.json,
    };
    request(options, (err, body) => {
      if (program.json) {
        console.log(JSON.stringify(err || body));
      } else {
        if (err) throw err;
        console.log(body);
      }
    });
  });

program
  // PUT Request Create Index
  .command('create-index')
  .description('Create a new index.')
  .action(() => {
    if (!program.index) {
      const msg = 'No index specified! Use --index <name>';
      if (!program.json) throw Error(msg);
      console.log(JSON.stringify({ error: msg }));
      return;
    }
    request.put(fullUrl(), handleResponse);
  });

program
  // List command with li alias
  .command('list-indices')
  .alias('li')
  .description('get a list of indices in this cluster')
  .action(() => {
    // determinate the path // _all for --json flag //
    const path = program.json ? '_all' : '_cat/indices?v';
    // inline option onject
    request({ url: fullUrl(path), json: program.json }, handleResponse);
  });

//* Parse arguments
program.parse(process.argv);

if (!program.args.filter((arg) => typeof arg === 'object').length) {
  program.help();
}
