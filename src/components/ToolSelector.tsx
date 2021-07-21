import React from "react";
import { Tool } from "../utilities/types";
import "./ToolSelector.scss";

type ToolSelectorProps = {
  value?: Tool;
  onSelect?: () => void;
  onAdd?: () => void;
  onSetDirections?: () => void;
  onToggleType?: () => void;
};

export default function ToolSelector({
  value,
  onSelect,
  onAdd,
  onSetDirections,
  onToggleType,
}: ToolSelectorProps) {
  return (
    <div className="ToolSelector">
      {onAdd ? (
        <button
          className={`btn secondary ${
            value === Tool.ADD ? "contained" : "outlined"
          }`}
          onClick={onAdd}
        >
          ADD
        </button>
      ) : (
        ""
      )}

      {onSelect ? (
        <button
          className={`btn secondary ${
            value === Tool.SELECT ? "contained" : "outlined"
          }`}
          onClick={onSelect}
        >
          SELECT
        </button>
      ) : (
        ""
      )}
      {onSetDirections ? (
        <button
          className={`btn secondary ${
            value === Tool.SET_DIRECTIONS ? "contained" : "outlined"
          }`}
          onClick={onSetDirections}
        >
          DIRECTIONS
        </button>
      ) : (
        ""
      )}

      {onToggleType ? (
        <button
          className={`btn secondary ${
            value === Tool.TOGGLE_TYPE ? "contained" : "outlined"
          }`}
          onClick={onToggleType}
        >
          TYPES
        </button>
      ) : (
        ""
      )}
    </div>
  );
}
