import React from "react";
import Flag from "react-world-flags";
import { langToCountry } from "../constants/Flags";

const StableFlag = React.memo(({ code, className }) => {
  return <Flag code={langToCountry[code]} className={className} />;
});

StableFlag.displayName = "StableFlag";

export default StableFlag;
