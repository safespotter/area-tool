import React from 'react';
import { Options } from '../utilities/types';
import { Button } from '@material-ui/core';
import './OptionSelector.scss';
import { ArrowForward } from '@material-ui/icons';

type OptionSelectorProps = {
    options: Options;
    updateOptions: (o: Options) => void;
};

export default function OptionSelector({ options, updateOptions }: OptionSelectorProps) {
    return (
        <div className="OptionSelector">
            <Button
                variant={options.ids ? "contained" : "outlined"}
                onClick={() => updateOptions({ ...options, ids: !options.ids })}
            >
                IDs
            </Button>

            <Button
                variant={options.arrows ? "contained" : "outlined"}
                onClick={() => updateOptions({ ...options, arrows: !options.arrows })}
            >
                <ArrowForward />
            </Button>
        </div>
    );
}