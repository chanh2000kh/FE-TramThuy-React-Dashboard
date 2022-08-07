import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
// material
import { styled } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
import callApi from '../../../api/ApiSevice';
// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

CommentListToolbar.propTypes = {
  selected: PropTypes.array,
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function CommentListToolbar({ selected, numSelected, filterName, onFilterName }) {
  const Cancel = () => {
    selected.forEach((id) => {
      const data = {
        reviewId: id,
        verify: 0,
      };
      callApi(`api/review/verifyReview`, 'PUT', data)
        .then((res) => {})
        .catch((err) => {
          window.alert('Hủy thất bại');
          window.location.reload();
          console.log(err);
        });
    });
    window.alert('Hủy thành công');
    window.location.reload();
  };
  const Accept = () => {
    selected.forEach((id) => {
        const data = {
          reviewId: id,
          verify: 1,
        };
        callApi(`api/review/verifyReview`, 'PUT', data)
          .then((res) => {})
          .catch((err) => {
            window.alert('Xác nhận thất bại');
            window.location.reload();
            console.log(err);
          });
      });
      window.alert('Xác nhận thành công');
      window.location.reload();
  };
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 && (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      )}

      {numSelected > 0 && (
        <>
          <Tooltip title="Accept" onClick={()=> Accept()}>
            <IconButton>
              <Iconify icon="eva:checkmark-fill" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel" onClick={() => Cancel()}>
            <IconButton>
              <Iconify icon="eva:close-outline" />
            </IconButton>
          </Tooltip>
        </>
      )}
    </RootStyle>
  );
}
