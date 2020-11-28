# ElasticSearch Commandline Utility (ESCLU) Program

![node badge](https://img.shields.io/node/v/commander)
![number of commits badge](https://img.shields.io/github/commit-activity/y/abetavarez/esclu)
![file size badge](https://img.shields.io/github/languages/code-size/abetavarez/esclur)
![number of contributors badge](https://img.shields.io/github/contributors/abetavarez/esclu)

Interact with ElasticSearch database from your terminal.

## Description

ElasticSearch is a schema free, RESTful, NoSQL database that store and indexes JSON documents over HTTP.
The ESLU program allows you to perform advanced query commands and other useful actions like importing documents in bulk right from your terminal.

We take advantage of NodeJS core streams and Piping functionalitiesto communicate to with remote services over HTTP.

## Getting Started

### Prerequisites

The following must be installed in your computer:

- Java
- Java Development Kit (JDK)

Check using;

```
java --version
```

### Dependencies

- Commander
- Request

### Installing

- Clone repo
- In the root directory 'ESCLU' run:

```
npm install
```

### Executing program

- The Elastic Search Server must be runinng in another tab or terminal

[You can download it here](https://www.elastic.co/downloads/past-releases/elasticsearch-5-2-2)

- ESCLU has an executable file, run the command below from the root directory:

```
./esclu
```

## Help

For HELP use:

```
./esclu -h
```

## Options:

```
    -h, --help             output usage information
    -V, --version          output the version number
    -o --host <hostname>   hostname[localhost]
    -p, --port <number>    port number [9200]
    -j , --json            format outputas JSON
    -i, --index <name>     which index to use
    -t, --type <type>      default type for bulk operations
    -f, --filter <filter>  source filter for query results
```

## Commands:

```
    url [path]            generates the URL for the options and path (default is /).
    list-indices|li       get a list of indices in current cluster
    get [path]            perform an HTTP GET request for path (default is /).
    create-index          perform an HTTP PUT to Create a new Index.
    bulk <file>           read and perform bulk options from the specified file.
    put <file>            read and perform options for single document from the specified file.
    delete-index [path]   perform an HTTP DELETE request for path.
    query|q [queries...]  perform a query
```

- If you encounter any problems or issues, please submit an issue ticket or pull request.

## Authors

Abraham Tavarez  
[@AbrahamETavarez](https://www.linkedin.com/in/abrahametavarez/)

## Version History

- 0.1
  - Initial Release

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgments
