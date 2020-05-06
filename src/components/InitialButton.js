import create from "../helpers/create";
import "../styles/initialButton.scss";

export default (type) => {
  var button = create("a");
  button.classList = "spotlt_button";

  button.innerHTML = type === "video" ? "WATCH" : "LISTEN";

  var playIcon = create("div");
  playIcon.classList = "spotlt_play-icon-circle";

  var iconInner = create("div");
  iconInner.classList = "spotlt_icon";

  playIcon.appendChild(iconInner);

  button.appendChild(playIcon);

  return button;
};
