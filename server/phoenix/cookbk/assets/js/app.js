// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css";

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html";

// Import local files
//
// Local files can be imported directly using relative paths, for example:
// import socket from "./socket"

// assets/js/app.js
import { Socket } from "phoenix"
import LiveSocket from "phoenix_live_view"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}})

// Connect if there are any LiveViews on the page
liveSocket.connect()

// Expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)
// The latency simulator is enabled for the duration of the browser session.
// Call disableLatencySim() to disable:
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

// Adds a step to the recipe editor
// TODO: Should we move to Elm or React FE? This mutable-state / multiple-source-of-truths is going to create bugs
// TODO: Remove add_step link after click
try {
  var el = document.getElementById("add_step");
  el.onclick = function (e) {
    e.preventDefault();
    var el = document.getElementById("add_step");
    let time = new Date().getTime();
    let template = el.getAttribute("data-template");
    var uniq_template = template.replace(/\[0]/g, `[${time}]`);
    uniq_template = uniq_template.replace(/\[0]/g, `_${time}_`);
    this.insertAdjacentHTML("afterend", uniq_template);
  };
} catch (e) {}
