/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var loadjs = __webpack_require__(2);

module.exports = function (config) {

	return {

		key: function key(_key, callback) {
			var _this = this;

			try {
				(function () {
					var self = _this;
					if (config[_key].deps) {
						(function () {
							var loaded = 0;
							config[_key].deps.forEach(function (value) {
								self.key(value, function () {
									loaded++;
									if (loaded == config[_key].deps.length) {
										loadjs(config[_key].files, _key, {
											success: callback
										});
									}
								});
							});
						})();
					} else {

						loadjs(config[_key].files, _key, {
							success: callback
						});
					}
				})();
			} catch (e) {
				loadjs.ready(_key, {
					success: callback
				});
			}
		},

		src: function src(url, key, callback) {
			try {
				loadjs(url, key, {
					success: callback
				});
			} catch (e) {
				loadjs.ready(key, {
					success: callback
				});
			}
		}

	};
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.loadjs = factory();
  }
}(this, function() {
/**
 * Global dependencies.
 * @global {Object} document - DOM
 */

var devnull = function() {},
    bundleIdCache = {},
    bundleResultCache = {},
    bundleCallbackQueue = {};


/**
 * Subscribe to bundle load event.
 * @param {string[]} bundleIds - Bundle ids
 * @param {Function} callbackFn - The callback function
 */
function subscribe(bundleIds, callbackFn) {
  // listify
  bundleIds = bundleIds.push ? bundleIds : [bundleIds];

  var depsNotFound = [],
      i = bundleIds.length,
      numWaiting = i,
      fn,
      bundleId,
      r,
      q;

  // define callback function
  fn = function (bundleId, pathsNotFound) {
    if (pathsNotFound.length) depsNotFound.push(bundleId);

    numWaiting--;
    if (!numWaiting) callbackFn(depsNotFound);
  };

  // register callback
  while (i--) {
    bundleId = bundleIds[i];

    // execute callback if in result cache
    r = bundleResultCache[bundleId];
    if (r) {
      fn(bundleId, r);
      continue;
    }

    // add to callback queue
    q = bundleCallbackQueue[bundleId] = bundleCallbackQueue[bundleId] || [];
    q.push(fn);
  }
}


/**
 * Publish bundle load event.
 * @param {string} bundleId - Bundle id
 * @param {string[]} pathsNotFound - List of files not found
 */
function publish(bundleId, pathsNotFound) {
  // exit if id isn't defined
  if (!bundleId) return;

  var q = bundleCallbackQueue[bundleId];

  // cache result
  bundleResultCache[bundleId] = pathsNotFound;

  // exit if queue is empty
  if (!q) return;

  // empty callback queue
  while (q.length) {
    q[0](bundleId, pathsNotFound);
    q.splice(0, 1);
  }
}


/**
 * Load individual file.
 * @param {string} path - The file path
 * @param {Function} callbackFn - The callback function
 */
function loadFile(path, callbackFn, args, numTries) {
  var doc = document,
      async = args.async,
      maxTries = (args.numRetries || 0) + 1,
      beforeCallbackFn = args.before || devnull,
      isCss,
      e;

  numTries = numTries || 0;

  if (/\.css$/.test(path)) {
    isCss = true;

    // css
    e = doc.createElement('link');
    e.rel = 'stylesheet';
    e.href = path;
  } else {
    // javascript
    e = doc.createElement('script');
    e.src = path;
    e.async = async === undefined ? true : async;
  }

  e.onload = e.onerror = e.onbeforeload = function (ev) {
    var result = ev.type[0];

    // Note: The following code isolates IE using `hideFocus` and treats empty
    // stylesheets as failures to get around lack of onerror support
    if (isCss && 'hideFocus' in e) {
      try {
        if (!e.sheet.cssText.length) result = 'e';
      } catch (x) {
        // sheets objects created from load errors don't allow access to
        // `cssText`
        result = 'e';
      }
    }

    // handle retries in case of load failure
    if (result == 'e') {
      // increment counter
      numTries += 1;

      // exit function and try again
      if (numTries < maxTries) {
        return loadFile(path, callbackFn, args, numTries);
      }
    }

    // execute callback
    callbackFn(path, result, ev.defaultPrevented);
  };

  // execute before callback
  beforeCallbackFn(path, e);

  // add to document
  doc.head.appendChild(e);
}


/**
 * Load multiple files.
 * @param {string[]} paths - The file paths
 * @param {Function} callbackFn - The callback function
 */
function loadFiles(paths, callbackFn, args) {
  // listify paths
  paths = paths.push ? paths : [paths];

  var numWaiting = paths.length,
      x = numWaiting,
      pathsNotFound = [],
      fn,
      i;

  // define callback function
  fn = function(path, result, defaultPrevented) {
    // handle error
    if (result == 'e') pathsNotFound.push(path);

    // handle beforeload event. If defaultPrevented then that means the load
    // will be blocked (ex. Ghostery/ABP on Safari)
    if (result == 'b') {
      if (defaultPrevented) pathsNotFound.push(path);
      else return;
    }

    numWaiting--;
    if (!numWaiting) callbackFn(pathsNotFound);
  };

  // load scripts
  for (i=0; i < x; i++) loadFile(paths[i], fn, args);
}


/**
 * Initiate script load and register bundle.
 * @param {(string|string[])} paths - The file paths
 * @param {(string|Function)} [arg1] - The bundleId or success callback
 * @param {Function} [arg2] - The success or error callback
 * @param {Function} [arg3] - The error callback
 */
function loadjs(paths, arg1, arg2) {
  var bundleId,
      args;

  // bundleId (if string)
  if (arg1 && arg1.trim) bundleId = arg1;

  // args (default is {})
  args = (bundleId ? arg2 : arg1) || {};

  // throw error if bundle is already defined
  if (bundleId) {
    if (bundleId in bundleIdCache) {
      throw "LoadJS";
    } else {
      bundleIdCache[bundleId] = true;
    }
  }

  // load scripts
  loadFiles(paths, function (pathsNotFound) {
    // success and error callbacks
    if (pathsNotFound.length) (args.error || devnull)(pathsNotFound);
    else (args.success || devnull)();

    // publish bundle load event
    publish(bundleId, pathsNotFound);
  }, args);
}


/**
 * Execute callbacks when dependencies have been satisfied.
 * @param {(string|string[])} deps - List of bundle ids
 * @param {Object} args - success/error arguments
 */
loadjs.ready = function ready(deps, args) {
  // subscribe to bundle load event
  subscribe(deps, function (depsNotFound) {
    // execute callbacks
    if (depsNotFound.length) (args.error || devnull)(depsNotFound);
    else (args.success || devnull)();
  });

  return loadjs;
};


/**
 * Manually satisfy bundle dependencies.
 * @param {string} bundleId - The bundle id
 */
loadjs.done = function done(bundleId) {
  publish(bundleId, []);
};


/**
 * Reset loadjs dependencies statuses
 */
loadjs.reset = function reset() {
  bundleIdCache = {};
  bundleResultCache = {};
  bundleCallbackQueue = {};
};


// export
return loadjs;

}));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

