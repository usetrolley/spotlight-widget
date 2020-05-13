function createEventListeners() {
  var button = document.getElementsByClassName("spotlt_button")[0];

  button.addEventListener("click", function () {
    var spotlight = window.Spotlight;

    if (spotlight.type === "text") {
      spotlight.track("click");
    } else {
      if (spotlight.paused()) {
        spotlight.play();
      } else {
        spotlight.pause();
      }
    }
  });

  if (matchMedia) {
    var mq = window.matchMedia("(max-width: 767px)");
    mq.addListener(widthChange);
    widthChange(mq);
  }

  // MEDIA QUERIES
  function widthChange(mq) {
    var container = document.getElementsByClassName("spotlt_container")[0];
    var text = document.getElementsByClassName("spotlt_text")[0];
    var button = document.getElementsByClassName("spotlt_button")[0];
    var playIcon = document.getElementsByClassName(
      "spotlt_play-icon-circle"
    )[0];
    var rightSideContainer = window.Spotlight.rightSideContainer;

    // TODO: DO THIS WITH CLASSES THAT TOGGLE, YA NUMSKULL!
    if (mq.matches) {
      // These are the mobile styles
      if (rightSideContainer) {
        rightSideContainer.classList = "spotlt_side_right mobile";
      }

      container.style.padding = "0 8px";
      text.style.fontSize = "12px";
      text.style.flex = "1";

      button.style.fontSize = "12px";
      button.style.padding = "0 6px";
      button.style.marginLeft = "10px";
      button.style.flexShrink = "1";
      button.style.height = "28px";

      if (playIcon) {
        playIcon.style.display = "none";
      }
    } else {
      if (rightSideContainer) {
        rightSideContainer.classList = "spotlt_side_right";
      }
      container.style.padding = "0 30px";
      text.style.fontSize = "16px";
      text.style.flex = "none";

      button.style.fontSize = "14px";
      button.style.padding = "2px 12px";
      button.style.marginLeft = "30px";
      button.style.flexShrink = "none";
      button.style.height = "30px";

      if (playIcon) {
        playIcon.style.display = "inline-block";
      }
    }
  }
}

export default createEventListeners;
