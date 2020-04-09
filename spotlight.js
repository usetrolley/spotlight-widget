(function () {
  initSpotlight();

  var create = document.createElement.bind(document);
  var spotlight = window.Spotlight;
  var spotlightSettings = window.spotlightSettings;

  getSpotlightData();

  /* THE REST IS FUNCTION DECLARATIONS */
  function getSpotlightData() {
    if (typeof spotlight === "object") {
      spotlight.setWorkspaceId(spotlightSettings.workspaceId);
      spotlight.getActiveSpotlight();

      buildWidget();
    } else {
      setTimeout(getSpotlightData, 100);
    }
  }

  function initSpotlight() {
    var client = new HttpClient();
    var baseUrl = "https://spotlight-api.herokuapp.com/v1";

    function Spotlight() {
      this.setWorkspaceId = this._setWorkspaceId;
      this.getActiveSpotlight = this._getActiveSpotlight;
      this.track = this._track;
    }

    Spotlight.prototype._setWorkspaceId = function (workspaceId) {
      this.workspaceId = workspaceId;
    };

    Spotlight.prototype._getActiveSpotlight = function () {
      var that = this;
      client.get(
        baseUrl + "/spotlights/widget?workspaceId=" + this.workspaceId,
        function (response) {
          response = JSON.parse(response);

          that.type = response.type;
          that.headline = response.headline;
          that.fileUrl = response.fileUrl;
          that.primaryColor = response.primaryColor;
          that.secondaryColor = response.secondaryColor;
          that.ctaText = response.ctaText;
          that.ctaUrl = response.ctaUrl;
          that.spotlightId = response.spotlightId;
          that.openNewTab = response.openNewTab;
        }
      );
    };

    Spotlight.prototype._track = function (eventType) {
      var url =
        baseUrl +
        "/analytics/spotlights/" +
        this.spotlightId +
        "/" +
        eventType +
        "?workspace=" +
        this.workspaceId;

      client.get(url);
    };

    window.Spotlight = new Spotlight();

    function HttpClient() {
      this.get = function (url, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
          if (request.readyState === 4 && request.status === 200 && callback)
            callback(request.responseText);
        };

        request.open("GET", url, true);
        request.send(null);
      };
    }
  }

  function addStyleTag() {
    var styles = {
      "#wrapper": {
        transform: "scale(1.0)",
      },
      ".spotlt_container": {
        padding: "16px 30px",
        position: "relative",
        "z-index": 10000,
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        height: "50px",
        color: spotlight.secondaryColor,
        "background-color": spotlight.primaryColor,
        width: "100%",
      },
      ".spotlt_container .spotlt_content": {
        display: "flex",
        "max-width": "800px",
        "justify-content": "center",
        "align-content": "center",
        width: "100%",
      },
      ".spotlt_container .spotlt_text": {
        "font-size": "16px",
        "align-self": "center",
        "font-weight": "500",
        color: spotlight.secondaryColor,
        "line-height": "16px",
        "font-family": "Poppins, Montserrat, sans-serif",
        margin: 0,
      },
      ".spotlt_container .spotlt_button": {
        "background-color": "transparent",
        "border-radius": "3px",
        cursor: "pointer",
        margin: 0,
        "margin-left": "30px",
        padding: "3px 18px",
        "transition-duration": ".2s",
        "font-weight": "bold",
        "font-size": "16px",
        "letter-spacing": "1.33px",
        display: "flex",
        "align-items": "center",
        height: "35px",
        "align-self": "center",
        "min-width": "60px",
        color: spotlight.secondaryColor,
        border: "2px solid " + spotlight.secondaryColor,
      },
      ".spotlt_container .spotlt_button:hover": {
        "background-color": spotlight.secondaryColor,
        color: spotlight.primaryColor,
      },
      ".spotlt_container .spotlt_button .spotlt_play-icon-circle": {
        display: "inline-block",
        height: "20px",
        width: "20px",
        "border-radius": "50%",
        "margin-left": "8px",
        position: "relative",
        "transition-duration": ".2s",
        "background-color": spotlight.secondaryColor,
      },
      ".spotlt_container .spotlt_button:hover .spotlt_play-icon-circle": {
        "background-color": spotlight.primaryColor,
        color: spotlight.secondaryColor,
      },
      ".spotlt_container .spotlt_button .spotlt_play-icon-circle .spotlt_icon": {
        content: "",
        display: "block",
        transition: "100ms all ease",
        "will-change": "border-width",
        cursor: "pointer",
        "border-style": "solid",
        "border-width": "5px 0 5px 8px",
        left: "7px",
        position: "absolute",
        top: "5px",
        "transition-duration": ".2s",
        "border-color":
          "transparent transparent transparent " + spotlight.primaryColor,
      },
      ".spotlt_container .spotlt_button.pause .spotlt_play-icon-circle .spotlt_icon": {
        "border-style": "double",
        "border-width": "0px 0 0px 8px",
        height: "10px",
        transform: "translateX(-1px)",
      },
      ".spotlt_container .spotlt_button:hover .spotlt_play-icon-circle .spotlt_icon": {
        "border-color":
          "transparent transparent transparent " + spotlight.secondaryColor,
      },
    };

    createStyles(styles);
  }

  function buildWidget() {
    var widgetContainerExists =
      document.getElementsByClassName("spotlt_container").length > 0;

    if (!widgetContainerExists) {
      var innerContainer;
      var container = create("div");
      container.classList = "spotlt_container";

      // document.body.insertBefore(container, document.body.firstChild);
      var wrapper = create("div");
      wrapper.id = "wrapper";
      while (document.body.firstChild) {
        wrapper.appendChild(document.body.firstChild);
      }
      document.body.appendChild(container);
      document.body.appendChild(wrapper);
    }

    if (spotlight.headline) {
      addStyleTag();
      spotlight.track("visit");

      if (spotlight.type === "audio") {
        innerContainer = buildAudioInner();
      } else if (spotlight.type === "text") {
        innerContainer = buildTextInner();
      } else {
        console.log(
          "This spotlight type is not yet supported:",
          spotlight.type
        );
      }

      document
        .getElementsByClassName("spotlt_container")[0]
        .appendChild(innerContainer);

      createEventListeners();
    } else {
      setTimeout(buildWidget, 100);
    }

    function buildAudioInner() {
      var innerContainer = create("div");
      innerContainer.classList = "spotlt_content";

      var p = create("p");
      p.classList = "spotlt_text";
      p.innerHTML = spotlight.headline;

      var button = create("a");
      button.classList = "spotlt_button";
      button.innerHTML = "LISTEN";

      var playIcon = create("div");
      playIcon.classList = "spotlt_play-icon-circle";

      var iconInner = create("div");
      iconInner.classList = "spotlt_icon";

      var audio = create("audio");
      audio.classList = "spotlt_audio";
      audio.preload = "metadata";
      audio.src = spotlight.fileUrl;

      audio.onloadedmetadata = function () {
        spotlight.duration = audio.duration;
      };

      window.Spotlight.play = function () {
        audio.play();
        button.classList = "spotlt_button pause";
        button.childNodes[0].nodeValue = "PAUSE";

        if (!spotlight.wasPlayed) {
          spotlight.track("start");
          spotlight.wasPlayed = true;
        }
      };

      window.Spotlight.pause = function () {
        audio.pause();
        button.classList = "spotlt_button";
        button.childNodes[0].nodeValue = "LISTEN";
      };

      window.Spotlight.paused = function () {
        return audio.paused;
      };

      audio.onended = function () {
        spotlight.track("finish");
        audio.currentTime = 0;
        spotlight.pause();
      };

      playIcon.appendChild(iconInner);
      button.appendChild(playIcon);
      innerContainer.appendChild(p);
      innerContainer.appendChild(button);

      return innerContainer;
    }

    function buildTextInner() {
      var innerContainer = create("div");
      innerContainer.classList = "spotlt_content";

      var p = create("p");
      p.classList = "spotlt_text";
      p.innerHTML = spotlight.headline;

      var button = create("a");
      button.classList = "spotlt_button";
      button.innerHTML = spotlight.ctaText.toUpperCase();
      button.href =
        spotlight.ctaUrl.indexOf("http") > -1
          ? spotlight.ctaUrl
          : "https://" + spotlight.ctaUrl;
      if (spotlight.openNewTab) {
        button.target = "_blank";
      }

      innerContainer.appendChild(p);
      innerContainer.appendChild(button);

      return innerContainer;
    }
  }

  function createEventListeners() {
    var button = document.getElementsByClassName("spotlt_button")[0];

    var isScrolled = false;
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50 && !isScrolled) {
        document.getElementById("wrapper").style.transform = "none";
        isScrolled = true;
      } else if (window.scrollY <= 50) {
        document.getElementById("wrapper").style.transform = "scale(1.0)";
        isScrolled = false;
      }
    });

    button.addEventListener("click", function () {
      var spotlight = window.Spotlight;

      if (spotlight.paused()) {
        spotlight.play();
      } else {
        spotlight.pause();
      }

      if (spotlight.type === "text") {
        spotlight.track("click");
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

      // TODO: DO THIS WITH CLASSES THAT TOGGLE, YA NUMSKULL!
      if (mq.matches) {
        container.style.padding = "16px 8px";

        text.style.fontSize = "12px";
        text.style.flex = "1";

        button.style.fontSize = "12px";
        button.style.padding = "0 6px";
        button.style.marginLeft = "10px";
        button.style.flexShrink = "1";
        button.style.height = "28px";

        playIcon.style.display = "none";
      } else {
        container.style.padding = "16px 30px";

        text.style.fontSize = "16px";
        text.style.flex = "none";

        button.style.fontSize = "16px";
        button.style.padding = "2px 12px";
        button.style.marginLeft = "30px";
        button.style.flexShrink = "none";
        button.style.height = "35px";

        playIcon.style.display = "inline-block";
      }
    }
  }

  function createStyles(styles) {
    var style = create("style");
    document.head.appendChild(style);
    var stylesKeys = Object.keys(styles);

    for (var i = 0; i < stylesKeys.length; i++) {
      insertStyle(style, stylesKeys[i], styles[stylesKeys[i]]);
    }
  }

  function insertStyle(stylesheet, selector, styles) {
    var rule = selector + "{";
    var keys = Object.keys(styles);

    for (var i = 0; i < keys.length; i++) {
      var attribute = keys[i];
      var value = styles[attribute];
      rule += attribute + ":" + value + ";";
    }

    rule += "}";
    stylesheet.sheet.insertRule(rule);
  }
})();
