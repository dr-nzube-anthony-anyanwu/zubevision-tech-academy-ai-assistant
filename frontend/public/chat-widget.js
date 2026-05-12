(function () {
  var script = document.currentScript;
  var scriptOrigin = "http://localhost:3003";

  try {
    if (script && script.src) {
      scriptOrigin = new URL(script.src).origin;
    }
  } catch {
    scriptOrigin = "http://localhost:3003";
  }

  var clientId = script ? script.getAttribute("data-client-id") : null;
  clientId = clientId || "default";

  var configuredWidgetUrl = script
    ? script.getAttribute("data-widget-url")
    : null;
  var widgetUrl =
    configuredWidgetUrl || scriptOrigin + "/widget";

  var primaryColor = script ? script.getAttribute("data-color") : null;
  primaryColor = primaryColor || "#00A8A8";

  var panelWidth = script ? script.getAttribute("data-width") : null;
  panelWidth = panelWidth || "390px";

  var panelHeight = script ? script.getAttribute("data-height") : null;
  panelHeight = panelHeight || "610px";

  if (document.getElementById("zubevision-widget-button")) return;

  var style = document.createElement("style");
  style.innerHTML = [
    "#zubevision-widget-button{",
    "position:fixed;right:24px;bottom:24px;width:64px;height:64px;",
    "border:0;border-radius:999px;background:" + primaryColor + ";",
    "color:#fff;font:700 15px Inter,Arial,sans-serif;cursor:pointer;",
    "z-index:999999;box-shadow:0 18px 45px rgba(10,37,64,.28);",
    "display:flex;align-items:center;justify-content:center;",
    "letter-spacing:.04em;transition:transform .2s ease,box-shadow .2s ease,background .2s ease;",
    "}",
    "#zubevision-widget-button:hover{transform:translateY(-2px);box-shadow:0 22px 52px rgba(10,37,64,.34);}",
    "#zubevision-widget-button[data-open='true']{background:#0A2540;font-size:24px;}",
    "#zubevision-widget-container{",
    "position:fixed;right:24px;bottom:102px;width:" + panelWidth + ";height:" + panelHeight + ";",
    "border:1px solid rgba(10,37,64,.12);border-radius:24px;overflow:hidden;",
    "background:#fff;box-shadow:0 24px 70px rgba(10,37,64,.28);",
    "z-index:999999;display:none;transform-origin:bottom right;",
    "}",
    "#zubevision-widget-container[data-open='true']{display:block;animation:zubevisionWidgetIn .18s ease-out;}",
    "#zubevision-widget-frame{width:100%;height:100%;border:0;display:block;background:#fff;}",
    "@keyframes zubevisionWidgetIn{from{opacity:0;transform:translateY(12px) scale(.98);}to{opacity:1;transform:translateY(0) scale(1);}}",
    "@media(max-width:480px){",
    "#zubevision-widget-container{left:10px!important;right:10px!important;bottom:88px!important;width:auto!important;height:76vh!important;border-radius:22px!important;}",
    "#zubevision-widget-button{right:16px!important;bottom:16px!important;width:60px!important;height:60px!important;}",
    "}",
  ].join("");
  document.head.appendChild(style);

  var container = document.createElement("div");
  container.id = "zubevision-widget-container";
  container.setAttribute("aria-hidden", "true");

  var iframe = document.createElement("iframe");
  iframe.id = "zubevision-widget-frame";
  iframe.src = widgetUrl + "?clientId=" + encodeURIComponent(clientId);
  iframe.title = "ZubeVision Tech Academy AI Assistant";
  iframe.loading = "lazy";
  iframe.setAttribute("allow", "clipboard-write");

  var button = document.createElement("button");
  button.id = "zubevision-widget-button";
  button.type = "button";
  button.textContent = "AI";
  button.setAttribute("aria-label", "Open ZubeVision AI Assistant");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("data-open", "false");

  var isOpen = false;

  function setOpen(nextOpen) {
    isOpen = nextOpen;
    container.setAttribute("data-open", String(isOpen));
    container.setAttribute("aria-hidden", String(!isOpen));
    button.setAttribute("data-open", String(isOpen));
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute(
      "aria-label",
      isOpen ? "Close ZubeVision AI Assistant" : "Open ZubeVision AI Assistant"
    );
    button.textContent = isOpen ? "X" : "AI";
  }

  button.addEventListener("click", function () {
    setOpen(!isOpen);
  });

  container.appendChild(iframe);
  document.body.appendChild(container);
  document.body.appendChild(button);
})();
