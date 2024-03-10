import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  outline: 0,
  bgcolor: 'background.paper',
  border: '2px solid #017260',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <h5 className="more" onClick={handleOpen}>Need help/More info?</h5>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <div className='info'>
                <h3>Maseno University Final Year Project</h3>
                <Typography id="modal-modal-description" sx={{ mt: 1, mb: 1 }}>
                    <hr />
                </Typography>
                <p><b>Brains behind the project: </b>Paul M. Ndalila</p>
                <p><b>Project Supervisor: </b>Madam Rennish Mboya</p>
                <p><b>Adm Number: </b>Cit/00225/019</p>
                <p><b>Year: </b> 4th Year</p>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    This is a plant disease detection system that utilizes the power of machine learning, Python-fastAPI framework, and ReactJS(Drag and Drop feature) for a user-friendly interface created so it can help farmers detect diseases early in plants. Improvements are being made with time and more variety of crops to be added.
                    <br/>
                    <br/>
                    Thank you for using Crop Oracle!
                    <br/>
                    Paul Ndalila.
                    <br/>
                    <br/>
                    <h6>Maseno University &copy; Department of Information Technology</h6>
                </Typography>
            </div>
        </Box>
      </Modal>
    </>
  );
}