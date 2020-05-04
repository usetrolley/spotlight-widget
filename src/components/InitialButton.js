import create from "../helpers/create";
import "../styles/initialButton.scss";

export default (isAudio) => {
  if (isAudio) {
    var button = create("a");
    button.classList = "spotlt_button";
    button.innerHTML = "LISTEN";
    return button;
  }
};
