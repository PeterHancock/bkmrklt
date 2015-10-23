#!/usr/bin/env node

var path = require('path'),
    fs = require('fs'),
    dust = require('dustjs-linkedin'),
    http = require('http'),
    opn = require('opn'),
    concat = require('concat-stream'),
    uglify = require('uglify-js'),
    config = require('rc')('bkmrklt', {
    	port: 0,
    	hostname: 'localhost',
    	contentType: 'text/html',
        name: 'bookmarket'
    })

dust.loadSource(dust.compile(fs.readFileSync(__dirname + '/index.tmpl', {encoding: 'utf-8'}),
        'tmpl'))

var server = http.createServer(function (req, res) {
	res.setHeader('Content-Type', config.contentType)
    var stream
    if (config._.length) {
        stream = fs.createReadStream(config._[0])
    } else {
        name = config.name
        stream = process.stdin
    }
    stream.pipe(concat( data => {
        var bookmarklet = uglify.minify(data.toString(), {fromString: true}).code
        dust.stream('tmpl', {js: bookmarklet, name: config.name}).pipe(res)
            .on('end', () => process.exit(0) )
    }))
})
.on('listening', function() {
	opn('http://' + config.hostname +':' + this.address().port)
})
.listen(config.port, config.hostname)
