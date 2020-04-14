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
      ".spotlt_content.fadeout": {
        opacity: 0,
      },
      ".spotlt_container": {
        position: "relative",
        "z-index": 10000,
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        height: "60px",
        color: spotlight.secondaryColor,
        "background-color": spotlight.primaryColor,
        width: "100%",
        overflow: "hidden",
      },
      ".spotlt_container .spotlt_content": {
        display: "flex",
        "max-width": "800px",
        "justify-content": "center",
        "align-content": "center",
        width: "100%",
        opacity: 1,
        "transition-duration": "200ms",
      },
      ".spotlt_container .spotlt_player_overlay": {
        position: "absolute",
        "transition-duration": "100ms",
        "z-index": 500,
        "pointer-events": "none",
        top: 0,
        left: 0,
        "background-color": spotlight.secondaryColor,
        opacity: 0.1,
        width: "0%",
        height: "60px",
      },
      ".spotlt_container .spotlt_player": {
        display: "flex",
        "max-width": "800px",
        "flex-direction": "column",
        "align-content": "center",
        width: "100%",
      },
      ".spotlt_container .spotlt_time_bar": {
        position: "absolute",
        top: 0,
        left: 0,
        padding: "0 5px",
        display: "flex",
        "justify-content": "space-between",
        width: "100%",
      },
      ".spotlt_container .spotlt_time_number": {
        "font-size": "10px",
        "line-height": "18px",
        "font-weight": "bold",
        "font-family": "Roboto, sans-serif",
        color: spotlight.secondaryColor,
        padding: "0",
        margin: "0",
      },
      ".spotlt_container .spotlt_controlRow": {
        display: "flex",
        "justify-content": "space-between",
        "align-items": "center",
        width: "100%",
        flex: 1,
      },
      ".spotlt_container .spotlt_dotdotdot": {
        cursor: "pointer",
        "background-color": "transparent",
        border: "none",
        color: spotlight.secondaryColor,
        display: "flex",
        "align-items": "center",
        "justify-content": "space-around",
        height: "30px",
        width: "30px",
        padding: 0,
      },

      ".spotlt_container .spotlt_dot": {
        height: "6px",
        width: "6px",
        "border-radius": "50%",
        "background-color": spotlight.secondaryColor,
      },

      ".spotlt_container .spotlt_custom_play_pause": {
        flex: 1,
        cursor: "pointer",
        display: "flex",
        outline: "none",
        "justify-content": "center",
        "align-items": "center",
        "background-color": "transparent",
        border: "none",
        padding: "6px 0",
      },

      ".spotlt_container .spotlt_custom_pause": {
        display: "flex",
        "justify-content": "space-between",
        "align-content": "center",
        width: "14px",
        "transition-duration": "200ms",
        opacity: 1,
      },
      ".spotlt_container .spotlt_custom_pause_bar": {
        "background-color": spotlight.secondaryColor,
        "border-radius": "20px",
        width: "4px",
        height: "16px",
        cursor: "pointer",
        "pointer-events": "none",
      },

      ".spotlt_container .spotlt_custom_pause.fadeout": {
        opacity: 0,
      },

      ".spotlt_container .spotlt_custom_play": {
        display: "flex",
        "justify-content": "center",
        "align-content": "center",
        width: "20px",
        position: "relative",
        height: "20px",
        top: "0px",
        left: "7px",
        "transition-duration": "200ms",
        opacity: 1,
        "border-width": "11px",
        "border-radius": "4px",
        "border-style": "solid",
        "border-color":
          "transparent transparent transparent " + spotlight.secondaryColor,
      },

      ".spotlt_container .spotlt_custom_play.fadeout": {
        opacity: 0,
      },

      ".spotlt_container .spotlt_middle_controls": {
        display: "flex",
        "justify-content": "space-around",
        "align-items": "center",
        height: "40px",
        width: "105px",
      },
      ".spotlt_container .spotlt_audio_cta": {
        "background-color": "transparent",
        "border-radius": "3px",
        cursor: "pointer",
        margin: 0,
        padding: "3px 14px",
        "transition-duration": ".2s",
        "font-weight": "bold",
        "font-size": "12px",
        "font-family": "Roboto, sans-serif",
        "letter-spacing": "1.33px",
        display: "flex",
        "align-items": "center",
        height: "28px",
        "align-self": "center",
        "min-width": "60px",
        color: spotlight.secondaryColor,
        border: "2px solid " + spotlight.secondaryColor,
      },

      ".spotlt_container .spotlt_audio_cta:hover": {
        "background-color": spotlight.secondaryColor,
        color: spotlight.primaryColor,
      },

      ".spotlt_container .spotlt_side_left": {
        display: "flex",
        "justify-content": "flex-start",
        flex: 1,
      },
      ".spotlt_container .spotlt_side_right": {
        display: "flex",
        "justify-content": "flex-end",
        flex: 1,
      },

      // start mobile styles -------------------------------------------------

      ".spotlt_container .spotlt_side_right.mobile .spotlt_middle_controls": {
        "justify-content": "flex-end",
        width: "unset",
      },

      ".spotlt_container .spotlt_side_right.mobile .spotlt_custom_play_pause": {
        flex: "none",
        "justify-content": "center",
        width: "35px",
      },

      ".spotlt_container .spotlt_side_right.mobile .spotlt_fwd5": {
        display: "none",
      },
      ".spotlt_container .spotlt_side_right.mobile .spotlt_back5": {
        transform: "scale(0.85)",
      },

      // -------------------------------------------------
      ".spotlt_container .spotlt_fwd5": {
        margin: 0,
        padding: "0px 4px",
        position: "relative",
        cursor: "pointer",
        "user-select": "none",
      },
      ".spotlt_container .spotlt_back5": {
        margin: 0,
        padding: "0px 4px",
        position: "relative",
        cursor: "pointer",
        "user-select": "none",
      },
      ".spotlt_container .spotlt_fwd5_circle": {
        height: "20px",
        width: "20px",
        "border-radius": "50%",
        border: "2px solid " + spotlight.secondaryColor,
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        "font-size": "10px",
        "font-family": "Roboto, sans-serif",
      },
      ".spotlt_container .spotlt_fwd5_arrow": {
        position: "absolute",
        "z-index": 3,
        top: "-2px",
        left: "12px",
        height: "7px",
        width: "7px",
        background: spotlight.primaryColor,
        "border-width": "3px",
        "border-style": "solid",
        "border-color":
          "transparent transparent transparent " + spotlight.secondaryColor,
      },
      ".spotlt_container .spotlt_back5_arrow": {
        position: "absolute",
        "z-index": 3,
        top: "-2px",
        right: "12px",
        height: "7px",
        width: "7px",
        background: spotlight.primaryColor,
        "border-width": "3px",
        "border-style": "solid",
        "border-color":
          "transparent " +
          spotlight.secondaryColor +
          " transparent transparent",
      },
      ".spotlt_container .spotlt_text": {
        "font-size": "16px",
        "font-family": "Roboto, sans-serif",
        "align-self": "center",
        "font-weight": "500",
        color: spotlight.secondaryColor,
        "line-height": "16px",
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
        "font-family": "Roboto, sans-serif",
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

      // build the player UI ------------------------------
      // build the second counters
      var runningTime = create("p");
      runningTime.classList = "spotlt_time_number";
      runningTime.innerHTML = "0:00";

      var timeLeft = create("p");
      timeLeft.classList = "spotlt_time_number";

      // build the time bar
      var timeBar = create("div");
      timeBar.classList = "spotlt_time_bar";
      timeBar.appendChild(runningTime);
      timeBar.appendChild(timeLeft);

      // build the dot dot dot button
      var dotdotdot = create("button");
      dotdotdot.classList = "spotlt_dotdotdot";
      var dot = create("div");
      dot.classList = "spotlt_dot";
      var dot2 = create("div");
      dot2.classList = "spotlt_dot";
      var dot3 = create("div");
      dot3.classList = "spotlt_dot";

      dotdotdot.appendChild(dot);
      dotdotdot.appendChild(dot2);
      dotdotdot.appendChild(dot3);

      var sideContainer1 = create("div");
      sideContainer1.classList = "spotlt_side_left";
      sideContainer1.appendChild(dotdotdot);

      var playPauseButton = create("button");
      playPauseButton.classList = "spotlt_custom_play_pause";

      var pauseContainer = create("div");
      pauseContainer.classList = "spotlt_custom_pause";

      var pauseBar1 = create("div");
      pauseBar1.classList = "spotlt_custom_pause_bar";
      var pauseBar2 = create("div");
      pauseBar2.classList = "spotlt_custom_pause_bar";

      pauseContainer.appendChild(pauseBar1);
      pauseContainer.appendChild(pauseBar2);

      var playTriangle = create("div");
      playTriangle.classList = "spotlt_custom_play fadeout";

      playPauseButton.appendChild(pauseContainer);

      playPauseButton.addEventListener("click", function () {
        if (spotlight.paused()) {
          spotlight.play();

          playTriangle.classList = "spotlt_custom_play fadeout";
          setTimeout(function () {
            playPauseButton.innerHTML = "";
            playPauseButton.appendChild(pauseContainer);
            pauseContainer.classList = "spotlt_custom_pause";
          }, 200);
        } else {
          spotlight.pause();

          pauseContainer.classList = "spotlt_custom_pause fadeout";
          setTimeout(function () {
            playPauseButton.innerHTML = "";
            playPauseButton.appendChild(playTriangle);
            playTriangle.classList = "spotlt_custom_play";
          }, 200);
        }
      });

      // build middle container
      var middleControls = create("div");
      middleControls.classList = "spotlt_middle_controls";

      var fwd5 = create("div");
      fwd5.classList = "spotlt_fwd5";
      var fwd5Circle = create("div");
      fwd5Circle.classList = "spotlt_fwd5_circle";
      fwd5Circle.innerHTML = "5";
      var circleBlock = create("div");
      circleBlock.classList = "spotlt_fwd5_arrow";

      fwd5.appendChild(fwd5Circle);
      fwd5.appendChild(circleBlock);

      fwd5.addEventListener("click", function () {
        spotlight.jump(true);
      });

      var back5 = create("div");
      back5.classList = "spotlt_back5";
      var back5Circle = create("div");
      back5Circle.classList = "spotlt_fwd5_circle";
      back5Circle.innerHTML = "5";

      back5.addEventListener("click", function () {
        spotlight.jump(false);
      });

      var circleBlockBack = create("div");
      circleBlockBack.classList = "spotlt_back5_arrow";

      back5.appendChild(back5Circle);
      back5.appendChild(circleBlockBack);

      middleControls.appendChild(back5);
      middleControls.appendChild(playPauseButton);
      middleControls.appendChild(fwd5);

      // build cta button for after audio is pressed
      var audioCta = create("a");
      audioCta.classList = "spotlt_audio_cta";
      audioCta.innerHTML = spotlight.ctaText.toUpperCase();
      audioCta.href =
        spotlight.ctaUrl.indexOf("http") > -1
          ? spotlight.ctaUrl
          : "https://" + spotlight.ctaUrl;
      if (spotlight.openNewTab) {
        audioCta.target = "_blank";
      }

      var sideContainer2 = create("div");
      sideContainer2.classList = "spotlt_side_right";
      sideContainer2.appendChild(middleControls);
      window.Spotlight.rightSideContainer = sideContainer2;

      // make the control row (below the time row)
      var controlRow = create("div");
      controlRow.classList = "spotlt_controlRow";
      controlRow.appendChild(sideContainer1);
      controlRow.appendChild(audioCta);
      controlRow.appendChild(sideContainer2);
      window.Spotlight.controlRow = controlRow;

      var overlay = create("div");
      overlay.classList = "spotlt_player_overlay";
      overlay.id = "spotlt_overlay";

      // final assembly
      var playerContainer = create("div");
      playerContainer.classList = "spotlt_player";
      playerContainer.appendChild(timeBar);
      playerContainer.appendChild(controlRow);

      // helper function to set the times
      function setTimes() {
        function formatTime(timeToFormat) {
          var currentMin = 0;
          var measureMinutes = Math.ceil(timeToFormat);
          while (measureMinutes >= 60) {
            currentMin += 1;
            measureMinutes -= 60;
          }
          var currentSec = Math.ceil(timeToFormat - currentMin * 60);
          currentSec = currentSec < 10 ? "0" + currentSec : currentSec;
          return currentMin + ":" + currentSec;
        }

        runningTime.innerHTML = formatTime(audio.currentTime);

        var timeRemaining = audio.duration - audio.currentTime;
        timeLeft.innerHTML = "-" + formatTime(timeRemaining);
      }

      window.Spotlight.play = function () {
        audio.play();

        if (!spotlight.ctaText) {
          button.classList = "spotlt_button pause";
          button.childNodes[0].nodeValue = "PAUSE";

          if (!spotlight.wasPlayed) {
            // analytics to start the audio
            spotlight.track("start");
            spotlight.wasPlayed = true;
          }
        } else {
          //function to keep the times/overlay animating
          function startInterval() {
            window.Spotlight.intervalId = setInterval(function () {
              setTimes();
              document.getElementById("spotlt_overlay").style.width =
                100 * (audio.currentTime / audio.duration) + "%";
            }, 100);
          }

          // check to see if this is the first time the audio is played
          if (!spotlight.wasPlayed) {
            // analytics to start the audio
            spotlight.track("start");
            spotlight.wasPlayed = true;
            innerContainer.classList = "spotlt_content fadeout";
            setTimeout(function () {
              innerContainer.innerHTML = "";
              innerContainer.appendChild(overlay);
              innerContainer.appendChild(playerContainer);
              innerContainer.classList = "spotlt_content";
              startInterval();
            }, 200);
          } else {
            startInterval();
          }
        }
      };

      window.Spotlight.pause = function () {
        clearInterval(window.Spotlight.intervalId);
        audio.pause();
        if (!spotlight.ctaText) {
          button.classList = "spotlt_button";
          button.childNodes[0].nodeValue = "LISTEN";
        }
      };

      window.Spotlight.paused = function () {
        return audio.paused;
      };

      window.Spotlight.jump = function (jumpFwd) {
        var jump = jumpFwd ? 5 : -5;
        audio.currentTime = audio.currentTime + jump;
        setTimes();
        document.getElementById("spotlt_overlay").style.width =
          100 * (audio.currentTime / audio.duration) + "%";
      };

      audio.onended = function () {
        spotlight.track("finish");
        audio.currentTime = 0;
        spotlight.pause();
        setTimes();
        pauseContainer.classList = "spotlt_custom_pause fadeout";
        setTimeout(function () {
          playPauseButton.innerHTML = "";
          playPauseButton.appendChild(playTriangle);
          playTriangle.classList = "spotlt_custom_play";
        }, 200);
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

      innerContainer.appendChild(p);
      if (spotlight.ctaText) {
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

        innerContainer.appendChild(button);
      }

      return innerContainer;
    }
  }

  function createEventListeners() {
    var button = document.getElementsByClassName("spotlt_button")[0];

    // show/hide on scroll
    var isScrolled = false;
    window.addEventListener("scroll", function () {
      if (window.scrollY > 60 && !isScrolled) {
        document.getElementById("wrapper").style.transform = "none";
        isScrolled = true;
      } else if (window.scrollY <= 60) {
        document.getElementById("wrapper").style.transform = "scale(1.0)";
        isScrolled = false;
      }
    });

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
        if (rightSideContainer) {
          rightSideContainer.classList = "spotlt_side_right";
        }
        container.style.padding = "16px 30px";
        text.style.fontSize = "16px";
        text.style.flex = "none";

        button.style.fontSize = "14px";
        button.style.padding = "2px 12px";
        button.style.marginLeft = "30px";
        button.style.flexShrink = "none";
        button.style.height = "30px";

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
