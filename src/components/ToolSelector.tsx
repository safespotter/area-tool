import React from 'react';
import { Tool } from '../utilities/types';
import { Button } from '@material-ui/core';
import './ToolSelector.scss';

type ToolSelectorProps = {
    value?: Tool;
    onSelect?: () => void;
    onAdd?: () => void;
};

export default function ToolSelector({ value, onSelect, onAdd }: ToolSelectorProps) {
    return (
        <div className="ToolSelector">
            <Button
                variant={value === Tool.ADD ? "contained" : "outlined"}
                color="secondary"
                onClick={onAdd}
            >
                ADD
            </Button>

            <Button
                variant={value === Tool.SELECT ? "contained" : "outlined"}
                color="secondary"
                onClick={onSelect}
            >
                SELECT
            </Button>
        </div>
    );
}