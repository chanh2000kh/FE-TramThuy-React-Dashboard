import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
import callApi from '../../../api/ApiSevice';
// ----------------------------------------------------------------------

export default function CommentMoreMenu(body) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const Cancel = ()=>{
    const data = {
        reviewId : body.id,
        verify: 2
    }
    
    callApi(`api/review/verifyReview`, 'PUT', data)
      .then((res) => {
        window.alert("Hủy thành công")
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const Accept = ()=>{
    const data = {
        reviewId : body.id,
        verify: 1
    }
    
    callApi(`api/review/verifyReview`, 'PUT', data)
      .then((res) => {
        window.alert("Xác nhận thành công")
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={()=>{Accept()}}>
          <ListItemIcon>
            <Iconify icon="eva:checkmark-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Xác nhận" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} onClick={()=>{Cancel()}}>
          <ListItemIcon>
            <Iconify icon="eva:close-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Hủy" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
