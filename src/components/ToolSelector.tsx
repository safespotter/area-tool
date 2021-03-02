import React from 'react';
import { Tool } from '../utilities/types';
import { Button } from '@material-ui/core';
import './ToolSelector.scss';

type ToolSelectorProps = {
    value?: Tool;
    onSelect?: () => void;
    onAdd?: () => void;
    onSetDirections?: () => void;
};

export default function ToolSelector({ value, onSelect, onAdd, onSetDirections }: ToolSelectorProps) {
    return (
        <div className="ToolSelector">
            {onAdd ? <Button
                variant={value === Tool.ADD ? "contained" : "outlined"}
                color="secondary"
                onClick={onAdd}
            >
                ADD
            </Button>
                : ""}

            {onSelect ? <Button
                variant={value === Tool.SELECT ? "contained" : "outlined"}
                color="secondary"
                onClick={onSelect}
            >
                SELECT
            </Button>
                : ""}
            {onSetDirections ? <Button
                variant={value === Tool.SET_DIRECTIONS ? "contained" : "outlined"}
                color="secondary"
                onClick={onSetDirections}
            >
                DIRECTIONS
            </Button>
                : ""}
        </div>
    );
}