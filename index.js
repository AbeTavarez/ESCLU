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
  //* Program Settings
  .version(pkg.version)
  .description(pkg.description)
  .usage('[options] <command> [...]')
  .option('-o --host <hostname>', 'hostname[localhost]', 'localhost')
  .option('-p, --port <number>', 'port number [9200]', '9200')
  .option('-j , --json', 'format outputas JSON')
  .option('-i, --index <name>', 'which index to use')
  .option('-t, --type <type>', 'default type for bulk operations')

  //* Logs path
  .command('url [path]')
  .description('generates the URL for the options and path (default is /).')
  .action((path = '/') => console.log(fullUrl(path)));

program
  //* List command with li alias
  .command('list-indices')
  .alias('li')
  .description('get a list of indices in this cluster')
  .action(() => {
    // determinate the path // _all for --json flag // li-j
    const path = program.json ? '_all' : '_cat/indices?v';
    // inline option onject
    request({ url: fullUrl(path), json: program.json }, handleResponse);
  });

//* CRUD Commands *******************************/

program
  //* GET Request Query Index
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
  //* PUT Request Create Index
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
  //* POST Request Upload docs in bulk
  .command('bulk <file>')
  .description('read and perform bulk options from the specified file')
  .action((file) => {
    fs.stat(file, (err, stats) => {
      if (err) {
        if (program.json) {
          console.log(JSON.stringify(err));
          return;
        }
        throw err;
      }
      const options = {
        url: fullUrl('_bulk'),
        json: true,
        headers: {
          'Content-Length': stats.size,
          'Content-Type': 'application/json',
        },
      };
      const req = request.post(options);

      const stream = fs.createReadStream(file);
      stream.pipe(req);
      req.pipe(process.stdout);
    });
  });

program
  //* DELETE Request Delete Index
  .command('delete-index [path]')
  .description('perform an HTTP DELETE request for path (default is /)')
  .action((path) => {
    const options = {
      url: fullUrl(path),
      json: program.json,
    };
    request.delete(options, (err, body) => {
      if (program.json) {
        console.log(JSON.stringify(err || body));
      } else {
        if (err) throw err;
        console.log(body);
      }
    });
  });

//** Query Filters ***********************************************/
program
  //* -f flag (filter option)
  .option('-f, --filter <filter>', 'source filter for query results');

program
  //* Sets a Query command
  .command('query [queries...]') // takes any num of args
  .alias('q')
  .description('perform a query')
  .action((queries = []) => {
    // builds query string
    const options = {
      url: fullUrl('_search'),
      json: program.json,
      qs: {},
    };
    //if -q flag then concat with spaces
    if (queries && queries.length) {
      options.qs.q = queries.join(' ');
    }
    //if -f flag then convert _source param for query str
    if (program.filter) {
      options.qs._source = program.filter;
    }
    request(options, handleResponse);
  });

//* Parse arguments
program.parse(process.argv);

if (!program.args.filter((arg) => typeof arg === 'object').length) {
  program.help();
}
