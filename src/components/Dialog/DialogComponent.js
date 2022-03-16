import Dialog from '@mui/material/Dialog';
import { useSelector } from 'react-redux';

// import { useDispatch, useSelector } from 'react-redux';
// import { closeDialog } from '../../store/dialogSlice';

const DialogComponent = () => {
  // const dispatch = useDispatch();
  const open = useSelector((state) => state.dialog.state);
  const options = useSelector((state) => state.dialog.options);

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown={true}
      // onClose={() => dispatch(closeDialog())}
      aria-labelledby="dialog-title"
      classes={{
        paper: 'rounded-8'
      }}
      {...options}
    />
  );
};

export default DialogComponent;
