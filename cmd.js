#!/usr/bin/env node

const fs = require('fs')
const clip = require('node-clipboard')
const concat = require('concat-stream')
const uglify = require('uglify-js')
const config = require('minimist')(process.argv.slice(2))

;(config._.length ? fs.createReadStream(config._[0]) : process.stdin)
  .pipe(concat((data) => {
    const bookmarklet = uglify.minify(data.toString(), {fromString: true}).code
    clip(
      `data:text/html, <a href="javascript:(function(){${bookmarklet}}())">${config.link || 'Bookmarklet'}</a>`,
      (err) => {
        if (err) return console.error(err)
        console.log('Bookmarklet copied to clipboard')
      }
    )
  }))
