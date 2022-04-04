"use strict";

require('dotenv').config();

var buildApp = require('./fastify');

var env = require('./configs');

var db = require('./utils/db');

var _require = require('./bootstrap'),
    bootStrap = _require.bootStrap; // Port


var port = env.PORT || 5000;
var prod = env.PORT || 5000; // Run the server!

var start = function start() {
  var fastify;
  return regeneratorRuntime.async(function start$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(buildApp());

        case 2:
          fastify = _context.sent;
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(db());

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(bootStrap());

        case 8:
          console.log(process.env.NODE_ENV, "hello");

          if (!(process.env.NODE_ENV == "productions")) {
            _context.next = 14;
            break;
          }

          _context.next = 12;
          return regeneratorRuntime.awrap(fastify.listen(port, '0.0.0.0'));

        case 12:
          _context.next = 16;
          break;

        case 14:
          _context.next = 16;
          return regeneratorRuntime.awrap(fastify.listen(port));

        case 16:
          _context.next = 22;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](3);
          fastify.log.error(_context.t0);
          process.exit(1);

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 18]]);
};

start();