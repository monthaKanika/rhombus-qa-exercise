/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 736
(module, __unused_webpack_exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(6585);
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		const split = (typeof namespaces === 'string' ? namespaces : '')
			.trim()
			.replace(/\s+/g, ',')
			.split(',')
			.filter(Boolean);

		for (const ns of split) {
			if (ns[0] === '-') {
				createDebug.skips.push(ns.slice(1));
			} else {
				createDebug.names.push(ns);
			}
		}
	}

	/**
	 * Checks if the given string matches a namespace template, honoring
	 * asterisks as wildcards.
	 *
	 * @param {String} search
	 * @param {String} template
	 * @return {Boolean}
	 */
	function matchesTemplate(search, template) {
		let searchIndex = 0;
		let templateIndex = 0;
		let starIndex = -1;
		let matchIndex = 0;

		while (searchIndex < search.length) {
			if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === '*')) {
				// Match character or proceed with wildcard
				if (template[templateIndex] === '*') {
					starIndex = templateIndex;
					matchIndex = searchIndex;
					templateIndex++; // Skip the '*'
				} else {
					searchIndex++;
					templateIndex++;
				}
			} else if (starIndex !== -1) { // eslint-disable-line no-negated-condition
				// Backtrack to the last '*' and try to match more characters
				templateIndex = starIndex + 1;
				matchIndex++;
				searchIndex = matchIndex;
			} else {
				return false; // No match
			}
		}

		// Handle trailing '*' in template
		while (templateIndex < template.length && template[templateIndex] === '*') {
			templateIndex++;
		}

		return templateIndex === template.length;
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names,
			...createDebug.skips.map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		for (const skip of createDebug.skips) {
			if (matchesTemplate(name, skip)) {
				return false;
			}
		}

		for (const ns of createDebug.names) {
			if (matchesTemplate(name, ns)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ },

/***/ 2153
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   V: () => (/* binding */ Logger)
/* harmony export */ });
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7833);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);

class Logger {
    constructor(namespace) {
        this.namespace = namespace;
    }
    debug(debugMessage) {
        const namespace = debugMessage.methodName ? `${this.namespace}:${debugMessage.methodName}` : this.namespace;
        if (debugMessage.message) {
            debug__WEBPACK_IMPORTED_MODULE_0___default()(namespace)(debugMessage.message);
        }
        if (debugMessage.object) {
            debug__WEBPACK_IMPORTED_MODULE_0___default()(namespace)(debugMessage.object);
        }
    }
}


/***/ },

/***/ 6585
(module) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ },

