import create from "../helpers/create";
import makeHeadline from "./Headline";

const buildTextInner = (spotlight) => {
  var innerContainer = create("div");
  innerContainer.classList = "spotlt_content";

  var p = makeHeadline(spotlight.headline);

  innerContainer.appendChild(p);
  if (spotlight.ctaText) {
    var button = create("a");
    button.classList = "spotlt_button";
    button.innerHTML = spotlight.ctaText.toUpperCase();
    button.href =
      spotlight.ctaUrl.indexOf("http") > -1
        ? spotlight.ctaUrl
        : "https://" + spotlight.ctaUrl;

    var domain = window.location.hostname.split(".");
    var hostname = "";
    if (domain.length > 2) {
      hostname = domain[1];
    } else {
      hostname = domain[0];
    }

    var isSameHost = spotlight.ctaUrl.indexOf(hostname) > -1;

    if (spotlight.openNewTab || !isSameHost) {
      button.target = "_blank";
    }

    innerContainer.appendChild(button);
  }

  return innerContainer;
};

export default buildTextInner;
