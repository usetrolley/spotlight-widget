import create from "./create";
function addStyleTag(spotlight) {
  var styles = {
    ".spotlt_container": {
      color: spotlight.secondaryColor,
      "background-color": spotlight.primaryColor,
    },
    ".spotlt_container .spotlt_player_overlay": {
      "background-color": spotlight.secondaryColor,
    },

    ".spotlt_container .spotlt_player .spotlt_controlRow .spotlt_side_right .spotlt_middle_controls .spotlt_custom_play_pause .spotlt_custom_pause .spotlt_custom_pause_bar": {
      "background-color": spotlight.secondaryColor,
    },

    ".spotlt_container .spotlt_player .spotlt_controlRow .spotlt_side_right .spotlt_middle_controls .spotlt_custom_play_pause .spotlt_custom_play": {
      "border-color":
        "transparent transparent transparent" + spotlight.secondaryColor,
    },

    ".spotlt_container .spotlt_dotdotdot": {
      color: spotlight.secondaryColor,
    },

    ".spotlt_container .spotlt_dot": {
      "background-color": spotlight.secondaryColor,
    },

    ".spotlt_container .spotlt_audio_cta": {
      color: spotlight.secondaryColor,
      border: "2px solid " + spotlight.secondaryColor,
    },

    ".spotlt_container .spotlt_player .spotlt_controlRow .spotlt_audio_cta:hover": {
      "background-color": spotlight.secondaryColor,
      color: spotlight.primaryColor,
    },

    ".spotlt_container .spotlt_fwd5_circle": {
      border: "2px solid " + spotlight.secondaryColor,
    },
    ".spotlt_container .spotlt_fwd5_arrow": {
      background: spotlight.primaryColor,
      "border-color":
        "transparent transparent transparent " + spotlight.secondaryColor,
    },
    ".spotlt_container .spotlt_back5_arrow": {
      background: spotlight.primaryColor,
      "border-color":
        "transparent " + spotlight.secondaryColor + " transparent transparent",
    },
    ".spotlt_container .spotlt_text": {
      color: spotlight.secondaryColor,
    },
    ".spotlt_container .spotlt_button": {
      color: spotlight.secondaryColor,
      border: "2px solid " + spotlight.secondaryColor,
    },
    ".spotlt_container .spotlt_button:hover": {
      "background-color": spotlight.secondaryColor,
      color: spotlight.primaryColor,
    },
    ".spotlt_container .spotlt_button .spotlt_play-icon-circle": {
      "background-color": spotlight.secondaryColor,
    },
    ".spotlt_container .spotlt_button:hover .spotlt_play-icon-circle": {
      "background-color": spotlight.primaryColor,
      color: spotlight.secondaryColor,
    },
    ".spotlt_container .spotlt_button .spotlt_play-icon-circle .spotlt_icon": {
      "border-color":
        "transparent transparent transparent " + spotlight.primaryColor,
    },
    ".spotlt_container .spotlt_button:hover .spotlt_play-icon-circle .spotlt_icon": {
      "border-color":
        "transparent transparent transparent " + spotlight.secondaryColor,
    },
  };

  var style = create("style");
  document.head.appendChild(style);
  var stylesKeys = Object.keys(styles);

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

  for (var i = 0; i < stylesKeys.length; i++) {
    insertStyle(style, stylesKeys[i], styles[stylesKeys[i]]);
  }
}
export default addStyleTag;