var load = __webpack_require__(0)({
	'jquery': { files: ['//code.jquery.com/jquery-3.1.1.slim.js'] },
	'select2': { files: ['//cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js'], deps: ['jquery'] }
});

load.key('jquery', function () {
	console.log('jquery loaded');
});

load.key('select2', function () {
	console.log('select2 loaded');
});

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmY0YzQzMjk4OTkwZWQwYTkwM2UiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHVsZXMvbG9hZGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9jc3MvbWFpbi5zY3NzIiwid2VicGFjazovLy8uL34vbG9hZGpzL2Rpc3QvbG9hZGpzLnVtZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvYXBwLmpzIl0sIm5hbWVzIjpbImxvYWRqcyIsInJlcXVpcmUiLCJtb2R1bGUiLCJleHBvcnRzIiwiY29uZmlnIiwia2V5IiwiY2FsbGJhY2siLCJzZWxmIiwiZGVwcyIsImxvYWRlZCIsImZvckVhY2giLCJ2YWx1ZSIsImxlbmd0aCIsImZpbGVzIiwic3VjY2VzcyIsImUiLCJyZWFkeSIsInNyYyIsInVybCIsImxvYWQiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQ2hFQSxJQUFNQSxTQUFTLG1CQUFBQyxDQUFRLENBQVIsQ0FBZjs7QUFFQUMsT0FBT0MsT0FBUCxHQUFpQixVQUFTQyxNQUFULEVBQWdCOztBQUVoQyxRQUFPOztBQUVOQyxPQUFLLGFBQVNBLElBQVQsRUFBY0MsUUFBZCxFQUF1QjtBQUFB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XG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNmY0YzQzMjk4OTkwZWQwYTkwM2UiLCJjb25zdCBsb2FkanMgPSByZXF1aXJlKCdsb2FkanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb25maWcpe1xuXHRcblx0cmV0dXJuIHtcblx0XHRcblx0XHRrZXk6IGZ1bmN0aW9uKGtleSwgY2FsbGJhY2spe1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xuXHRcdFx0XHRpZihjb25maWdba2V5XS5kZXBzKXtcblx0XHRcdFx0XHRsZXQgbG9hZGVkID0gMDtcblx0XHRcdFx0XHRjb25maWdba2V5XS5kZXBzLmZvckVhY2goZnVuY3Rpb24odmFsdWUpe1xuXHRcdFx0XHRcdFx0c2VsZi5rZXkodmFsdWUsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdGxvYWRlZCsrO1xuXHRcdFx0XHRcdFx0XHRpZihsb2FkZWQgPT0gY29uZmlnW2tleV0uZGVwcy5sZW5ndGgpe1xuXHRcdFx0XHRcdFx0XHRcdGxvYWRqcyhjb25maWdba2V5XS5maWxlcywga2V5LCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzdWNjZXNzOiBjYWxsYmFja1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XG5cdFx0XHRcdFx0bG9hZGpzKGNvbmZpZ1trZXldLmZpbGVzLCBrZXksIHtcblx0XHRcdFx0XHRcdHN1Y2Nlc3M6IGNhbGxiYWNrXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gY2F0Y2goZSl7XG5cdFx0XHRcdGxvYWRqcy5yZWFkeShrZXksIHtcblx0XHRcdFx0XHRzdWNjZXNzOiBjYWxsYmFja1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdFxuXHRcdHNyYzogZnVuY3Rpb24odXJsLCBrZXksIGNhbGxiYWNrKXtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGxvYWRqcyh1cmwsIGtleSwge1xuXHRcdFx0XHRcdHN1Y2Nlc3M6IGNhbGxiYWNrXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBjYXRjaChlKXtcblx0XHRcdFx0bG9hZGpzLnJlYWR5KGtleSwge1xuXHRcdFx0XHRcdHN1Y2Nlc3M6IGNhbGxiYWNrXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XG5cdH1cblx0XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21vZHVsZXMvbG9hZGVyLmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jc3MvbWFpbi5zY3NzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2Uge1xuICAgIHJvb3QubG9hZGpzID0gZmFjdG9yeSgpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuLyoqXG4gKiBHbG9iYWwgZGVwZW5kZW5jaWVzLlxuICogQGdsb2JhbCB7T2JqZWN0fSBkb2N1bWVudCAtIERPTVxuICovXG5cbnZhciBkZXZudWxsID0gZnVuY3Rpb24oKSB7fSxcbiAgICBidW5kbGVJZENhY2hlID0ge30sXG4gICAgYnVuZGxlUmVzdWx0Q2FjaGUgPSB7fSxcbiAgICBidW5kbGVDYWxsYmFja1F1ZXVlID0ge307XG5cblxuLyoqXG4gKiBTdWJzY3JpYmUgdG8gYnVuZGxlIGxvYWQgZXZlbnQuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBidW5kbGVJZHMgLSBCdW5kbGUgaWRzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja0ZuIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIHN1YnNjcmliZShidW5kbGVJZHMsIGNhbGxiYWNrRm4pIHtcbiAgLy8gbGlzdGlmeVxuICBidW5kbGVJZHMgPSBidW5kbGVJZHMucHVzaCA/IGJ1bmRsZUlkcyA6IFtidW5kbGVJZHNdO1xuXG4gIHZhciBkZXBzTm90Rm91bmQgPSBbXSxcbiAgICAgIGkgPSBidW5kbGVJZHMubGVuZ3RoLFxuICAgICAgbnVtV2FpdGluZyA9IGksXG4gICAgICBmbixcbiAgICAgIGJ1bmRsZUlkLFxuICAgICAgcixcbiAgICAgIHE7XG5cbiAgLy8gZGVmaW5lIGNhbGxiYWNrIGZ1bmN0aW9uXG4gIGZuID0gZnVuY3Rpb24gKGJ1bmRsZUlkLCBwYXRoc05vdEZvdW5kKSB7XG4gICAgaWYgKHBhdGhzTm90Rm91bmQubGVuZ3RoKSBkZXBzTm90Rm91bmQucHVzaChidW5kbGVJZCk7XG5cbiAgICBudW1XYWl0aW5nLS07XG4gICAgaWYgKCFudW1XYWl0aW5nKSBjYWxsYmFja0ZuKGRlcHNOb3RGb3VuZCk7XG4gIH07XG5cbiAgLy8gcmVnaXN0ZXIgY2FsbGJhY2tcbiAgd2hpbGUgKGktLSkge1xuICAgIGJ1bmRsZUlkID0gYnVuZGxlSWRzW2ldO1xuXG4gICAgLy8gZXhlY3V0ZSBjYWxsYmFjayBpZiBpbiByZXN1bHQgY2FjaGVcbiAgICByID0gYnVuZGxlUmVzdWx0Q2FjaGVbYnVuZGxlSWRdO1xuICAgIGlmIChyKSB7XG4gICAgICBmbihidW5kbGVJZCwgcik7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBhZGQgdG8gY2FsbGJhY2sgcXVldWVcbiAgICBxID0gYnVuZGxlQ2FsbGJhY2tRdWV1ZVtidW5kbGVJZF0gPSBidW5kbGVDYWxsYmFja1F1ZXVlW2J1bmRsZUlkXSB8fCBbXTtcbiAgICBxLnB1c2goZm4pO1xuICB9XG59XG5cblxuLyoqXG4gKiBQdWJsaXNoIGJ1bmRsZSBsb2FkIGV2ZW50LlxuICogQHBhcmFtIHtzdHJpbmd9IGJ1bmRsZUlkIC0gQnVuZGxlIGlkXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwYXRoc05vdEZvdW5kIC0gTGlzdCBvZiBmaWxlcyBub3QgZm91bmRcbiAqL1xuZnVuY3Rpb24gcHVibGlzaChidW5kbGVJZCwgcGF0aHNOb3RGb3VuZCkge1xuICAvLyBleGl0IGlmIGlkIGlzbid0IGRlZmluZWRcbiAgaWYgKCFidW5kbGVJZCkgcmV0dXJuO1xuXG4gIHZhciBxID0gYnVuZGxlQ2FsbGJhY2tRdWV1ZVtidW5kbGVJZF07XG5cbiAgLy8gY2FjaGUgcmVzdWx0XG4gIGJ1bmRsZVJlc3VsdENhY2hlW2J1bmRsZUlkXSA9IHBhdGhzTm90Rm91bmQ7XG5cbiAgLy8gZXhpdCBpZiBxdWV1ZSBpcyBlbXB0eVxuICBpZiAoIXEpIHJldHVybjtcblxuICAvLyBlbXB0eSBjYWxsYmFjayBxdWV1ZVxuICB3aGlsZSAocS5sZW5ndGgpIHtcbiAgICBxWzBdKGJ1bmRsZUlkLCBwYXRoc05vdEZvdW5kKTtcbiAgICBxLnNwbGljZSgwLCAxKTtcbiAgfVxufVxuXG5cbi8qKlxuICogTG9hZCBpbmRpdmlkdWFsIGZpbGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBmaWxlIHBhdGhcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrRm4gLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gbG9hZEZpbGUocGF0aCwgY2FsbGJhY2tGbiwgYXJncywgbnVtVHJpZXMpIHtcbiAgdmFyIGRvYyA9IGRvY3VtZW50LFxuICAgICAgYXN5bmMgPSBhcmdzLmFzeW5jLFxuICAgICAgbWF4VHJpZXMgPSAoYXJncy5udW1SZXRyaWVzIHx8IDApICsgMSxcbiAgICAgIGJlZm9yZUNhbGxiYWNrRm4gPSBhcmdzLmJlZm9yZSB8fCBkZXZudWxsLFxuICAgICAgaXNDc3MsXG4gICAgICBlO1xuXG4gIG51bVRyaWVzID0gbnVtVHJpZXMgfHwgMDtcblxuICBpZiAoL1xcLmNzcyQvLnRlc3QocGF0aCkpIHtcbiAgICBpc0NzcyA9IHRydWU7XG5cbiAgICAvLyBjc3NcbiAgICBlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICBlLnJlbCA9ICdzdHlsZXNoZWV0JztcbiAgICBlLmhyZWYgPSBwYXRoO1xuICB9IGVsc2Uge1xuICAgIC8vIGphdmFzY3JpcHRcbiAgICBlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIGUuc3JjID0gcGF0aDtcbiAgICBlLmFzeW5jID0gYXN5bmMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBhc3luYztcbiAgfVxuXG4gIGUub25sb2FkID0gZS5vbmVycm9yID0gZS5vbmJlZm9yZWxvYWQgPSBmdW5jdGlvbiAoZXYpIHtcbiAgICB2YXIgcmVzdWx0ID0gZXYudHlwZVswXTtcblxuICAgIC8vIE5vdGU6IFRoZSBmb2xsb3dpbmcgY29kZSBpc29sYXRlcyBJRSB1c2luZyBgaGlkZUZvY3VzYCBhbmQgdHJlYXRzIGVtcHR5XG4gICAgLy8gc3R5bGVzaGVldHMgYXMgZmFpbHVyZXMgdG8gZ2V0IGFyb3VuZCBsYWNrIG9mIG9uZXJyb3Igc3VwcG9ydFxuICAgIGlmIChpc0NzcyAmJiAnaGlkZUZvY3VzJyBpbiBlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIWUuc2hlZXQuY3NzVGV4dC5sZW5ndGgpIHJlc3VsdCA9ICdlJztcbiAgICAgIH0gY2F0Y2ggKHgpIHtcbiAgICAgICAgLy8gc2hlZXRzIG9iamVjdHMgY3JlYXRlZCBmcm9tIGxvYWQgZXJyb3JzIGRvbid0IGFsbG93IGFjY2VzcyB0b1xuICAgICAgICAvLyBgY3NzVGV4dGBcbiAgICAgICAgcmVzdWx0ID0gJ2UnO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGhhbmRsZSByZXRyaWVzIGluIGNhc2Ugb2YgbG9hZCBmYWlsdXJlXG4gICAgaWYgKHJlc3VsdCA9PSAnZScpIHtcbiAgICAgIC8vIGluY3JlbWVudCBjb3VudGVyXG4gICAgICBudW1UcmllcyArPSAxO1xuXG4gICAgICAvLyBleGl0IGZ1bmN0aW9uIGFuZCB0cnkgYWdhaW5cbiAgICAgIGlmIChudW1UcmllcyA8IG1heFRyaWVzKSB7XG4gICAgICAgIHJldHVybiBsb2FkRmlsZShwYXRoLCBjYWxsYmFja0ZuLCBhcmdzLCBudW1Ucmllcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZXhlY3V0ZSBjYWxsYmFja1xuICAgIGNhbGxiYWNrRm4ocGF0aCwgcmVzdWx0LCBldi5kZWZhdWx0UHJldmVudGVkKTtcbiAgfTtcblxuICAvLyBleGVjdXRlIGJlZm9yZSBjYWxsYmFja1xuICBiZWZvcmVDYWxsYmFja0ZuKHBhdGgsIGUpO1xuXG4gIC8vIGFkZCB0byBkb2N1bWVudFxuICBkb2MuaGVhZC5hcHBlbmRDaGlsZChlKTtcbn1cblxuXG4vKipcbiAqIExvYWQgbXVsdGlwbGUgZmlsZXMuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwYXRocyAtIFRoZSBmaWxlIHBhdGhzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja0ZuIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIGxvYWRGaWxlcyhwYXRocywgY2FsbGJhY2tGbiwgYXJncykge1xuICAvLyBsaXN0aWZ5IHBhdGhzXG4gIHBhdGhzID0gcGF0aHMucHVzaCA/IHBhdGhzIDogW3BhdGhzXTtcblxuICB2YXIgbnVtV2FpdGluZyA9IHBhdGhzLmxlbmd0aCxcbiAgICAgIHggPSBudW1XYWl0aW5nLFxuICAgICAgcGF0aHNOb3RGb3VuZCA9IFtdLFxuICAgICAgZm4sXG4gICAgICBpO1xuXG4gIC8vIGRlZmluZSBjYWxsYmFjayBmdW5jdGlvblxuICBmbiA9IGZ1bmN0aW9uKHBhdGgsIHJlc3VsdCwgZGVmYXVsdFByZXZlbnRlZCkge1xuICAgIC8vIGhhbmRsZSBlcnJvclxuICAgIGlmIChyZXN1bHQgPT0gJ2UnKSBwYXRoc05vdEZvdW5kLnB1c2gocGF0aCk7XG5cbiAgICAvLyBoYW5kbGUgYmVmb3JlbG9hZCBldmVudC4gSWYgZGVmYXVsdFByZXZlbnRlZCB0aGVuIHRoYXQgbWVhbnMgdGhlIGxvYWRcbiAgICAvLyB3aWxsIGJlIGJsb2NrZWQgKGV4LiBHaG9zdGVyeS9BQlAgb24gU2FmYXJpKVxuICAgIGlmIChyZXN1bHQgPT0gJ2InKSB7XG4gICAgICBpZiAoZGVmYXVsdFByZXZlbnRlZCkgcGF0aHNOb3RGb3VuZC5wdXNoKHBhdGgpO1xuICAgICAgZWxzZSByZXR1cm47XG4gICAgfVxuXG4gICAgbnVtV2FpdGluZy0tO1xuICAgIGlmICghbnVtV2FpdGluZykgY2FsbGJhY2tGbihwYXRoc05vdEZvdW5kKTtcbiAgfTtcblxuICAvLyBsb2FkIHNjcmlwdHNcbiAgZm9yIChpPTA7IGkgPCB4OyBpKyspIGxvYWRGaWxlKHBhdGhzW2ldLCBmbiwgYXJncyk7XG59XG5cblxuLyoqXG4gKiBJbml0aWF0ZSBzY3JpcHQgbG9hZCBhbmQgcmVnaXN0ZXIgYnVuZGxlLlxuICogQHBhcmFtIHsoc3RyaW5nfHN0cmluZ1tdKX0gcGF0aHMgLSBUaGUgZmlsZSBwYXRoc1xuICogQHBhcmFtIHsoc3RyaW5nfEZ1bmN0aW9uKX0gW2FyZzFdIC0gVGhlIGJ1bmRsZUlkIG9yIHN1Y2Nlc3MgY2FsbGJhY2tcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFthcmcyXSAtIFRoZSBzdWNjZXNzIG9yIGVycm9yIGNhbGxiYWNrXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbYXJnM10gLSBUaGUgZXJyb3IgY2FsbGJhY2tcbiAqL1xuZnVuY3Rpb24gbG9hZGpzKHBhdGhzLCBhcmcxLCBhcmcyKSB7XG4gIHZhciBidW5kbGVJZCxcbiAgICAgIGFyZ3M7XG5cbiAgLy8gYnVuZGxlSWQgKGlmIHN0cmluZylcbiAgaWYgKGFyZzEgJiYgYXJnMS50cmltKSBidW5kbGVJZCA9IGFyZzE7XG5cbiAgLy8gYXJncyAoZGVmYXVsdCBpcyB7fSlcbiAgYXJncyA9IChidW5kbGVJZCA/IGFyZzIgOiBhcmcxKSB8fCB7fTtcblxuICAvLyB0aHJvdyBlcnJvciBpZiBidW5kbGUgaXMgYWxyZWFkeSBkZWZpbmVkXG4gIGlmIChidW5kbGVJZCkge1xuICAgIGlmIChidW5kbGVJZCBpbiBidW5kbGVJZENhY2hlKSB7XG4gICAgICB0aHJvdyBcIkxvYWRKU1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICBidW5kbGVJZENhY2hlW2J1bmRsZUlkXSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLy8gbG9hZCBzY3JpcHRzXG4gIGxvYWRGaWxlcyhwYXRocywgZnVuY3Rpb24gKHBhdGhzTm90Rm91bmQpIHtcbiAgICAvLyBzdWNjZXNzIGFuZCBlcnJvciBjYWxsYmFja3NcbiAgICBpZiAocGF0aHNOb3RGb3VuZC5sZW5ndGgpIChhcmdzLmVycm9yIHx8IGRldm51bGwpKHBhdGhzTm90Rm91bmQpO1xuICAgIGVsc2UgKGFyZ3Muc3VjY2VzcyB8fCBkZXZudWxsKSgpO1xuXG4gICAgLy8gcHVibGlzaCBidW5kbGUgbG9hZCBldmVudFxuICAgIHB1Ymxpc2goYnVuZGxlSWQsIHBhdGhzTm90Rm91bmQpO1xuICB9LCBhcmdzKTtcbn1cblxuXG4vKipcbiAqIEV4ZWN1dGUgY2FsbGJhY2tzIHdoZW4gZGVwZW5kZW5jaWVzIGhhdmUgYmVlbiBzYXRpc2ZpZWQuXG4gKiBAcGFyYW0geyhzdHJpbmd8c3RyaW5nW10pfSBkZXBzIC0gTGlzdCBvZiBidW5kbGUgaWRzXG4gKiBAcGFyYW0ge09iamVjdH0gYXJncyAtIHN1Y2Nlc3MvZXJyb3IgYXJndW1lbnRzXG4gKi9cbmxvYWRqcy5yZWFkeSA9IGZ1bmN0aW9uIHJlYWR5KGRlcHMsIGFyZ3MpIHtcbiAgLy8gc3Vic2NyaWJlIHRvIGJ1bmRsZSBsb2FkIGV2ZW50XG4gIHN1YnNjcmliZShkZXBzLCBmdW5jdGlvbiAoZGVwc05vdEZvdW5kKSB7XG4gICAgLy8gZXhlY3V0ZSBjYWxsYmFja3NcbiAgICBpZiAoZGVwc05vdEZvdW5kLmxlbmd0aCkgKGFyZ3MuZXJyb3IgfHwgZGV2bnVsbCkoZGVwc05vdEZvdW5kKTtcbiAgICBlbHNlIChhcmdzLnN1Y2Nlc3MgfHwgZGV2bnVsbCkoKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGxvYWRqcztcbn07XG5cblxuLyoqXG4gKiBNYW51YWxseSBzYXRpc2Z5IGJ1bmRsZSBkZXBlbmRlbmNpZXMuXG4gKiBAcGFyYW0ge3N0cmluZ30gYnVuZGxlSWQgLSBUaGUgYnVuZGxlIGlkXG4gKi9cbmxvYWRqcy5kb25lID0gZnVuY3Rpb24gZG9uZShidW5kbGVJZCkge1xuICBwdWJsaXNoKGJ1bmRsZUlkLCBbXSk7XG59O1xuXG5cbi8qKlxuICogUmVzZXQgbG9hZGpzIGRlcGVuZGVuY2llcyBzdGF0dXNlc1xuICovXG5sb2FkanMucmVzZXQgPSBmdW5jdGlvbiByZXNldCgpIHtcbiAgYnVuZGxlSWRDYWNoZSA9IHt9O1xuICBidW5kbGVSZXN1bHRDYWNoZSA9IHt9O1xuICBidW5kbGVDYWxsYmFja1F1ZXVlID0ge307XG59O1xuXG5cbi8vIGV4cG9ydFxucmV0dXJuIGxvYWRqcztcblxufSkpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2xvYWRqcy9kaXN0L2xvYWRqcy51bWQuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICcuLi9jc3MvbWFpbi5zY3NzJztcblxuY29uc3QgbG9hZCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9sb2FkZXInKSh7XG5cdCdqcXVlcnknIDoge2ZpbGVzOlsnLy9jb2RlLmpxdWVyeS5jb20vanF1ZXJ5LTMuMS4xLnNsaW0uanMnXX0sXG5cdCdzZWxlY3QyJzoge2ZpbGVzOlsnLy9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvc2VsZWN0Mi80LjAuMy9qcy9zZWxlY3QyLm1pbi5qcyddLCBkZXBzOlsnanF1ZXJ5J119LFxufSk7XG5cblxubG9hZC5rZXkoJ2pxdWVyeScsIGZ1bmN0aW9uKCl7XG5cdGNvbnNvbGUubG9nKCdqcXVlcnkgbG9hZGVkJylcbn0pXG5cbmxvYWQua2V5KCdzZWxlY3QyJywgZnVuY3Rpb24oKXtcblx0Y29uc29sZS5sb2coJ3NlbGVjdDIgbG9hZGVkJylcbn0pXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvYXBwLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==