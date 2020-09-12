const cache = require('memory-cache');

class MemCacheContainer {
  constructor() {
    this.cache = new cache.Cache();
    this.duration = 30;
  }
  set(key, data) {
    this.cache.put(key, data, this.duration * 1000);
  }
  get(key, callback) {
    const saved = this.cache.get(key);
    if (saved) {
      callback(saved);
    } else {
      callback(null);
    }
  }
  del(keys) {
    this.cache.del(keys);
  }
  flush() {
    this.cache.clear();
  }
}
const MemCache = new MemCacheContainer();

const clearCache = () => {
  return (req, res, next) => {
    const keys = MemCache.cache.keys();
    if (keys.length > 0) {
      const resourceUrl = '__express__' + req.originalUrl || req.url;
      const resourceKeys = keys.filter(k => resourceUrl.includes(k));
      console.log(resourceUrl, '*******', resourceKeys);

      MemCache.del(resourceKeys);
    }
    return next();
  };
};

const addCache = CacheName => {
  return (req, res, next) => {
    const key = '__express__' + req.originalUrl || req.url || CacheName;
    console.log(key);
    console.log('-----');
    console.log(MemCache.cache.keys());
    MemCache.get(key, (err, saved) => {
      if (err) {
        res.sendResponse = res.send;
        res.send = body => {
          MemCache.set(key, body);
          res.sendResponse(body);
        };
        next();
      } else {
        res.send(saved);
        return;
      }
    });
  };
};

/*
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    console.log(key)
    let cacheContent = memCache.get(key);
    if (cacheContent) {
      res.header('Content-Type', 'image/jpeg');
      // res.header('Content-Length', req.file.length);
      res.send(cacheContent);
      return;
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        memCache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}
*/

module.exports = {
  MemCache,
  addCache,
  clearCache,
};
