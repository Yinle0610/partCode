import $ from 'jquery'

export function printArea(element) {
  var printAreaCount = 0;

  var ele = $(element);
  var idPrefix = "printArea_";
  removePrintArea(idPrefix + printAreaCount);
  printAreaCount++;
  var iframeId = idPrefix + printAreaCount;
  var iframeStyle = 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;';
  var iframe = document.createElement('IFRAME');
  $(iframe).attr({
    style: iframeStyle,
    id: iframeId
  });
  document.body.appendChild(iframe);
  var doc = iframe.contentWindow.document;
  $(document).find("link").filter(function () {
    // return $(element).attr("rel").toLowerCase() == "stylesheet";
    return $(element).attr("rel") === "stylesheet";
  }).each(
    function () {
      doc.write('<link type="text/css" rel="stylesheet" href="' +
                $(element).attr("href") + '" >');
    });
  doc.write('<div class="' + $(ele).attr("class") + '">' + $(ele).html() +
          '</div>');
  doc.close();
  var frameWindow = iframe.contentWindow;
  frameWindow.close();
  frameWindow.focus();
  frameWindow.print();

  function removePrintArea (id) {
    $("iframe#" + id).remove();
  }
}

