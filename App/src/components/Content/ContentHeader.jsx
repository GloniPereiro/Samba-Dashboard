import { sections } from "../sections";
import "./Zasoby.css";

export default function ContentHeader({ activeSection }) {
  return (
    <h2 className="content-header">{sections[activeSection].label}</h2>
  );
}
