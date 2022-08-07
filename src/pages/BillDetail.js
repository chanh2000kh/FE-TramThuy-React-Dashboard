import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Modal,
  TextField,
  Box,
  TextareaAutosize,
  Grid,
  ButtonBase,
  Paper,
  styled,
} from '@mui/material';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, Draft, convertFromHTML, ContentState } from 'draft-js';
import * as draftToHtml from 'draftjs-to-html';
import parse from 'html-react-parser';

// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// mock
import PRODUCTS from '../_mock/products';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import callApi from '../api/ApiSevice';
import FormatPrice from '../sevices/FormatPrice';
// ----------------------------------------------------------------------
const getEditorState = (html) => {
  const blocks = convertFromHTML(html);
  const content = ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap);

  return EditorState.createWithContent(content);
};
const GetURLParameter = (sParam) => {
  const sPageURL = window.location.search.substring(1);
  const sURLVariables = sPageURL.split('&');
  for (let i = 0; i < sURLVariables.length; i += 1) {
    const sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam) {
      return sParameterName[1].toString();
    }
  }
};
const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});
function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}
export default function DescribeEdit() {
  const navigate = useNavigate();

  const [billId, setBillId] = useState(GetURLParameter('id'));

  const [bill, setBill] = useState({});
  const [day, setDay] = useState('');
  const [totalMoneyBill, setTotalMoneyBill] = useState(0);
  const [listProducts, setListProducts] = useState([]);
  useEffect(() => {
    if (localStorage.getItem('accessToken') === '') navigate('/login');
    callApi(`api/bill/getBillById?id=${billId}`, 'GET')
      .then((res) => {
        setBill(res.data.data);
        setDay(formatDate(res.data.data.createdAt));
        setTotalMoneyBill(FormatPrice(res.data.data.totalMoneyBill));
        setListProducts(res.data.data.products)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const Cancel = () => {
    navigate('/dashboard/bill');
  };
  return (
    <Page title="Bill Detail">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Chi tiết hóa đơn
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Mã hóa đơn:</strong> {bill._id}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Tên:</strong> {bill.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Địa chỉ:</strong> {bill.address}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Số điện thoại:</strong> {bill.phone}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Email:</strong> {bill.email}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Ngày đặt:</strong> {day}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Tổng tiền hóa đơn:</strong> {totalMoneyBill} ₫
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Phương thức thanh toán:</strong> {(bill.payOnline === false && 'COD') || 'Online'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Note:</strong> {bill.note}
        </Typography>
        <Typography variant="h5" sx={{ mb: 5 }}>
          Danh sách sản phẩm:
        </Typography>
        {listProducts.map((data)=>{
            return <Paper
            sx={{
              p: 2,
              margin: 'auto',
              maxWidth: "100%",
              flexGrow: 1,
              backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
              marginTop: "10px",
            }}
          >
            <Grid container spacing={2}>
              <Grid xs={3} item>
                <ButtonBase sx={{ width: "100%", height: 128 }}>
                  <Img alt="complex" src={data.product.img[0]} />
                </ButtonBase>
              </Grid>
              <Grid item xs={10} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <Typography gutterBottom variant="subtitle1" component="div">
                      {data.product.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {(data.check && data.product.size.length > 0) ? <>Size: {data.product.size[data.check].sizeName}</> : ""}
                      {(data.check && data.product.type.length > 0) ? <>Loại: {data.product.type[data.check].typeName}</> : ""}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Số lượng: <strong>{data.amount}</strong>
                    </Typography>
                  </Grid>
                  {/* <Grid item>
                    <Typography sx={{ cursor: 'pointer' }} variant="body2">
                      Remove
                    </Typography>
                  </Grid> */}
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" component="div">
                    {FormatPrice(data.totalMoney)} ₫
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        })}
        
        <Button onClick={Cancel} variant="contained" style={{ background: '#8B0000', marginTop: '10px' }}>
          Hủy
        </Button>
      </Container>
    </Page>
  );
}
