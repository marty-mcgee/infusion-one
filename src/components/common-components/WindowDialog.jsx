import React, { useState, Children, useEffect } from 'react';
import { Window } from '@progress/kendo-react-dialogs';

const WindowDialog = ({children, title, handleOnDialogClose, initialHeight = 350, showDialog = false, width = 300, ...props}) => {
    const [visible, setVisible] = useState(showDialog);

    useEffect(() => {
        console.log('visible', visible)
        return () => setVisible(false);
    }, [visible])

    const onDialogClose = () => {
        setVisible(false);
        try {
            handleOnDialogClose(false);
        } catch (err) {

        }
    }

    return (
        <div>
            {visible &&
                <Window title={title} onClose={onDialogClose} {...props} initialHeight={initialHeight} width={width}>
                    {children}
                </Window>}
        </div>
    );
}

export default WindowDialog;