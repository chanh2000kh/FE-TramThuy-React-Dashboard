import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import ProductListToolbar from '../sections/@dashboard/productsTramThuy/ProductListToolbar';
import ProductMoreMenu from '../sections/@dashboard/productsTramThuy/ProductMoreMenu';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import FormatPrice from '../sevices/FormatPrice'
// mock
import USERLIST from '../_mock/user';
import callApi from '../api/ApiSevice';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Tên sản phẩm', alignRight: false },
  { id: 'price', label: 'Giá', alignRight: false },
  { id: 'numberOfRemain', label: 'Số lượng còn lại', alignRight: false },
  { id: 'numberOfSold', label: 'Số lượng đã bán', alignRight: false },
  { id: 'numberOfReview', label: 'Số lượng đánh giá', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (data) => data.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ProductTramThuy() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  // List-ProductType--------------
  const [listProductType, setListProductType] = useState([]);
  const [productTypeId, setproductTypeId] = useState('');
  const loadListProductType = () => {
    callApi(`api/producttype/getProductTypeAll?limit=15&skip=1`, 'GET')
      .then((res) => {
        setListProductType(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeProductType = (event) => {
    setproductTypeId(event.target.value);
  };
  // List-ProductType--------------
  useEffect(() => {
    if (localStorage.getItem('accessToken') === '') navigate('/login');
    // callApi(`api/cart/getCartHaventToken`, 'POST')
    //   .then((res) => {})
    //   .catch((err) => {
    //     console.log(err);
    //   });
    loadListProductType();
  }, []);
  // List product-----------------------------------
  const [listProduct, setListProduct] = useState([]);
  const loadListProductByTypeId = ()=>{
    callApi(`api/product/getProductByTypeId?id=${productTypeId}&limit=50&skip=1&min=0&max=10000000`, 'GET')
      .then((res) => {
        setListProduct(res.data.data.product);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    loadListProductByTypeId()
  }, [productTypeId]);
  // ---------------------------------------------
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listProduct.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listProduct.length) : 0;

  const filteredUsers = applySortFilter(listProduct, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Product">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách sản phẩm
          </Typography>
          <Button variant="contained" component={RouterLink} to="/dashboard/producttramthuyadd" startIcon={<Iconify icon="eva:plus-fill" />}>
            Thêm sản phẩm mới
          </Button>
        </Stack>
        <Box sx={{ minWidth: 120 }}>
          <FormControl style={{ width: '50%', marginBottom: '10px' }}>
            <InputLabel id="demo-simple-select-label">Danh sách loại sản phẩm</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={productTypeId}
              label="Danh sách loại sản phẩm"
              onChange={handleChangeProductType}
            >
              {listProductType.map((data) => {
                return <MenuItem value={data._id}>{data.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Box>
        <Card>
          <ProductListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={listProduct.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, name} = row;
                    const isItemSelected = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, _id)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={row.img[0]} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{FormatPrice(row.price)} ₫</TableCell>
                        <TableCell align="left">{row.numberOfRemain}</TableCell>
                        <TableCell align="left">{row.numberOfSold}</TableCell>
                        <TableCell align="left">{row.numberOfReview}</TableCell>
                        <TableCell align="right">
                          <ProductMoreMenu id={_id}/>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={listProduct.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
