import React from 'react';
import { Tool } from '../utilities/types';
import './ToolSelector.css';

type ToolSelectorProps = {
    value?: Tool;
    onSelect?: () => void;
    onAdd?: () => void;
};

export default function ToolSelector({ value, onSelect, onAdd }: ToolSelectorProps) {
    return (
        <div className="ToolSelector">
            <button
                className={value === Tool.SELECT ? "active" : ""}
                onClick={onSelect}
            >
                SELECT
                
            </button>

            <button
                className={value === Tool.ADD ? "active" : ""}
                onClick={onAdd}
            >
                ADD

            </button>
        </div>
    );
}