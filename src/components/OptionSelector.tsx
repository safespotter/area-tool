import React from "react";
import { Options } from "../utilities/types";
import "./OptionSelector.scss";
import { ArrowUpward } from "@material-ui/icons";

type OptionSelectorProps = {
  options: Options;
  updateOptions: (o: Options) => void;
};

export default function OptionSelector({
  options,
  updateOptions,
}: OptionSelectorProps) {
  return (
    <div className="OptionSelector">
      <button
        className={`btn ${options.ids ? "contained" : "outlined"}`}
        onClick={() => updateOptions({ ...options, ids: !options.ids })}
      >
        IDs
      </button>

      <button
        className={`btn ${options.arrows ? "contained" : "outlined"}`}
        onClick={() => updateOptions({ ...options, arrows: !options.arrows })}
      >
        <ArrowUpward />
      </button>
    </div>
  );
}
