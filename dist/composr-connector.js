(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["composrCR"] = factory();
	else
		root["composrCR"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _utils = __webpack_require__(1);
	
	Object.keys(_utils).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _utils[key];
	    }
	  });
	});
	
	var _AuthRequest = __webpack_require__(5);
	
	Object.defineProperty(exports, 'AuthRequest', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_AuthRequest).default;
	  }
	});
	
	var _AuthPersist = __webpack_require__(6);
	
	Object.defineProperty(exports, 'AuthPersist', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_AuthPersist).default;
	  }
	});
	
	var _AuthConnector = __webpack_require__(7);
	
	Object.defineProperty(exports, 'AuthConnector', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_AuthConnector).default;
	  }
	});
	
	var _Connect = __webpack_require__(8);
	
	Object.defineProperty(exports, 'Connect', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Connect).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.jwt = undefined;
	
	var _events = __webpack_require__(2);
	
	Object.keys(_events).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _events[key];
	    }
	  });
	});
	exports.buildURI = buildURI;
	exports.checkStatus = checkStatus;
	exports.generateUUID = generateUUID;
	
	var _jwt = __webpack_require__(3);
	
	var jwt = _interopRequireWildcard(_jwt);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function buildURI(urlBase) {
	  return urlBase.replace('{{module}}', 'composr');
	}
	
	function checkStatus(response) {
	  if (response.ok) {
	    return response.json().catch(function () {
	      return response;
	    });
	  }
	
	  var error = new Error(response.statusText);
	  error.status = response.status;
	  error.response = response;
	  throw error;
	}
	
	function generateUUID() {
	  var d = new Date().getTime();
	  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	    var r = (d + Math.random() * 16) % 16 | 0;
	    d = Math.floor(d / 16);
	    return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
	  });
	  return uuid;
	}
	
	exports.jwt = jwt;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// Based on David Walsh's pub-sub implementation
	// https://davidwalsh.name/pubsub-javascript
	
	var topics = {};
	var hOP = topics.hasOwnProperty;
	
	var events = exports.events = {
	  subscribe: function subscribe(topic, listener) {
	    // Create the topic's object if not yet created
	    if (!hOP.call(topics, topic)) {
	      topics[topic] = [];
	    }
	
	    // Add the listener to queue
	    var index = topics[topic].push(listener) - 1;
	
	    // Provide handle back for removal of topic
	    return {
	      remove: function remove() {
	        delete topics[topic][index];
	      }
	    };
	  },
	  publish: function publish(topic, info) {
	    // If the topic doesn't exist, or there's no listeners in queue, just leave
	    if (!hOP.call(topics, topic)) {
	      return;
	    }
	
	    // Cycle through topics queue, fire!
	    topics[topic].forEach(function (item) {
	      item(info != undefined ? info : {});
	    });
	  }
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.generate = generate;
	exports.decode = decode;
	
	var _cryptography = __webpack_require__(4);
	
	var cryptography = _interopRequireWildcard(_cryptography);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	/*
	 * Extracted from Corbel-js: https://github.com/corbel-platform/corbel-js
	 * Original module: https://github.com/corbel-platform/corbel-js/blob/master/src/jwt.js
	 */
	// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
	// TODO: Use ES6 syntax
	var EXPIRATION = 3500;
	var ALGORITHM = 'HS256';
	var TYP = 'JWT';
	var VERSION = '1.0.0';
	
	/**
	 * JWT-HmacSHA256 generator
	 * http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html
	 *
	 * @param  {Object}                                 claims Specific claims to include in the JWT (iss, aud, exp, scope, ...)
	 * @param  {String} secret                          String with the client assigned secret
	 * @param  {Object} [alg='corbel.jwt.ALGORITHM']    Object with the algorithm type
	 * @return {String} jwt                             JWT string
	 */
	function generate(claims, secret, alg) {
	  claims = claims || {};
	  claims.exp = claims.exp || _generateExp();
	
	  if (!claims.iss) {
	    throw new Error('jwt:undefined:iss');
	  }
	  if (!claims.aud) {
	    throw new Error('jwt:undefined:aud');
	  }
	
	  return _generate(claims, secret, alg);
	}
	
	function decode(assertion) {
	  var decoded = assertion.split('.');
	
	  try {
	    decoded[0] = JSON.parse(atob(decoded[0]));
	  } catch (e) {
	    decoded[0] = false;
	  }
	
	  try {
	    decoded[1] = JSON.parse(atob(decoded[1]));
	  } catch (e) {
	    decoded[1] = false;
	  }
	
	  if (!decoded[0] && !decoded[1]) {
	    throw new Error('corbel:jwt:decode:invalid_assertion');
	  }
	
	  decoded[0] = decoded[0] || {};
	  decoded[1] = decoded[1] || {};
	
	  Object.keys(decoded[1]).forEach(function (key) {
	    decoded[0][key] = decoded[1][key];
	  });
	
	  return decoded[0];
	}
	
	function _generate(claims, secret, alg) {
	  alg = alg || ALGORITHM;
	
	  // Ensure claims specific order
	  var claimsKeys = ['iss', 'aud', 'exp', 'scope', 'prn', 'version', 'refresh_token', 'request_domain', 'basic_auth.username', 'basic_auth.password', 'device_id'];
	
	  var finalClaims = {};
	  claimsKeys.forEach(function (key) {
	    if (claims[key]) {
	      finalClaims[key] = claims[key];
	    }
	  });
	
	  Object.assign(finalClaims, claims);
	
	  if (Array.isArray(finalClaims.scope)) {
	    finalClaims.scope = finalClaims.scope.join(' ');
	  }
	
	  var bAlg = cryptography.rstr2b64(cryptography.str2rstr_utf8(JSON.stringify({
	    typ: TYP,
	    alg: alg
	  })));
	  var bClaims = cryptography.rstr2b64(cryptography.str2rstr_utf8(JSON.stringify(finalClaims)));
	  var segment = bAlg + '.' + bClaims;
	  var assertion = cryptography.b64tob64u(cryptography.b64_hmac_sha256(secret, segment));
	
	  return segment + '.' + assertion;
	}
	
	function _generateExp() {
	  return Math.round(new Date().getTime() / 1000) + EXPIRATION;
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.b64_hmac_sha256 = b64_hmac_sha256;
	exports.rstr_hmac_sha256 = rstr_hmac_sha256;
	exports.rstr2b64 = rstr2b64;
	exports.str2rstr_utf8 = str2rstr_utf8;
	exports.rstr2binb = rstr2binb;
	exports.binb2rstr = binb2rstr;
	exports.sha256_S = sha256_S;
	exports.sha256_R = sha256_R;
	exports.sha256_Ch = sha256_Ch;
	exports.sha256_Sigma0256 = sha256_Sigma0256;
	exports.sha256_Sigma1256 = sha256_Sigma1256;
	exports.sha256_Gamma0256 = sha256_Gamma0256;
	exports.sha256_Gamma1256 = sha256_Gamma1256;
	exports.binb_sha256 = binb_sha256;
	exports.safe_add = safe_add;
	exports.Base64x = Base64x;
	exports.b64tob64u = b64tob64u;
	/*************************************************************************************************
	 * Extracted from Corbel-js: https://github.com/corbel-platform/corbel-js                        *
	 * Original module: https://github.com/corbel-platform/corbel-js/blob/master/src/cryptography.js *
	 *************************************************************************************************/
	
	/*********************************************************************************
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined *
	 * in FIPS 180-2                                                                 *
	 * Version 2.2 Copyright Angel Marin, Paul Johnston 2000 - 2009.                 *
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet                 *
	 * Distributed under the BSD License                                             *
	 * See http://pajhome.org.uk/crypt/md5 for details.                              *
	 * Also http://anmar.eu.org/projects/jssha2/                                     *
	 *********************************************************************************/
	// TODO: Use ES6 syntax
	/*
	 * Configurable variables. You may need to tweak these to be compatible with
	 * the server-side, but the defaults work in most cases.
	 */
	var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
	var b64pad = ''; /* base-64 pad character. "=" for strict RFC compliance   */
	
	/* jshint ignore:start */
	// jscs:disable
	var sha256_K = new Array(1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987, 1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885, -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872, -1866530822, -1538233109, -1090935817, -965641998);
	
	function b64_hmac_sha256(k, d) {
	  return rstr2b64(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)));
	};
	
	/*
	 * Calculate the HMAC-sha256 of a key and some data (raw strings)
	 */
	function rstr_hmac_sha256(key, data) {
	  var bkey = rstr2binb(key);
	  if (bkey.length > 16) {
	    bkey = binb_sha256(bkey, key.length * 8);
	  }
	
	  var ipad = Array(16),
	      opad = Array(16);
	  for (var i = 0; i < 16; i++) {
	    ipad[i] = bkey[i] ^ 0x36363636;
	    opad[i] = bkey[i] ^ 0x5C5C5C5C;
	  }
	
	  var hash = binb_sha256(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
	  return binb2rstr(binb_sha256(opad.concat(hash), 512 + 256));
	};
	
	/*
	 * Convert a raw string to a base-64 string
	 */
	function rstr2b64(input) {
	  try {
	    b64pad;
	  } catch (e) {
	    b64pad = '';
	  }
	  var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	  var output = '';
	  var len = input.length;
	  for (var i = 0; i < len; i += 3) {
	    var triplet = input.charCodeAt(i) << 16 | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
	    for (var j = 0; j < 4; j++) {
	      if (i * 8 + j * 6 > input.length * 8) output += b64pad;else output += tab.charAt(triplet >>> 6 * (3 - j) & 0x3F);
	    }
	  }
	  return output;
	};
	
	/*
	 * Encode a string as utf-8.
	 * For efficiency, this assumes the input is valid utf-16.
	 */
	function str2rstr_utf8(input) {
	  var output = '';
	  var i = -1;
	  var x, y;
	
	  while (++i < input.length) {
	    /* Decode utf-16 surrogate pairs */
	    x = input.charCodeAt(i);
	    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
	    if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
	      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
	      i++;
	    }
	
	    /* Encode output as utf-8 */
	    if (x <= 0x7F) output += String.fromCharCode(x);else if (x <= 0x7FF) output += String.fromCharCode(0xC0 | x >>> 6 & 0x1F, 0x80 | x & 0x3F);else if (x <= 0xFFFF) output += String.fromCharCode(0xE0 | x >>> 12 & 0x0F, 0x80 | x >>> 6 & 0x3F, 0x80 | x & 0x3F);else if (x <= 0x1FFFFF) output += String.fromCharCode(0xF0 | x >>> 18 & 0x07, 0x80 | x >>> 12 & 0x3F, 0x80 | x >>> 6 & 0x3F, 0x80 | x & 0x3F);
	  }
	  return output;
	};
	
	/*
	 * Convert a raw string to an array of big-endian words
	 * Characters >255 have their high-byte silently ignored.
	 */
	function rstr2binb(input) {
	  var output = Array(input.length >> 2);
	  for (var i = 0; i < output.length; i++) {
	    output[i] = 0;
	  }for (var i = 0; i < input.length * 8; i += 8) {
	    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << 24 - i % 32;
	  }return output;
	};
	
	/*
	 * Convert an array of big-endian words to a string
	 */
	function binb2rstr(input) {
	  var output = '';
	  for (var i = 0; i < input.length * 32; i += 8) {
	    output += String.fromCharCode(input[i >> 5] >>> 24 - i % 32 & 0xFF);
	  }return output;
	};
	
	/*
	 * Main sha256 function, with its support functions
	 */
	function sha256_S(X, n) {
	  return X >>> n | X << 32 - n;
	};
	
	function sha256_R(X, n) {
	  return X >>> n;
	};
	
	function sha256_Ch(x, y, z) {
	  return x & y ^ ~x & z;
	};
	
	function sha256_Maj(x, y, z) {
	  return x & y ^ x & z ^ y & z;
	};
	
	function sha256_Sigma0256(x) {
	  return sha256_S(x, 2) ^ sha256_S(x, 13) ^ sha256_S(x, 22);
	};
	
	function sha256_Sigma1256(x) {
	  return sha256_S(x, 6) ^ sha256_S(x, 11) ^ sha256_S(x, 25);
	};
	
	function sha256_Gamma0256(x) {
	  return sha256_S(x, 7) ^ sha256_S(x, 18) ^ sha256_R(x, 3);
	};
	
	function sha256_Gamma1256(x) {
	  return sha256_S(x, 17) ^ sha256_S(x, 19) ^ sha256_R(x, 10);
	};
	
	function binb_sha256(m, l) {
	  var HASH = new Array(1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635, 1541459225);
	  var W = new Array(64);
	  var a, b, c, d, e, f, g, h;
	  var i, j, T1, T2;
	
	  /* append padding */
	  m[l >> 5] |= 0x80 << 24 - l % 32;
	  m[(l + 64 >> 9 << 4) + 15] = l;
	
	  for (i = 0; i < m.length; i += 16) {
	    a = HASH[0];
	    b = HASH[1];
	    c = HASH[2];
	    d = HASH[3];
	    e = HASH[4];
	    f = HASH[5];
	    g = HASH[6];
	    h = HASH[7];
	
	    for (j = 0; j < 64; j++) {
	      if (j < 16) W[j] = m[j + i];else W[j] = safe_add(safe_add(safe_add(sha256_Gamma1256(W[j - 2]), W[j - 7]), sha256_Gamma0256(W[j - 15])), W[j - 16]);
	
	      T1 = safe_add(safe_add(safe_add(safe_add(h, sha256_Sigma1256(e)), sha256_Ch(e, f, g)), sha256_K[j]), W[j]);
	      T2 = safe_add(sha256_Sigma0256(a), sha256_Maj(a, b, c));
	      h = g;
	      g = f;
	      f = e;
	      e = safe_add(d, T1);
	      d = c;
	      c = b;
	      b = a;
	      a = safe_add(T1, T2);
	    }
	
	    HASH[0] = safe_add(a, HASH[0]);
	    HASH[1] = safe_add(b, HASH[1]);
	    HASH[2] = safe_add(c, HASH[2]);
	    HASH[3] = safe_add(d, HASH[3]);
	    HASH[4] = safe_add(e, HASH[4]);
	    HASH[5] = safe_add(f, HASH[5]);
	    HASH[6] = safe_add(g, HASH[6]);
	    HASH[7] = safe_add(h, HASH[7]);
	  }
	  return HASH;
	};
	
	function safe_add(x, y) {
	  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  return msw << 16 | lsw & 0xFFFF;
	};
	
	/*! base64x-1.1.3 (c) 2012-2014 Kenji Urushima | kjur.github.com/jsjws/license
	 */
	/*
	 * base64x.js - Base64url and supplementary functions for Tom Wu's base64.js library
	 *
	 * version: 1.1.3 (2014 May 25)
	 *
	 * Copyright (c) 2012-2014 Kenji Urushima (kenji.urushima@gmail.com)
	 *
	 * This software is licensed under the terms of the MIT License.
	 * http://kjur.github.com/jsjws/license/
	 *
	 * The above copyright and license notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * DEPENDS ON:
	 *   - base64.js - Tom Wu's Base64 library
	 */
	
	/**
	 * Base64URL and supplementary functions for Tom Wu's base64.js library.<br/>
	 * This class is just provide information about global functions
	 * defined in 'base64x.js'. The 'base64x.js' script file provides
	 * global functions for converting following data each other.
	 * <ul>
	 * <li>(ASCII) String</li>
	 * <li>UTF8 String including CJK, Latin and other characters</li>
	 * <li>byte array</li>
	 * <li>hexadecimal encoded String</li>
	 * <li>Full URIComponent encoded String (such like "%69%94")</li>
	 * <li>Base64 encoded String</li>
	 * <li>Base64URL encoded String</li>
	 * </ul>
	 * All functions in 'base64x.js' are defined in {@link _global_} and not
	 * in this class.
	 * Base64URL and supplementary functions for Tom Wu's base64.js library
	 *
	 * @class
	 * @author Kenji Urushima
	 * @version 1.1 (07 May 2012)
	 * @requires base64.js
	 * @see <a href="http://kjur.github.com/jsjws/">'jwjws'(JWS JavaScript Library) home page http://kjur.github.com/jsjws/</a>
	 * @see <a href="http://kjur.github.com/jsrsasigns/">'jwrsasign'(RSA Sign JavaScript Library) home page http://kjur.github.com/jsrsasign/</a>
	 */
	function Base64x() {};
	
	// ==== base64 / base64url ================================
	/**
	 * convert a Base64 encoded string to a Base64URL encoded string.<br/>
	 * Example: "ab+c3f/==" &rarr; "ab-c3f_"
	 *
	 * @param {String} s Base64 encoded string
	 * @return {String} Base64URL encoded string
	 */
	function b64tob64u(s) {
	  s = s.replace(/\=/g, '');
	  s = s.replace(/\+/g, '-');
	  s = s.replace(/\//g, '_');
	  return s;
	};
	/* jshint ignore:end */

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(1);
	
	var utils = _interopRequireWildcard(_utils);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	if (undefined && undefined.Meteor) {
	  // NOTE: this only work if it is used with the meteor package version of this library.
	
	  undefined.Headers = fetch.Headers, undefined.Request = fetch.Request;
	
	  fetch.Promise = Promise;
	}
	
	var AuthRequest = function () {
	  function AuthRequest(authConfig) {
	    _classCallCheck(this, AuthRequest);
	
	    // Init auth variables
	    this.authConfig = authConfig;
	  }
	
	  /////////////////
	  // Private API //
	  /////////////////
	
	  /**
	   * Creates a credentials object with data stored in this.authconfig
	   * and extends it with more authData (if provided)
	   *
	   * @param  {Object} authData Extended auth data (i.e. user & pass)
	   * @param  {String} scope
	   * @return {Object}
	   */
	
	
	  _createClass(AuthRequest, [{
	    key: '_createClaims',
	    value: function _createClaims(authData, scope) {
	      var _authConfig = this.authConfig;
	      var clientId = _authConfig.clientId;
	      var iamAUD = _authConfig.iamAUD;
	      var scopes = _authConfig.scopes;
	      var defaultAuthData = _authConfig.defaultAuthData;
	
	      var claims = {
	        iss: clientId,
	        aud: iamAUD,
	        scope: scopes[scope]
	      };
	
	      Object.assign(claims, defaultAuthData);
	      Object.assign(claims, authData);
	
	      return claims;
	    }
	
	    /**
	     * Generates jwt
	     *
	     * @param  {Object} claims
	     * @param  {String} clientSecret
	     * @return {String}
	     */
	
	  }, {
	    key: '_generateAssertion',
	    value: function _generateAssertion(claims, clientSecret) {
	      return utils.jwt.generate(claims, clientSecret);
	    }
	
	    /**
	     * Authenticates with composr
	     * Uses fetch (or fetch polyfill: https://github.com/github/fetch)
	     *
	     * @param  {String} endpoint     Endpoint to comunicate with
	     * @param  {Object} claims  Credentials data created with _createClaims
	     * @param  {Object} headers
	     * @return {Object} A result promise
	     */
	
	  }, {
	    key: '_authenticate',
	    value: function _authenticate(endpoint, claims, headers) {
	      var _authConfig2 = this.authConfig;
	      var endpoints = _authConfig2.endpoints;
	      var urlBase = _authConfig2.urlBase;
	      var clientSecret = _authConfig2.clientSecret;
	      var defaultHeaders = _authConfig2.defaultHeaders;
	
	      var url = utils.buildURI(urlBase) + endpoints[endpoint];
	      var jwt = this._generateAssertion(claims, clientSecret);
	      var body = {
	        jwt: jwt
	      };
	      var authenticationHeaders = {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json; charset=utf-8'
	      };
	
	      Object.assign(authenticationHeaders, defaultHeaders);
	      Object.assign(authenticationHeaders, headers);
	
	      var headersInstance = new Headers(authenticationHeaders);
	
	      var request = new Request(url, {
	        credentials: 'include',
	        mode: 'cors',
	        cache: 'no-store',
	        method: 'POST',
	        headers: headersInstance,
	        body: JSON.stringify(body)
	      });
	
	      return fetch(request).then(utils.checkStatus);
	    }
	
	    ////////////////
	    // Public API //
	    ////////////////
	
	    /**
	     * Authenticates with client scope
	     *
	     * @return {Object} Promise
	     */
	
	  }, {
	    key: 'authenticateClient',
	    value: function authenticateClient() {
	      var claims = this._createClaims({}, 'client');
	
	      this.clientAccessTokenPromise = this._authenticate('loginClient', claims);
	
	      return this.clientAccessTokenPromise;
	    }
	
	    /**
	     * Sign in method
	     * Calls _authenticate() method with the inserted credentials
	     *
	     * @return {Object} A result promise
	     */
	
	  }, {
	    key: 'authenticateUser',
	    value: function authenticateUser(_ref) {
	      var email = _ref.email;
	      var password = _ref.password;
	      var _ref$headersExtension = _ref.headersExtension;
	      var headersExtension = _ref$headersExtension === undefined ? {} : _ref$headersExtension;
	      var _ref$authDataExtensio = _ref.authDataExtension;
	      var authDataExtension = _ref$authDataExtensio === undefined ? {} : _ref$authDataExtensio;
	
	      var authData = Object.assign({
	        'basic_auth.username': email,
	        'basic_auth.password': password
	      }, authDataExtension);
	
	      var claims = this._createClaims(authData, 'user');
	
	      var request = this._authenticate('login', claims, headersExtension);
	
	      return request;
	    }
	
	    /**
	     * Refresh Token method
	     * Calls _authenticate() method with the user refresh token provided
	     *
	     * @return {Object} A result promise
	     */
	
	  }, {
	    key: 'refreshUserToken',
	    value: function refreshUserToken(_ref2) {
	      var refreshToken = _ref2.refreshToken;
	      var _ref2$headersExtensio = _ref2.headersExtension;
	      var headersExtension = _ref2$headersExtensio === undefined ? {} : _ref2$headersExtensio;
	      var _ref2$authDataExtensi = _ref2.authDataExtension;
	      var authDataExtension = _ref2$authDataExtensi === undefined ? {} : _ref2$authDataExtensi;
	
	      var authData = Object.assign({
	        'refresh_token': refreshToken
	      }, authDataExtension);
	
	      var claims = this._createClaims(authData, 'user');
	
	      var request = this._authenticate('refreshToken', claims, headersExtension);
	
	      return request;
	    }
	
	    /**
	     * Logs out method
	     * Calls _authenticate() method with provided credentials
	     */
	
	  }, {
	    key: 'logoutUser',
	    value: function logoutUser(_ref3) {
	      var accessToken = _ref3.accessToken;
	      var _ref3$headersExtensio = _ref3.headersExtension;
	      var headersExtension = _ref3$headersExtensio === undefined ? {} : _ref3$headersExtensio;
	      var _ref3$authDataExtensi = _ref3.authDataExtension;
	      var authDataExtension = _ref3$authDataExtensi === undefined ? {} : _ref3$authDataExtensi;
	
	      var headers = Object.assign({
	        'Authorization': accessToken
	      }, headersExtension);
	
	      var claims = this._createClaims(authDataExtension, 'user');
	
	      var request = this._authenticate('logout', claims, headers);
	
	      return request;
	    }
	  }]);
	
	  return AuthRequest;
	}();
	
	exports.default = AuthRequest;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var AuthPersist = function () {
	  function AuthPersist() {
	    var cookies = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	
	    _classCallCheck(this, AuthPersist);
	
	    this._isNode();
	    this.getRememberFromStorage();
	    this.getTokensFromStorage();
	    this.cookies = cookies;
	  }
	
	  /////////////////
	  // Private API //
	  /////////////////
	
	  _createClass(AuthPersist, [{
	    key: '_isNode',
	    value: function _isNode() {
	      var evaluateEnvironment = new Function('try {return window;}catch(e){ return false;}');
	
	      if (evaluateEnvironment()) {
	        this.sessionStorage = window.sessionStorage;
	        this.localStorage = window.localStorage;
	
	        return false;
	      }
	
	      this.sessionStorage = {
	        removeItem: function removeItem(item) {
	          this[item] = void 0;
	        }
	      };
	
	      this.localStorage = {
	        removeItem: function removeItem(item) {
	          this[item] = void 0;
	        }
	      };
	
	      return true;
	    }
	
	    /**
	     * Adds data to localStorage
	     *
	     * @param {Object} data
	     */
	
	  }, {
	    key: '_addLocalStorage',
	    value: function _addLocalStorage(data) {
	      if (this.remember) {
	        this.localStorage.remember = true;
	        this.localStorage.refreshToken = data.refreshToken;
	      }
	      if (data.authOptions) {
	        this.localStorage.authOptions = JSON.stringify(data.authOptions);
	      }
	      this.localStorage.scopes = data.scopes;
	      this.localStorage.accessToken = data.accessToken;
	      this.localStorage.expiresAt = data.expiresAt;
	    }
	
	    /**
	     * Adds data to sessionStorage
	     *
	     * @param {Object} data
	     */
	
	  }, {
	    key: '_addSessionStorage',
	    value: function _addSessionStorage(data) {
	
	      if (this.remember) {
	        this.sessionStorage.remember = true;
	      }
	      if (data.authOptions) {
	        this.sessionStorage.authOptions = JSON.stringify(data.authOptions);
	      }
	      this.sessionStorage.scopes = data.scopes;
	      this.sessionStorage.refreshToken = data.refreshToken;
	      this.sessionStorage.accessToken = data.accessToken;
	      this.sessionStorage.expiresAt = data.expiresAt;
	    }
	
	    /**
	     * Removes auth data from localStorage
	     */
	
	  }, {
	    key: '_removeLocalStorage',
	    value: function _removeLocalStorage() {
	      var items = ['refreshToken', 'accessToken', 'expiresAt', 'scopes', 'remember', 'authOptions'];
	
	      for (var i in items) {
	        this.localStorage.removeItem(items[i]);
	      }
	    }
	
	    /**
	     * Removes auth data from sessionStorage
	     */
	
	  }, {
	    key: '_removeSessionStorage',
	    value: function _removeSessionStorage() {
	      var items = ['refreshToken', 'accessToken', 'expiresAt', 'scopes', 'remember', 'authOptions'];
	
	      for (var i in items) {
	        this.sessionStorage.removeItem(items[i]);
	      }
	    }
	  }, {
	    key: '_removeUserCookie',
	    value: function _removeUserCookie(cookieName) {
	      document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	    }
	  }, {
	    key: '_removeUserCookies',
	    value: function _removeUserCookies() {
	      // TODO: Due to an issue with ios 8 or lower versions
	      //  it's better to use for..in loops instead for..of
	      //
	      // Replace following lines in projects without support for this browsers:
	      //
	      // for (const cookie of this.cookies) {
	      //   this._removeUserCookie(cookie);
	      // }
	      for (var i in this.cookies) {
	        var cookie = this.cookies[i];
	        this._removeUserCookie(cookie);
	      }
	    }
	  }, {
	    key: '_getAuthOptionsFromStorage',
	    value: function _getAuthOptionsFromStorage() {
	      var authOptions = this.sessionStorage.authOptions || this.localStorage.authOptions;
	      try {
	        authOptions = JSON.parse(authOptions);
	      } catch (err) {
	        authOptions = {};
	      }
	      return authOptions;
	    }
	  }, {
	    key: '_getUserAccessToken',
	    value: function _getUserAccessToken() {
	      var sessionStorageToken = {
	        accessToken: this.sessionStorage.accessToken,
	        expiresAt: parseInt(this.sessionStorage.expiresAt)
	      };
	
	      var localStorageToken = {
	        accessToken: this.localStorage.accessToken,
	        expiresAt: parseInt(this.localStorage.expiresAt)
	      };
	
	      var mostRecentToken = {};
	
	      if (!isNaN(sessionStorageToken.expiresAt) && !isNaN(localStorageToken.expiresAt)) {
	        mostRecentToken = sessionStorageToken.expiresAt > localStorageToken.expiresAt ? sessionStorageToken : localStorageToken;
	        return mostRecentToken;
	      }
	
	      mostRecentToken = isNaN(sessionStorageToken.expiresAt) ? localStorageToken : sessionStorageToken;
	
	      return mostRecentToken;
	    }
	  }, {
	    key: '_getUserTokens',
	    value: function _getUserTokens() {
	      var refreshToken = this.sessionStorage.refreshToken || this.localStorage.refreshToken;
	      var scopes = this.sessionStorage.scopes || this.localStorage.scopes;
	
	      var _getUserAccessToken2 = this._getUserAccessToken();
	
	      var accessToken = _getUserAccessToken2.accessToken;
	      var expiresAt = _getUserAccessToken2.expiresAt;
	
	      var userTokens = {
	        refreshToken: refreshToken,
	        accessToken: accessToken,
	        expiresAt: expiresAt,
	        scopes: scopes
	      };
	
	      return userTokens;
	    }
	  }, {
	    key: '_getClientAccessToken',
	    value: function _getClientAccessToken() {
	      var accessToken = this.sessionStorage.clientAccessToken;;
	      var expiresAt = this.sessionStorage.clientExpiresAt;
	
	      return {
	        accessToken: accessToken,
	        expiresAt: expiresAt
	      };
	    }
	
	    ////////////////
	    // Public API //
	    ////////////////
	
	    /**
	     * Persist client accessToken
	     */
	
	  }, {
	    key: 'persistClientToken',
	    value: function persistClientToken(_ref) {
	      var accessToken = _ref.accessToken;
	      var expiresAt = _ref.expiresAt;
	
	
	      this.sessionStorage.clientAccessToken = accessToken;
	      this.sessionStorage.clientExpiresAt = expiresAt;
	
	      this.tokens.client = {
	        accessToken: accessToken,
	        expiresAt: expiresAt
	      };
	    }
	
	    /**
	     * Stores result auth data in local & session storage
	     *
	     * @param  {Object} tokenObject [accessToken, refreshToken, expiresAt, authOptions]
	     */
	
	  }, {
	    key: 'persistAuthData',
	    value: function persistAuthData(tokenObject) {
	      var accessToken = tokenObject.accessToken;
	      var refreshToken = tokenObject.refreshToken;
	      var expiresAt = tokenObject.expiresAt;
	      var scopes = tokenObject.scopes;
	      var authOptions = tokenObject.authOptions;
	
	
	      if (this.remember) {
	        this._addLocalStorage(tokenObject);
	        this._addSessionStorage(tokenObject);
	      } else {
	        // Not saving in localstorage if user doesnt check remember option
	        // When browser is closed, user is logged out
	        this._addSessionStorage(tokenObject);
	      }
	
	      this.tokens.user = {
	        accessToken: accessToken,
	        refreshToken: refreshToken,
	        expiresAt: expiresAt,
	        scopes: scopes
	      };
	
	      this.tokens.authOptions = authOptions;
	
	      return true;
	    }
	  }, {
	    key: 'removeAllUserData',
	    value: function removeAllUserData() {
	      this._removeLocalStorage();
	      this._removeSessionStorage();
	      this._removeUserCookies();
	    }
	  }, {
	    key: 'getRememberFromStorage',
	    value: function getRememberFromStorage() {
	      var remember = this.sessionStorage.remember || this.localStorage.remember;
	
	      this.remember = remember === 'true';
	
	      return this.remember;
	    }
	  }, {
	    key: 'getTokensFromStorage',
	    value: function getTokensFromStorage() {
	      var tokens = {
	        client: this._getClientAccessToken(),
	        user: this._getUserTokens(),
	        authOptions: this._getAuthOptionsFromStorage()
	      };
	      this.tokens = tokens;
	
	      return tokens;
	    }
	  }]);
	
	  return AuthPersist;
	}();
	
	exports.default = AuthPersist;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _AuthRequest = __webpack_require__(5);
	
	var _AuthRequest2 = _interopRequireDefault(_AuthRequest);
	
	var _AuthPersist = __webpack_require__(6);
	
	var _AuthPersist2 = _interopRequireDefault(_AuthPersist);
	
	var _utils = __webpack_require__(1);
	
	var utils = _interopRequireWildcard(_utils);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var AuthConnector = function () {
	  function AuthConnector(_ref) {
	    var _ref$options = _ref.options;
	    var options = _ref$options === undefined ? {} : _ref$options;
	    var authConfig = _ref.authConfig;
	    var _ref$authPersist = _ref.authPersist;
	    var authPersist = _ref$authPersist === undefined ? new _AuthPersist2.default() : _ref$authPersist;
	    var _ref$authRequest = _ref.authRequest;
	    var authRequest = _ref$authRequest === undefined ? new _AuthRequest2.default(authConfig) : _ref$authRequest;
	
	    _classCallCheck(this, AuthConnector);
	
	    this.authPersist = authPersist;
	    this.authRequest = authRequest;
	    this.options = options;
	    this.userAuthenticated = false;
	  }
	
	  /////////////////
	  // Private API //
	  /////////////////
	
	  /**
	   * Set authentication status and dispatch an event
	   */
	
	
	  _createClass(AuthConnector, [{
	    key: '_setAuthentication',
	    value: function _setAuthentication(auth) {
	      utils.events.publish('userAuthenticated', auth);
	      this.userAuthenticated = auth;
	    }
	
	    /**
	     * Validates accesstoken and refresh if it's necessary
	     */
	
	  }, {
	    key: '_validateAccessToken',
	    value: function _validateAccessToken() {
	      this.authPersist.getTokensFromStorage();
	      var _authPersist$tokens$u = this.authPersist.tokens.user;
	      var accessToken = _authPersist$tokens$u.accessToken;
	      var expiresAt = _authPersist$tokens$u.expiresAt;
	      var refreshToken = _authPersist$tokens$u.refreshToken;
	
	      var validAccessToken = accessToken && expiresAt && Date.now() < expiresAt;
	      var accessTokenPromise = void 0;
	
	      if (validAccessToken) {
	        // Accesstoken exists and is not expired
	        accessTokenPromise = Promise.resolve({
	          accessToken: accessToken
	        });
	      } else if (refreshToken) {
	        // AccessToken expired or missed: refresh token if exists
	        accessTokenPromise = this.refreshUserToken();
	      } else {
	        accessTokenPromise = Promise.reject('No accessToken or refreshToken');
	      }
	
	      return accessTokenPromise;
	    }
	
	    /**
	     * Validates if clientAccessToken exists in sessionStorage and is not expired
	     *
	     * @return {String} clientAccessToken
	     */
	
	  }, {
	    key: '_validateClientAccessToken',
	    value: function _validateClientAccessToken(clientToken) {
	
	      var isValid = clientToken && clientToken.accessToken && clientToken.expiresAt && Date.now() < parseInt(clientToken.expiresAt);
	
	      return isValid ? clientToken : false;
	    }
	
	    /**
	     * Parse token object when comes inside another object
	     *
	     * @param  {Object} response Request response object
	     * @return {Object}          Token object
	     */
	
	  }, {
	    key: '_parseTokenObject',
	    value: function _parseTokenObject(response) {
	      if (response.tokenObject) {
	        return response.tokenObject;
	      }
	
	      return response;
	    }
	
	    /**
	     * Execute optional callbacks
	     *
	     * @param  {String} name    Name of the event
	     * @param  {Object} promise Unresolved event promise
	     */
	
	  }, {
	    key: '_executePromiseCb',
	    value: function _executePromiseCb(name, promise) {
	
	      this._publishEvent(name, promise);
	
	      if (!this.options.callbacks) {
	        return;
	      }
	
	      var successCb = void 0;
	      var errorCb = void 0;
	
	      if (this.options.callbacks.success) {
	        successCb = this.options.callbacks.success[name];
	      }
	
	      if (this.options.callbacks.error) {
	        errorCb = this.options.callbacks.error[name];
	      }
	
	      promise.then(successCb).catch(errorCb);
	    }
	
	    /**
	     * Publish events when promises are resolved (use it instead callbacks)
	     *
	     * @param  {String} name  Name of the event
	     * @param  {Object} promise Unresolved event promise
	     */
	
	  }, {
	    key: '_publishEvent',
	    value: function _publishEvent(name, promise) {
	      promise.then(function (res) {
	        utils.events.publish(name, {
	          result: 'success',
	          response: res
	        });
	      }).catch(function (err) {
	        utils.events.publish(name, {
	          result: 'error',
	          response: err
	        });
	      });
	    }
	
	    ////////////////
	    // Public API //
	    ////////////////
	
	    /**
	     * Init method
	     * Make a client login and use authValidation method
	     * to check if exists a previous valid session
	     */
	
	  }, {
	    key: 'init',
	    value: function init() {
	      var _this = this;
	
	      this.loginClient();
	      this.authValidation().then(function () {
	        return _this._setAuthentication(true);
	      }).catch(function () {
	        return _this._setAuthentication(false);
	      });
	    }
	
	    /**
	     * Checks if exists a valid user session
	     *
	     * @return {Object} Promise
	     */
	
	  }, {
	    key: 'authValidation',
	    value: function authValidation() {
	      var _this2 = this;
	
	      var that = this;
	      // Use a previous authValidation promise if it is already pending
	      if (this.validationPromise && this._validationState === 'Pending') {
	        return this.validationPromise;
	      }
	
	      this._validationState = 'Pending';
	
	      var validationRequest = this._validateAccessToken();
	
	      validationRequest.then(function () {
	        return _this2._validationState = 'Resolved';
	      }).catch(function () {
	        return _this2._validationState = 'Resolved';
	      });
	
	      this.validationPromise = validationRequest;
	
	      return validationRequest;
	    }
	
	    /**
	    * Dispatch user accessToken if it's available, if not, dispatch client accessToken
	    *
	    * @return {Object} Promise
	    */
	
	  }, {
	    key: 'getCurrentToken',
	    value: function getCurrentToken() {
	      var _this3 = this;
	
	      this.authPersist.getTokensFromStorage();
	
	      var currentTokenPromise = this.authValidation().then(function () {
	        var accessToken = _this3.authPersist.tokens.user.accessToken;
	        if (accessToken && _this3.userAuthenticated === false) {
	          _this3._setAuthentication(true);
	        }
	        return accessToken;
	      }).catch(function () {
	        return _this3.loginClient().then(_this3._parseTokenObject).then(function (res) {
	          return res.accessToken;
	        });
	      });
	
	      return currentTokenPromise;
	    }
	
	    /**
	     * Authenticates with client scope
	     *
	     * @return {Object} Promise
	     */
	
	  }, {
	    key: 'loginClient',
	    value: function loginClient() {
	      var _this4 = this;
	
	      this.authPersist.getTokensFromStorage();
	      var storedClientToken = this.authPersist.tokens.client;
	      var currentClientAccessToken = this._validateClientAccessToken(storedClientToken);
	
	      // Resolve current clientToken if exists
	      if (currentClientAccessToken) {
	        return Promise.resolve(currentClientAccessToken);
	      }
	
	      // Ask for a new clientToken
	      var clientAccessTokenPromise = this.authRequest.authenticateClient().then(this._parseTokenObject).then(function (res) {
	        _this4.authPersist.persistClientToken(res);
	        return res;
	      });
	
	      this._executePromiseCb('loginClient', clientAccessTokenPromise);
	      this.clientAccessTokenPromise = clientAccessTokenPromise;
	
	      return clientAccessTokenPromise;
	    }
	
	    /**
	     * Sign in method
	     *
	     * @return {Object} A result promise
	     */
	
	  }, {
	    key: 'loginUser',
	    value: function loginUser(_ref2) {
	      var _this5 = this;
	
	      var email = _ref2.email;
	      var password = _ref2.password;
	      var remember = _ref2.remember;
	      var _options = this.options;
	      var _options$authDataExte = _options.authDataExtension;
	      var authDataExtension = _options$authDataExte === undefined ? {} : _options$authDataExte;
	      var _options$headersExten = _options.headersExtension;
	      var headersExtension = _options$headersExten === undefined ? {} : _options$headersExten;
	
	
	      var request = this.authRequest.authenticateUser({
	        email: email,
	        password: password,
	        remember: remember,
	        headersExtension: headersExtension,
	        authDataExtension: authDataExtension
	      }).then(this._parseTokenObject).then(function (res) {
	        res.authOptions = _this5.options;
	        _this5.authPersist.remember = remember ? remember : false;
	        _this5.authPersist.persistAuthData(res);
	        _this5._setAuthentication(true);
	
	        return res;
	      });
	
	      this._executePromiseCb('loginUser', request);
	      this.loginUserPromise = request;
	
	      return request;
	    }
	
	    /**
	     * Refresh token method
	     *
	     * @return {Object}  A result promise
	     */
	
	  }, {
	    key: 'refreshUserToken',
	    value: function refreshUserToken() {
	      var _this6 = this;
	
	      this.authPersist.getTokensFromStorage();
	
	      var refreshToken = this.authPersist.tokens.user.refreshToken;
	      var _authPersist$tokens$a = this.authPersist.tokens.authOptions;
	      var _authPersist$tokens$a2 = _authPersist$tokens$a.authDataExtension;
	      var authDataExtension = _authPersist$tokens$a2 === undefined ? {} : _authPersist$tokens$a2;
	      var _authPersist$tokens$a3 = _authPersist$tokens$a.headersExtension;
	      var headersExtension = _authPersist$tokens$a3 === undefined ? {} : _authPersist$tokens$a3;
	
	
	      var request = this.authRequest.refreshUserToken({
	        refreshToken: refreshToken,
	        headersExtension: headersExtension,
	        authDataExtension: authDataExtension
	      }).then(this._parseTokenObject).then(function (res) {
	        _this6.authPersist.persistAuthData(res);
	        _this6._setAuthentication(true);
	
	        return res;
	      });
	
	      this._executePromiseCb('refreshUserToken', request);
	      this.refreshUserTokenPromise = request;
	
	      return request;
	    }
	
	    /**
	     * Logout method
	     * Calls _authenticate() method
	     */
	
	  }, {
	    key: 'logoutUser',
	    value: function logoutUser() {
	      this.authPersist.getTokensFromStorage();
	
	      var accessToken = this.authPersist.tokens.user.accessToken;
	      var _authPersist$tokens$a4 = this.authPersist.tokens.authOptions;
	      var _authPersist$tokens$a5 = _authPersist$tokens$a4.authDataExtension;
	      var authDataExtension = _authPersist$tokens$a5 === undefined ? {} : _authPersist$tokens$a5;
	      var _authPersist$tokens$a6 = _authPersist$tokens$a4.headersExtension;
	      var headersExtension = _authPersist$tokens$a6 === undefined ? {} : _authPersist$tokens$a6;
	
	
	      var request = this.authRequest.logoutUser({
	        accessToken: accessToken,
	        headersExtension: headersExtension,
	        authDataExtension: authDataExtension
	      });
	
	      this._setAuthentication(false);
	      this.authPersist.removeAllUserData();
	      this._executePromiseCb('logoutUser', request);
	
	      return request;
	    }
	  }]);
	
	  return AuthConnector;
	}();
	
	exports.default = AuthConnector;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _AuthConnector = __webpack_require__(7);
	
	var _AuthConnector2 = _interopRequireDefault(_AuthConnector);
	
	var _utils = __webpack_require__(1);
	
	var utils = _interopRequireWildcard(_utils);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	if (undefined && undefined.Meteor) {
	  // NOTE: this only work if it is used with the meteor package version of this library.
	
	  undefined.Headers = fetch.Headers;
	  undefined.Request = fetch.Request;
	
	  fetch.Promise = Promise;
	}
	
	var Connect = function () {
	  function Connect(_ref) {
	    var config = _ref.config;
	    var _ref$options = _ref.options;
	    var options = _ref$options === undefined ? {} : _ref$options;
	    var _ref$authConnector = _ref.authConnector;
	    var authConnector = _ref$authConnector === undefined ? new _AuthConnector2.default({
	      authConfig: config
	    }) : _ref$authConnector;
	
	    _classCallCheck(this, Connect);
	
	    this.authConnector = authConnector;
	    this.endpoints = config.endpoints;
	    this.urlBase = config.urlBase;
	    this.options = options;
	
	    this._requestDataQueue = [];
	
	    this.authConnector.init();
	  }
	
	  /////////////////
	  // Private API //
	  /////////////////
	
	  _createClass(Connect, [{
	    key: '_buildHeaders',
	    value: function _buildHeaders(_ref2) {
	      var token = _ref2.token;
	      var headersExtension = _ref2.headersExtension;
	
	      var defaultHeaders = {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json; charset=utf-8',
	        'Authorization': 'Bearer ' + token
	      };
	
	      var headers = Object.assign(defaultHeaders, this.options.headersExtension, headersExtension);
	
	      return new Headers(headers);
	    }
	  }, {
	    key: '_buildRequestParams',
	    value: function _buildRequestParams(_ref3) {
	      var body = _ref3.body;
	      var queryParams = _ref3.queryParams;
	
	      var queryPath = this._buildQueryPath(queryParams);
	
	      if (body) {
	        body = JSON.stringify(body);
	      }
	
	      return {
	        body: body,
	        queryPath: queryPath
	      };
	    }
	  }, {
	    key: '_buildQueryPath',
	    value: function _buildQueryPath(dict) {
	      var query = '';
	      if (dict) {
	        var queries = [];
	        Object.keys(dict).forEach(function (key) {
	          queries.push(key + '=' + dict[key]);
	        });
	        if (queries.length > 0) {
	          query = '?' + queries.join('&');
	        }
	      }
	      return query;
	    }
	  }, {
	    key: '_buildUrl',
	    value: function _buildUrl(_ref4) {
	      var endpoint = _ref4.endpoint;
	      var queryPath = _ref4.queryPath;
	
	      var requestEndpoint = this.endpoints[endpoint];
	
	      if (endpoint.key) {
	        requestEndpoint = this.endpoints[endpoint.key] + endpoint.id;
	      }
	
	      var url = utils.buildURI(this.urlBase) + requestEndpoint + queryPath;
	
	      return url;
	    }
	  }, {
	    key: '_buildRequest',
	    value: function _buildRequest(_ref5, token) {
	      var endpoint = _ref5.endpoint;
	      var method = _ref5.method;
	      var params = _ref5.params;
	      var data = _ref5.data;
	      var headersExtension = _ref5.headersExtension;
	
	      var _buildRequestParams2 = this._buildRequestParams({
	        queryParams: params,
	        body: data
	      });
	
	      var body = _buildRequestParams2.body;
	      var queryPath = _buildRequestParams2.queryPath;
	
	      var url = this._buildUrl({
	        endpoint: endpoint,
	        queryPath: queryPath
	      });
	      var headers = this._buildHeaders({
	        token: token,
	        headersExtension: headersExtension
	      });
	
	      var request = new Request(url, {
	        credentials: 'include',
	        mode: 'cors',
	        cache: 'no-store',
	        method: method,
	        headers: headers,
	        body: body
	      });
	
	      return fetch(request).then(utils.checkStatus);
	    }
	  }, {
	    key: '_createRetryRequests',
	    value: function _createRetryRequests(tokenObject) {
	      var accessToken = tokenObject.accessToken;
	
	      var requestDataQueue = void 0;
	      var requestsCallback = void 0;
	      var retryRequests = [];
	
	      if (this.options.retryRequestProxy) {
	        var retryRequestProxyResponse = this.options.retryRequestProxy(tokenObject, this._requestDataQueue);
	        requestDataQueue = retryRequestProxyResponse.requestDataQueue;
	        requestsCallback = retryRequestProxyResponse.requestsCallback;
	      } else {
	        requestDataQueue = this._requestDataQueue;
	        requestsCallback = function requestsCallback(data) {
	          return data;
	        };
	      }
	
	      // TODO: Due to an issue with ios 8 or lower versions
	      //  it's better to use for..in loops instead for..of
	      //
	      // Replace following lines in projects without support for this browsers:
	      //
	      // for (const data of requestDataQueue) {
	      //   const request = this._buildRequest(data, accessToken);
	      //
	      //   retryRequests.push(request);
	      // }
	      for (var i in requestDataQueue) {
	        var data = requestDataQueue[i];
	        var request = this._buildRequest(data, accessToken);
	
	        retryRequests.push(request);
	      }
	
	      this._requestDataQueue = [];
	
	      return Promise.all(retryRequests).then(requestsCallback);
	    }
	  }, {
	    key: '_retry',
	    value: function _retry(requestData) {
	      var _this = this;
	
	      this._requestDataQueue.push(requestData);
	
	      if (this._retryStatus === 'Pending') {
	        return this._retryRequest;
	      }
	
	      this._retryStatus = 'Pending';
	
	      var refreshTokenPromise = this.authConnector.refreshUserToken();
	      this._retryRequest = refreshTokenPromise.then(function (tokenObject) {
	        return _this._createRetryRequests(tokenObject);
	      });
	
	      refreshTokenPromise.then(function () {
	        return _this._retryStatus = 'Resolved';
	      }).catch(function () {
	        return _this._retryStatus = 'Resolved';
	      });
	
	      return this._retryRequest;
	    }
	
	    /**
	     * Send request
	     *
	     * @param  {Object} requestData
	     * @return {Object} Promise
	     */
	
	  }, {
	    key: '_request',
	    value: function _request(requestData) {
	      var _this2 = this;
	
	      var retry = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
	
	      var fetchRequest = this.authConnector.getCurrentToken().then(function (token) {
	        var request = _this2._buildRequest(requestData, token);
	
	        return request;
	      }).catch(function (err) {
	        if (retry && err.status === 401 && _this2.authConnector.userAuthenticated) {
	          return _this2._retry(requestData);
	        }
	
	        throw err;
	      });
	
	      return fetchRequest;
	    }
	
	    ////////////////
	    // Public API //
	    ////////////////
	
	    /**
	     * Send request through proxy
	     *
	     * @param  {Object} requestData
	     * @return {Object} Promise
	     */
	
	  }, {
	    key: 'request',
	    value: function request(requestData) {
	      var retry = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
	
	
	      if (this.options.requestProxy) {
	        var requestProxy = this.options.requestProxy;
	        return requestProxy(this._request, requestData, retry);
	      }
	
	      return this._request(requestData, retry);
	    }
	
	    /**
	     * GET request
	     *
	     * @param  {String} endpoint
	     * @param  {Object} params
	     * @return {Object}  Request promise
	     */
	
	  }, {
	    key: 'get',
	    value: function get(endpoint, params) {
	      var requestData = {
	        method: 'get',
	        endpoint: endpoint,
	        params: params
	      };
	
	      return this.request(requestData);
	    }
	
	    /**
	     * DELETE request
	     *
	     * @param  {String} endpoint
	     * @param  {Object} params
	     * @return {Object}  Request promise
	     */
	
	  }, {
	    key: 'delete',
	    value: function _delete(endpoint, params) {
	      var requestData = {
	        method: 'delete',
	        endpoint: endpoint,
	        params: params
	      };
	
	      return this.request(requestData);
	    }
	
	    /**
	     * POST request
	     *
	     * @param  {String} endpoint
	     * @param  {Object} data
	     * @return {Object}  Request promise
	     */
	
	  }, {
	    key: 'post',
	    value: function post(endpoint, data) {
	      var requestData = {
	        method: 'post',
	        endpoint: endpoint,
	        data: data
	      };
	
	      return this.request(requestData);
	    }
	
	    /**
	     * PUT request
	     *
	     * @param  {String} endpoint
	     * @param  {Object} data
	     * @return {Object}  Request promise
	     */
	
	  }, {
	    key: 'put',
	    value: function put(endpoint, data) {
	      var requestData = {
	        method: 'put',
	        endpoint: endpoint,
	        data: data
	      };
	
	      return this.request(requestData);
	    }
	  }]);
	
	  return Connect;
	}();
	
	exports.default = Connect;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=composr-connector.js.map