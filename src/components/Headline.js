import create from "../helpers/create";
import "../styles/headline.scss";

export default (headline) => {
  const p = create("p");
  p.classList = "spotlt_text";
  p.innerHTML = headline;
  return p;
};
