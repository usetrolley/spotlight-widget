import create from "../helpers/create";
import makeInitialButton from "./InitialButton";
import makeHeadline from "./Headline";

const buildAudioInner = (spotlight) => {
  var innerContainer = create("div");
  innerContainer.classList = "spotlt_content";

  var p = makeHeadline(spotlight.headline);
  var button = makeInitialButton("audio");

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

  var domain = window.location.hostname.split(".");
  var hostname = "";
  if (domain.length > 2) {
    hostname = domain[1];
  } else {
    hostname = domain[0];
  }

  var isSameHost = spotlight.ctaUrl.indexOf(hostname) > -1;

  if (spotlight.openNewTab || !isSameHost) {
    audioCta.target = "_blank";
  }
  audioCta.addEventListener("click", function () {
    spotlight.track("click");
  });

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

  innerContainer.appendChild(p);
  innerContainer.appendChild(button);

  return innerContainer;
};

export default buildAudioInner;
