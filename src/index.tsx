import { createRoot } from "react-dom/client";
import { Root } from "./app";

const root = document.createElement("div") as HTMLElement;
root.id = "root";
root.className = "page";
document.body.append(root);
createRoot(root).render(<Root />);
