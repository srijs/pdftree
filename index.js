var pdfutils = require("pdf").pdfutils,
    rbush    = require("rbush");

var PDFPage = function (page) {

  var self = new Object();

  ['width',
   'height',
   'index',
   'label',
   'links',
   'text',
   'textLayout'
  ].forEach(function (p) {
    self[p] = page[p];
  });

  var treeCache;
  Object.defineProperty(self, 'tree', {
    enumerable: true,
    get: function () {
      if (treeCache) return treeCache;
      treeCache = rbush(9, ['.x1', '.y1', '.x2', '.y2']);
      treeCache.load(page.textChunks);
      return treeCache;
    }
  });

  return self;

};

var PDFDocument = function (doc) {

  var self = new Array(doc.length);

  ['author',
   'creationDate',
   'creator',
   'format',
   'keywords',
   'linearized',
   'metadata',
   'modDate',
   'pageLayout',
   'pageMode',
   'permissions',
   'producer',
   'subject',
   'title'
  ].forEach(function (p) {
    self[p] = doc[p];
  });

  var _i;
  for (_i = 0; _i < self.length; _i++) {
    (function (i) {
      Object.defineProperty(self, i, {
        enumerable: true,
        get: function () {
          return PDFPage(doc[i]);
        }
      });
    })(_i);
  }

  return self;

};

module.exports = function pdfTree (data, cb) {

  pdfutils(data, function (err, doc) {

    if (err) return cb(err);

    return cb(null, PDFDocument(doc));

  });

};
