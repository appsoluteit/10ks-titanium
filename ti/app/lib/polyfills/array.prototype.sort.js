// Note: unable to find an official polyfill so had to write my own.
if (!Array.prototype.sort) {
    Ti.API.info('Sort not defined on Array. Adding Polyfill.');

    Array.prototype.sort = function(callback) {
        Ti.API.info('Sorting...');

        if (this == null) {
            throw new TypeError('this is null or not defined');
        }

        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        var O = Object(this);
        var len = O.length >>> 0;

        // Just use a bubble sort. Shouldn't be too many items in the collection for our purposes.
  
        for(var i = 0; i < len; i++) {
            for(var j = i; j < len; j++) {
                if(i in O) {
                    var iValue = O[i];
                    var jValue = O[j];

                    var result = callback(iValue, jValue);

                    if(result > 0) {
                        var tmp = iValue;
                        O[i] = jValue;
                        O[j] = tmp;
                    }
                }
            }
        }

        return O;
    };
  } 
  else {
      Ti.API.info('Sort already defined');
      Ti.API.info(Array.prototype.sort);
  }

  module.exports = Array.prototype.sort;