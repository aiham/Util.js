(function (window) {

  'use strict';

  var util;

  util = {

    hasOwn: Object.prototype.hasOwnProperty,

    toString: Object.prototype.toString,

    push: Array.prototype.push,

    // Upper case first character of string
    ucfirst: function (str) {
      return str.charAt(0).toUpperCase() + str.substr(1);
    },

    isType: function (o, type) {
      return util.toString.call(o) === '[object ' + type + ']';
    },

    // Loops over arrays or object literals
    each: function (o, callback, context, data, check_all) {
      var i = 0, l, key;

      context = context || this;
    
      if (util.isArray(o)) {
    
        for (l = o.length; i < l; i += 1) {
          if (callback.call(context, o[i], i, data) === false) {
            i += 1;
            break;
          }
        }
    
      } else {

        for (key in o) {
          if (check_all || util.hasOwn.call(o, key)) {
            if (callback.call(context, o[key], key, data) === false) {
              i += 1;
              break;
            }
            i += 1;
          }
        }

      }

      o = callback = context = data = null;

      return i;
    },

    // Define indexOf manually if the browser is old
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
    indexOf: Array.prototype.indexOf ||
      function (searchElement, fromIndex) {
        var t = this, len, n, k;

        if (!t) {
          throw new TypeError();
        }
    
        len = t.length || 0;
        if (len === 0) {
          return -1;
        }
    
        n = 0;
        if (typeof fromIndex !== 'undefined') {
          n = Number(fromIndex);
          if (n === null || isNaN(n)) {
            n = 0;
          } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
            n = (n > 0 || -1) * Math.floor(Math.abs(n));
          }
        }
    
        if (n >= len) {
          return -1;
        }
    
        k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    
        for (; k < len; k += 1) {
          if (typeof t[k] !== 'undefined' && t[k] === searchElement) {
            return k;
          }
        }
        return -1;
      },

    // Define filter manually if the browser is old
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter
    filter: Array.prototype.filter ||
      function (fun, thisp) {
        var i, len, res, val;

        if (!this) {
          throw new TypeError();
        }
  
        len = this.length || 0;
        if (typeof fun !== 'function') {
          throw new TypeError();
        }
  
        res = [];
        for (i = 0; i < len; i += 1) {
          if (typeof [i] !== 'undefined') {
            val = this[i]; // in case fun mutates this
            if (fun.call(thisp, val, i, this)) {
              util.push.call(res, val);
            }
          }
        }
  
        return res;
      },

    // New array with elements from array a that are not in array b
    // http://stackoverflow.com/questions/1187518/javascript-array-difference/4026828#4026828
    arrayDiff: function (a, b) {
      return util.filter.call(a, function (i) { return util.indexOf.call(b, i) < 0; });
    },

    shallowClone: function (o) {
      var clone = util.isArray(o) ? [] : {};

      util.each(o, function (v, i) {
        clone[i] = v;
      });

      return clone;
    },

    // Changes object to query string and appends to url
    // eg. {foo:bar, lorem:ipsum} appended to 'http://localhost/' becomes 'http://localhost/?foo=bar&lorem=ipsum'
    // eg. {foo:bar, lorem:ipsum} appended to 'http://localhost/?ok' becomes 'http://localhost/?ok&foo=bar&lorem=ipsum'
    appendObjToUrl: function (url, obj) {
      return url + (url.indexOf('?') < 0 ? '?' : '&') + util.objToQueryString(obj);
    },

    // Extracts query string from url
    // eg. 'http://localhost/?foo=bar&lorem=ipsum' returns 'foo=bar&lorem=ipsum'
    queryStringFromUrl: function (url) {
      var i = url.indexOf('?');
      return i < 0 ? '' : url.substr(i + 1);
    },

    // Changes the object into query string
    // eg. {foo:bar, lorem:ipsum} becomes 'foo=bar&lorem=ipsum'
    objToQueryString: function (obj) {
      var str = '';
    
      if (obj) {
        util.each(obj, function (val, key) {
          str += (str === '' ? '' : '&') +
            encodeURIComponent(key) + '=' + encodeURIComponent(val);
        });
      }

      return str;
    },
    
    // Changes the query string into object
    // eg. 'foo=bar&lorem=ipsum' becomes {foo:bar, lorem:ipsum}
    queryStringToObj: function (str) {
      var obj = {}, parts, vals;
    
      if (util.isString(str)) {
        parts = str.split('&');
        util.each(parts, function (part) {
          vals = part.split('=');
          obj[decodeURIComponent(vals[0])] = decodeURIComponent(vals[1]);
        });
      }

      return obj;
    },
    
    // Define trim manually if the browser is old
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/trim
    trim: String.prototype.trim ||
      function (str) {
        return str.replace(/^\s+|\s+$/g, '');
      },

    // Define getPrototypeOf manually if the browser is old
    // http://ejohn.org/blog/objectgetprototypeof/
    getProto: Object.getPrototypeOf ||
      (typeof 'test'['__proto__'] === 'object' ?
        function (object) {
          return object['__proto__'];
        } :
        function (object) {
          // May break if the constructor has been tampered with
          return object.constructor.prototype;
        }),

    // Random integer between min and max (inclusive)
    randomInteger: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Escape any HTML from user input
    escapeHTML: function (text) {
      var e = document.createElement('p');
      e.appendChild(document.createTextNode(text));
      return e.innerHTML;
    },

    // Cross browser XMLHttpRequest function
    // Overwrites itself with the correct call depending on the browser being used for optimum efficiency
    xhr: function () {

      try { return (this.xhr = function () { return new XMLHttpRequest(); })(); } catch (e) {}

      try { return (this.xhr = function () { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); })(); } catch (e) {}

      try { return (this.xhr = function () { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); })(); } catch (e) {}

      try { return (this.xhr = function () { return new ActiveXObject('Msxml2.XMLHTTP'); })(); } catch (e) {}

      try { return (this.xhr = function () { return new ActiveXObject('Microsoft.XMLHTTP'); })(); } catch (e) {}

      return (this.xhr = function () { return null; })();

    }

  };

  util.each(
    'array,function,object,boolean,undefined,null,string,number'.split(','),
    function (type) {
      type = util.ucfirst(type);
      util['is' + type] = function (o) {
        return util.isType(o, type);
      };
    }
  );

  // Preserve old window.util in case of overwrite
  util.old = window.util;

  window.util = util;

}(window));
