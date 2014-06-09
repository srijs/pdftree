var pdftree = require("./index");

var file  = process.argv[2];
var pagen = process.argv[3];
var coord = process.argv[4];

pdftree(file, function (err, doc) {
  if (err) throw err;
  analyse(doc);
});

function fullAttributes (attributes, text) {
  return attributes.map(function (attr) {
    attr.text   = text.substring(attr.startIndex, attr.endIndex + 1);
    return attr;
  });

};

function analyse (doc) {

  var page = doc[pagen];
  
  var tree = page.tree;

  var result;
  if (coord && typeof coord === 'string') {
    result = tree.search(coord.split(','));
  } else {
    result = tree.all();
  }

  console.log(fullAttributes(result, page.text));

}
