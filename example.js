var pdftree = require("./index"),
    PDFDocument = require('pdfkit');

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
  
  var text = page.text;

  var tree = page.tree;

  var result;
  if (coord && typeof coord === 'string') {
    result = tree.search(coord.split(','));
  } else {
    result = tree.all();
  }
  
  fullAttributes(result, text);

  console.log(result);

  var layout = page.textLayout;

  var pdf = new PDFDocument();
  
  result.forEach(function (e) {

    pdf.font(e.fontName);

    pdf.fontSize(e.fontSize);
    
    var i, x, y, w, h;
    for (i = e.startIndex; i <= e.endIndex; i++) {
      x = layout[i].x1;
      y = layout[i].y1;
      w = layout[i].x2 - x;
      h = layout[i].y2 - y;
      if (x && y) {
        pdf.text(text[i], x, y, {width:w*1.5, height:h*1.5});
      }
    }

  });

  var out = require('fs').createWriteStream('result.pdf');

  pdf.pipe(out);

  pdf.end();

}