/***/ 7833
(module, exports, __webpack_require__) {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	let m;

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	// eslint-disable-next-line no-return-assign
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug') || exports.storage.getItem('DEBUG') ;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = "MISSING_ENV_VAR".DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(736)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Logger = (__webpack_require__(2153)/* .Logger */ .V);
const logger = new Logger("ext:ContentScripts:Sling:sling_injected");
/**
 * Sling page-world bridge around the Bitmovin player (window.__player).
 *
 * - Captures the player instance by hooking the bitmovin.player.Player constructor.
 * - Monkey-patches play / pause / seek on the instance so user actions from Sling's own UI
 *   are reported immediately as "PlayerEvent"s. Calls issued by Teleparty are not reported.
 * - Answers "poll" requests with the player's playback state / position ("UpdateState").
 */
window.seekScriptLoaded = true;
window.offset = 0;
window.injectScriptLoaded = true;
window.teleparty = window.teleparty || {};
window.teleparty.injectScriptLoaded = true;
const PLAYER_HOOK_MARK = "__patchedByExtension";
const PLAYER_ORIGINAL_MARK = "__originalBitmovinPlayer";
const TP_PATCHED = "__tpSlingPatched";
const PLAYER_REFRESH_MS = 500;
const PLAYBACK_METADATA_SELECTOR = "[data-testid='playback-metadata-1']";
const MAX_DAYS_BACK_FOR_UNIX_RESOLUTION = 14;
const MAX_PROGRAM_LENGTH_MS = 8 * 60 * 60 * 1000;
function getPlaybackMetadataText() {
    var _a, _b;
    return ((_b = (_a = document.querySelector(PLAYBACK_METADATA_SELECTOR)) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || null;
}
function extractLikelyTimeRange(text) {
    if (!text || typeof text !== "string") {
        return null;
    }
    const match = text.match(/(\d{1,2}(?::\d{1,2})?\s*(?:AM|PM)?\s*[-–—]\s*\d{1,2}(?::\d{1,2})?\s*(?:AM|PM)?)/i);
    return match ? match[1] : text;
}
function parseClockValue(value) {
    if (!value || typeof value !== "string") {
        return null;
    }
    const normalized = value.trim().toUpperCase().replace(/\./g, "").replace(/\s+/g, "");
    // Supports:
    // 8PM
    // 8:30PM
    // 8
    // 8:30
    // 08:30
    const match = normalized.match(/^(\d{1,2})(?::(\d{1,2}))?(AM|PM)?$/);
    if (!match) {
        return null;
    }
    const hour = parseInt(match[1], 10);
    const minute = parseInt(match[2] || "0", 10);
    const meridiem = match[3] || null;
    if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
        return null;
    }
    let hour24 = hour;
    if (meridiem != null) {
        if (meridiem === "AM") {
            if (hour === 12) {
                hour24 = 0;
            }
        }
        else if (hour !== 12) {
            hour24 = hour + 12;
        }
    }
    return {
        hour,
        hour24,
        minute,
        meridiem,
        explicitMeridiem: meridiem != null,
    };
}
function parseTimeRangeText(text) {
    var _a, _b;
    if (!text || typeof text !== "string") {
        return null;
    }
    const cleaned = text.trim().toUpperCase().replace(/\./g, "").replace(/[–—]/g, "-").replace(/\s+/g, " ");
    const parts = cleaned.split(/\s*-\s*/);
    if (parts.length !== 2) {
        return null;
    }
    const startRaw = (_a = parts[0]) === null || _a === void 0 ? void 0 : _a.trim();
    const endRaw = (_b = parts[1]) === null || _b === void 0 ? void 0 : _b.trim();
    if (!startRaw || !endRaw) {
        return null;
    }
    let start = parseClockValue(startRaw);
    let end = parseClockValue(endRaw);
    if (!start || !end) {
        return null;
    }
    const inferWithMeridiem = (parsedValue, meridiem) => {
        if (!parsedValue || parsedValue.meridiem || !meridiem) {
            return parsedValue;
        }
        const minutesPart = parsedValue.minute ? `:${String(parsedValue.minute).padStart(2, "0")}` : "";
        return parseClockValue(`${parsedValue.hour}${minutesPart}${meridiem}`);
    };
    // Example: 8-9PM => 8PM-9PM
    if (!start.meridiem && end.meridiem) {
        start = inferWithMeridiem(start, end.meridiem);
    }
    // Example: 8PM-9 => 8PM-9PM
    // Example: 11PM-1 => 11PM-1AM
    if (start.meridiem && !end.meridiem) {
        end = inferWithMeridiem(end, start.meridiem);
        if (end) {
            const startMinutes = start.hour24 * 60 + start.minute;
            const endMinutes = end.hour24 * 60 + end.minute;
            if (endMinutes <= startMinutes) {
                const opposite = start.meridiem === "AM" ? "PM" : "AM";
                const maybeOpposite = inferWithMeridiem(parseClockValue(endRaw), opposite);
                if (maybeOpposite) {
                    const oppositeMinutes = maybeOpposite.hour24 * 60 + maybeOpposite.minute;
                    if (oppositeMinutes !== startMinutes) {
                        end = maybeOpposite;
                    }
                }
            }
        }
    }
    if (!start.meridiem && !end.meridiem) {
        return null;
    }
    if (!start.meridiem || !end.meridiem) {
        return null;
    }
    return {
        raw: cleaned,
        start,
        end,
    };
}
function looksLikeUnixTime(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return false;
    }
    if (value > 1000000000000 && value < 10000000000000) {
        return "ms";
    }
    if (value > 1000000000 && value < 10000000000) {
        return "s";
    }
    return false;
}
function normalizePossiblyUnixTimeToMs(value) {
    const unixType = looksLikeUnixTime(value);
    if (unixType === "ms") {
        return Math.round(value);
    }
    if (unixType === "s") {
        return Math.round(value * 1000);
    }
    return null;
}
function normalizePlayerCurrentTimeRaw(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return undefined;
    }
    const unixMs = normalizePossiblyUnixTimeToMs(value);
    if (unixMs != null) {
        return {
            raw: value,
            normalizedMs: unixMs,
            kind: "unix",
            unixPrecision: looksLikeUnixTime(value),
        };
    }
    return {
        raw: value,
        normalizedMs: Math.round(value * 1000),
        kind: "playback-seconds",
        unixPrecision: null,
    };
}
function makeLocalDateForClock(baseDate, hour24, minute) {
    return new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), hour24, minute, 0, 0);
}
function resolveProgramStartFromUnixTime({ metadataText, currentVideoTime, maxDaysBack = MAX_DAYS_BACK_FOR_UNIX_RESOLUTION, maxProgramLengthMs = MAX_PROGRAM_LENGTH_MS, }) {
    const parsed = parseTimeRangeText(extractLikelyTimeRange(metadataText));
    if (!parsed) {
        return null;
    }
    const currentUnixMs = normalizePossiblyUnixTimeToMs(currentVideoTime);
    if (currentUnixMs == null) {
        return null;
    }
    const currentDate = new Date(currentUnixMs);
    for (let daysBack = 0; daysBack <= maxDaysBack; daysBack++) {
        const probeDate = new Date(currentDate);
        probeDate.setDate(probeDate.getDate() - daysBack);
        const candidateStart = makeLocalDateForClock(probeDate, parsed.start.hour24, parsed.start.minute).getTime();
        let candidateEnd = makeLocalDateForClock(probeDate, parsed.end.hour24, parsed.end.minute).getTime();
        if (candidateEnd <= candidateStart) {
            candidateEnd += 24 * 60 * 60 * 1000;
        }
        const scheduledDurationMs = candidateEnd - candidateStart;
        if (scheduledDurationMs <= 0 || scheduledDurationMs > maxProgramLengthMs) {
            continue;
        }
        if (candidateStart > currentUnixMs) {
            continue;
        }
        const deltaFromStartMs = currentUnixMs - candidateStart;
        if (deltaFromStartMs < 0 || deltaFromStartMs > maxProgramLengthMs) {
            continue;
        }
        return {
            resolved: true,
            inferredFrom: "unix-current-time",
            metadataText: parsed.raw,
            startTimeUnixMs: candidateStart,
            endTimeUnixMs: candidateEnd,
            currentTimeUnixMs: currentUnixMs,
            deltaFromStartMs,
            daysBack,
            scheduledDurationMs,
        };
    }
    return null;
}
function resolveProgramTiming({ metadataText, currentVideoTime, fallbackPlaybackPositionMs, maxDaysBack = MAX_DAYS_BACK_FOR_UNIX_RESOLUTION, }) {
    const parsed = parseTimeRangeText(extractLikelyTimeRange(metadataText));
    if (!parsed) {
        return {
            resolved: false,
            reason: "metadata-unparseable",
            metadataText,
        };
    }
    const unixResolved = resolveProgramStartFromUnixTime({
        metadataText,
        currentVideoTime,
        maxDaysBack,
    });
    if (unixResolved) {
        return unixResolved;
    }
    const playbackPositionMs = typeof fallbackPlaybackPositionMs === "number" && Number.isFinite(fallbackPlaybackPositionMs)
        ? Math.round(fallbackPlaybackPositionMs)
        : null;
    if (playbackPositionMs != null) {
        return {
            resolved: true,
            inferredFrom: "playback-offset",
            metadataText: parsed.raw,
            startTimeUnixMs: null,
            endTimeUnixMs: null,
            currentTimeUnixMs: null,
            deltaFromStartMs: playbackPositionMs,
            daysBack: null,
            scheduledDurationMs: null,
        };
    }
    return {
        resolved: false,
        reason: "no-usable-current-time",
        metadataText: parsed.raw,
    };
}
// --- Player discovery / constructor hook ---
function isUsablePlayer(candidate) {
    return !!candidate && typeof candidate.getCurrentTime === "function" && typeof candidate.seek === "function";
}
function findExistingBitmovinPlayer() {
    var _a, _b, _c, _d, _e;
    if (isUsablePlayer(window.__player)) {
        return window.__player;
    }
    try {
        const players = ((_b = (_a = window.bitmovin) === null || _a === void 0 ? void 0 : _a.player) === null || _b === void 0 ? void 0 : _b.players) || ((_e = (_d = (_c = window.bitmovin) === null || _c === void 0 ? void 0 : _c.player) === null || _d === void 0 ? void 0 : _d.Player) === null || _e === void 0 ? void 0 : _e.players);
        if (players && typeof players === "object") {
            const candidate = Object.values(players).find(isUsablePlayer);
            if (candidate) {
                window.__player = candidate;
                return candidate;
            }
        }
    }
    catch (error) {
        logger.debug({
            methodName: "findExistingBitmovinPlayer",
            message: `Error probing players registry: ${error.message}`,
        });
    }
    try {
        const video = document.querySelector("video");
        if (video) {
            const candidate = Object.keys(video)
                .map((key) => video[key])
                .find(isUsablePlayer);
            if (candidate) {
                window.__player = candidate;
                return candidate;
            }
        }
    }
    catch (error) {
        logger.debug({
            methodName: "findExistingBitmovinPlayer",
            message: `Error probing video element: ${error.message}`,
        });
    }
    return null;
}
function createPatchedPlayer(CurrentPlayer) {
    if (!CurrentPlayer || CurrentPlayer[PLAYER_HOOK_MARK]) {
        return CurrentPlayer;
    }
    function PatchedPlayer(...args) {
        const instance = new CurrentPlayer(...args);
        window.__player = instance;
        logger.debug({
            methodName: "createPatchedPlayer",
            message: "Captured Bitmovin player instance on window.__player",
        });
        setTimeout(refreshPlayer, 0);
        return instance;
    }
    PatchedPlayer[PLAYER_HOOK_MARK] = true;
    PatchedPlayer[PLAYER_ORIGINAL_MARK] = CurrentPlayer;
    PatchedPlayer.prototype = CurrentPlayer.prototype;
    try {
        Object.setPrototypeOf(PatchedPlayer, CurrentPlayer);
    }
    catch (error) {
        logger.debug({
            methodName: "createPatchedPlayer",
            message: `Failed to set prototype: ${error.message}`,
        });
    }
    return PatchedPlayer;
}
function installPersistentBitmovinHook() {
    const tryInstallSetter = () => {
        var _a;
        const playerObj = (_a = window.bitmovin) === null || _a === void 0 ? void 0 : _a.player;
        if (!playerObj || playerObj.__extensionPlayerSetterInstalled) {
            return;
        }
        let internalPlayerValue = createPatchedPlayer(playerObj.Player);
        Object.defineProperty(playerObj, "Player", {
            configurable: true,
            enumerable: true,
            get() {
                return internalPlayerValue;
            },
            set(value) {
                internalPlayerValue = createPatchedPlayer(value);
            },
        });
        playerObj.__extensionPlayerSetterInstalled = true;
        logger.debug({
            methodName: "installPersistentBitmovinHook",
            message: "Installed persistent Bitmovin Player hook",
        });
    };
    tryInstallSetter();
    return setInterval(tryInstallSetter, 250);
}
// --- Player state ---
/** @type {any} */
let player = null;
/** > 0 while Teleparty itself is driving the player, so patched methods don't report it as a user action. */
let tpCallDepth = 0;
let stalled = false;
let adBreakActive = false;
/**
 * Sling unloads and reloads the source on every resume and seekbar seek. That loading is not network
 * buffering and must not be reported to the party as such. Set on sourceunloaded, cleared on playing.
 */
