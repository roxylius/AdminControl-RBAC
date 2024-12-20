import { extendTheme } from "@chakra-ui/react";
import { CardComponent } from "./additions/card/card";
import { buttonStyles } from "./components/button";
import { inputStyles } from "./components/input";
import { switchStyles } from "./components/switch";
import { linkStyles } from "./components/link";
// import { breakpoints } from "./foundations/breakpoints";
import { globalStyles } from "./styles";
export default extendTheme(
  // { breakpoints }, // Breakpoints
  globalStyles,
  // badgeStyles, // badge styles
  buttonStyles, // button styles
  linkStyles, // link styles
  inputStyles, // input styles
  switchStyles, // switch styles
  CardComponent // card component
);
