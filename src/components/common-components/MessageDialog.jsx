import React, { useState, useEffect } from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';

export const MessageDialog = ({ dialogOption }) => {
    //console.log('MessageDialog', dialogOption);
    const [visible, setVisible] = useState(false);

    const closeDialog = () => {
        setVisible(false);
        if(dialogOption.closeDialog) {
            dialogOption.closeDialog();
        }
    }

    useEffect(() => {
        setVisible(dialogOption.showDialog);
        return () => ({payload : dialogOption})
    }, [dialogOption])

    return (
        <div>
            {visible && <Dialog title={dialogOption.title} onClose={closeDialog}>
                <p style={{ margin: "25px 100px", textAlign: "center" }}>{dialogOption.message}</p>
                <DialogActionsBar>
                    <button className="k-button" onClick={closeDialog}>OK</button>
                </DialogActionsBar>
            </Dialog>}
        </div>
    );
}