let reloadingSince = 0;
const RELOAD_MAX_MS = 15000;
/** @type {{
 *   playbackState: "playing" | "paused" | "loading",
 *   currentTime: number | null,
 *   duration: number,
 *   adPlaying: boolean,
 *   isLive: boolean,
 *   timeKind: "playback" | "unix" | "video" | null,
 *   hasPlayer: boolean,
 *   updatedAt: number
 * }} */
let playerState = {
    playbackState: "paused",
    currentTime: null,
    duration: 0,
    adPlaying: false,
    isLive: false,
    timeKind: null,
    hasPlayer: false,
    updatedAt: 0,
};
function getVideoElement() {
    const videos = Array.from(document.querySelectorAll("video"));
    if (videos.length <= 1) {
        return videos[0] || null;
    }
    return videos.find((video) => !!(video.currentSrc || video.src)) || videos[0];
}
function safeCall(fn, fallback) {
    try {
        return fn();
    }
    catch (_a) {
        return fallback;
    }
}
function readPlaybackState(p, video) {
    if (stalled || safeCall(() => { var _a; return (_a = p === null || p === void 0 ? void 0 : p.isStalled) === null || _a === void 0 ? void 0 : _a.call(p); }, false) === true) {
        return "loading";
    }
    const paused = p && typeof p.isPaused === "function" ? safeCall(() => p.isPaused(), video === null || video === void 0 ? void 0 : video.paused) : video === null || video === void 0 ? void 0 : video.paused;
    if (paused !== false) {
        return "paused";
    }
    if (video && (video.readyState < video.HAVE_FUTURE_DATA || video.seeking)) {
        return "loading";
    }
    return "playing";
}
function readPosition(p, video) {
    const raw = p ? safeCall(() => p.getCurrentTime(), undefined) : undefined;
    const normalized = normalizePlayerCurrentTimeRaw(raw);
    if ((normalized === null || normalized === void 0 ? void 0 : normalized.kind) === "unix") {
        // Live: getCurrentTime() is wall-clock. Convert to an offset from the program start.
        const resolved = resolveProgramTiming({
            metadataText: getPlaybackMetadataText(),
            currentVideoTime: normalized.raw,
            fallbackPlaybackPositionMs: undefined,
        });
        return {
            currentTime: (resolved === null || resolved === void 0 ? void 0 : resolved.resolved) ? resolved.deltaFromStartMs : null,
            timeKind: "unix",
        };
    }
    if (normalized) {
        return { currentTime: normalized.normalizedMs, timeKind: "playback" };
    }
    if (video && Number.isFinite(video.currentTime) && video.currentTime >= 0) {
        return { currentTime: Math.round(video.currentTime * 1000), timeKind: "video" };
    }
    return { currentTime: null, timeKind: null };
}
function poll() {
    const p = player || findExistingBitmovinPlayer();
    const video = getVideoElement();
    const { currentTime, timeKind } = readPosition(p, video);
    let duration = playerState.duration;
    const rawDuration = p ? safeCall(() => p.getDuration(), undefined) : video === null || video === void 0 ? void 0 : video.duration;
    if (typeof rawDuration === "number" && Number.isFinite(rawDuration) && rawDuration > 0) {
        duration = Math.round(rawDuration * 1000);
    }
    // Only wall-clock streams count as live: Bitmovin's isLive() is also true for Sling's DVR-style
    // program streams, which are seekable on a normal playback timeline.
    const isLive = timeKind === "unix";
    const adPlaying = adBreakActive || (p ? safeCall(() => { var _a, _b; return (_b = (_a = p.ads) === null || _a === void 0 ? void 0 : _a.isLinearAdActive) === null || _b === void 0 ? void 0 : _b.call(_a); }, false) === true : false);
    playerState = {
        playbackState: readPlaybackState(p, video),
        currentTime,
        duration,
        adPlaying,
        isLive,
        timeKind,
        hasPlayer: !!p,
        reloading: reloadingSince > 0 && Date.now() - reloadingSince < RELOAD_MAX_MS,
        updatedAt: Date.now(),
    };
    return playerState;
}
function emitFromNode(detail) {
    window.dispatchEvent(new CustomEvent("FromNode", { detail }));
}
function emitUpdateState(requestId) {
    emitFromNode(Object.assign(Object.assign({ type: "UpdateState" }, playerState), { requestId }));
}
function emitPlayerEvent(action, extra) {
    emitFromNode(Object.assign({ type: "PlayerEvent", action, playbackState: playerState.playbackState, currentTime: playerState.currentTime, adPlaying: playerState.adPlaying, updatedAt: Date.now() }, (extra || {})));
}
// --- Monkey patch play / pause / seek + player events ---
function onUserPlay() {
    playerState = Object.assign(Object.assign({}, playerState), { playbackState: "playing", updatedAt: Date.now() });
    emitPlayerEvent("play");
}
function onUserPause() {
    playerState = Object.assign(Object.assign({}, playerState), { playbackState: "paused", updatedAt: Date.now() });
    emitPlayerEvent("pause");
}
function onUserSeek(seconds) {
    const normalized = normalizePlayerCurrentTimeRaw(Number(seconds));
    // Wall-clock seeks on live streams can't be mapped onto the party timeline.
    if (!normalized || normalized.kind === "unix" || playerState.timeKind === "unix") {
        return;
    }
    playerState = Object.assign(Object.assign({}, playerState), { currentTime: normalized.normalizedMs, updatedAt: Date.now() });
    emitPlayerEvent("seek", { seekTargetMs: normalized.normalizedMs });
}
function patchControlMethod(p, name, onUserCall) {
    if (typeof p[name] !== "function" || p[name][TP_PATCHED]) {
        return;
    }
    const original = p[name];
    const wrapped = function (...args) {
        // Sling's app calls play() itself (autoplay, after every source reload, to re-assert its own
        // state). Only calls made while the page has transient user activation are user actions.
        const userInitiated = navigator.userActivation ? navigator.userActivation.isActive : true;
        if (tpCallDepth === 0 && userInitiated) {
            try {
                onUserCall(...args);
            }
            catch (error) {
                logger.debug({ methodName: "patchControlMethod", message: `${name} hook error: ${error.message}` });
            }
        }
        return original.apply(this, args);
    };
    wrapped[TP_PATCHED] = true;
    try {
        Object.defineProperty(p, name, { configurable: true, writable: true, value: wrapped });
    }
    catch (_a) {
        p[name] = wrapped;
    }
}
function subscribePlayerEvents(p) {
    if (typeof p.on !== "function") {
        return;
    }
    const listen = (eventName, handler) => {
        try {
            p.on(eventName, handler);
        }
        catch (error) {
            logger.debug({ methodName: "subscribePlayerEvents", message: `${eventName}: ${error.message}` });
        }
    };
    listen("stallstarted", () => {
        stalled = true;
        poll();
        emitPlayerEvent("bufferingStart");
    });
    listen("stallended", () => {
        stalled = false;
        poll();
        emitPlayerEvent("bufferingEnd");
    });
    listen("adbreakstarted", () => {
        adBreakActive = true;
        poll();
        emitUpdateState();
    });
    listen("adbreakfinished", () => {
        adBreakActive = false;
        poll();
        emitUpdateState();
    });
    listen("playing", () => {
        reloadingSince = 0;
    });
    listen("sourceunloaded", () => {
        reloadingSince = Date.now();
        stalled = false;
        adBreakActive = false;
    });
}
function attachPlayer(p) {
    if (p === player) {
        return;
    }
    player = p;
    stalled = false;
    adBreakActive = false;
    if (!p) {
        return;
    }
    patchControlMethod(p, "play", onUserPlay);
    patchControlMethod(p, "pause", onUserPause);
    patchControlMethod(p, "seek", onUserSeek);
    subscribePlayerEvents(p);
    logger.debug({ methodName: "attachPlayer", message: "Patched Bitmovin player play/pause/seek" });
    poll();
}
function refreshPlayer() {
    attachPlayer(findExistingBitmovinPlayer());
}
// --- Commands from the content script ---
function runAsTeleparty(fn) {
    tpCallDepth += 1;
    try {
        return fn();
    }
    finally {
        tpCallDepth -= 1;
    }
}
/**
 * Clicks Sling's own play/pause button. Going through Sling's UI keeps its app state in sync —
 * calling player.pause() directly gets undone because Sling immediately calls play() again.
 */
function clickSlingButton(testId) {
    const button = document.querySelector(`[data-testid="${testId}"]`);
    if (!button) {
        return false;
    }
    button.click();
    return true;
}
function doPlay() {
    refreshPlayer();
    return runAsTeleparty(() => {
        if (clickSlingButton("player-button-play")) {
            return true;
        }
        if (player && typeof player.play === "function") {
            const result = player.play();
            if (result && typeof result.catch === "function") {
                result.catch((error) => logger.debug({ methodName: "doPlay", message: `${error === null || error === void 0 ? void 0 : error.message}` }));
            }
            return true;
        }
        const video = getVideoElement();
        if (video) {
            video.play().catch(() => undefined);
            return true;
        }
        return false;
    });
}
function doPause() {
    refreshPlayer();
    return runAsTeleparty(() => {
        if (clickSlingButton("player-button-pause")) {
            return true;
        }
        if (player && typeof player.pause === "function") {
            player.pause();
            return true;
        }
        const video = getVideoElement();
        if (video) {
            video.pause();
            return true;
        }
        return false;
    });
}
function doSeek(positionMs) {
    const ms = Number(positionMs);
    if (!Number.isFinite(ms) || ms < 0) {
        return { ok: false, reason: "invalid_position" };
    }
    refreshPlayer();
    poll();
    if (playerState.timeKind === "unix") {
        return { ok: false, reason: "live_wallclock" };
    }
    // Sling loads a window of the program; seeking outside it makes Bitmovin clamp to the window edge.
    // The content script then falls back to Sling's seekbar, which reloads the source at the target.
    const range = player ? safeCall(() => { var _a; return (_a = player.getSeekableRange) === null || _a === void 0 ? void 0 : _a.call(player); }, null) : null;
    const targetSeconds = ms / 1000;
    if (range && Number.isFinite(range.start) && Number.isFinite(range.end)) {
        if (targetSeconds < range.start - 1 || targetSeconds > range.end + 1) {
            return { ok: false, reason: "outside_seekable_range" };
        }
    }
    return runAsTeleparty(() => {
        if (player && typeof player.seek === "function") {
            const accepted = player.seek(targetSeconds);
            return accepted === false ? { ok: false, reason: "seek_rejected" } : { ok: true, reason: null };
        }
        const video = getVideoElement();
        if (video) {
            video.currentTime = ms / 1000;
            return { ok: true, reason: null };
        }
        return { ok: false, reason: "no_player" };
    });
}
function findNavigator() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const element = document.querySelector(".base-screen");
    if (element == null) {
        return null;
    }
    const key = Object.keys(element).find((k) => k.startsWith("__reactFiber"));
    if (key == null) {
        return null;
    }
    try {
        return (_r = (_q = (_p = (_o = (_m = (_l = (_k = (_j = (_h = (_g = (_f = (_e = (_d = (_c = (_b = (_a = element[key]) === null || _a === void 0 ? void 0 : _a.alternate) === null || _b === void 0 ? void 0 : _b.child) === null || _c === void 0 ? void 0 : _c.child) === null || _d === void 0 ? void 0 : _d.alternate) === null || _e === void 0 ? void 0 : _e.child) === null || _f === void 0 ? void 0 : _f.dependencies) === null || _g === void 0 ? void 0 : _g.firstContext) === null || _h === void 0 ? void 0 : _h.next) === null || _j === void 0 ? void 0 : _j.next) === null || _k === void 0 ? void 0 : _k.next) === null || _l === void 0 ? void 0 : _l.next) === null || _m === void 0 ? void 0 : _m.next) === null || _o === void 0 ? void 0 : _o.next) === null || _p === void 0 ? void 0 : _p.next) === null || _q === void 0 ? void 0 : _q.memoizedValue) === null || _r === void 0 ? void 0 : _r.navigator;
    }
    catch (error) {
        logger.debug({ methodName: "findNavigator", message: `Error accessing navigator: ${error.message}` });
        return null;
    }
}
function doNextEpisode(path) {
    const nextButton = document.querySelector(".skipToLiveFocused");
    if (nextButton) {
        nextButton.click();
        return;
    }
    const navigator = findNavigator();
    if (navigator && navigator.push) {
        try {
            navigator.push(path);
            return;
        }
        catch (_a) {
            // fall through to hard navigation
        }
    }
    if (path) {
        window.location.href = path;
    }
}
window.addEventListener("SlingVideoMessage", function (evt) {
    const detail = evt.detail || {};
    switch (detail.type) {
        case "poll": {
            refreshPlayer();
            poll();
            emitUpdateState(detail.requestId);
            break;
        }
        case "play": {
            const ok = doPlay();
            emitFromNode({ type: "ActionResult", action: "play", ok, requestId: detail.requestId });
            break;
        }
        case "pause": {
            const ok = doPause();
            emitFromNode({ type: "ActionResult", action: "pause", ok, requestId: detail.requestId });
            break;
        }
        case "seek": {
            const result = doSeek(detail.positionMs);
            emitFromNode({
                type: "ActionResult",
                action: "seek",
                ok: result.ok,
                reason: result.reason,
                positionMs: Number(detail.positionMs),
                requestId: detail.requestId,
            });
            break;
        }
        case "nextEpisode": {
            doNextEpisode(detail.path);
            break;
        }
    }
});
window.__tpGetSlingPlayer = function () {
    return player || findExistingBitmovinPlayer();
};
installPersistentBitmovinHook();
refreshPlayer();
setInterval(refreshPlayer, PLAYER_REFRESH_MS);
console.log("SLING INJECTED SCRIPT");

})();

/******/ })()
;