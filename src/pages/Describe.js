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
  Modal,
  TextField,
  Box,
  TextareaAutosize,
} from '@mui/material';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import parse from 'html-react-parser';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import DescribeListToolbar from '../sections/@dashboard/describe/DescribeListToolbar';
import DescribeMoreMenu from '../sections/@dashboard/describe/DescribeMoreMenu';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import callApi from '../api/ApiSevice';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Tên mô tả', alignRight: false },
  { id: 'list', label: 'Danh sách tiêu đề', alignRight: false },
  { id: 'day', label: 'Ngày tạo', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------
function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

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
    return filter(array, (data) => data.describeName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function Describe() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [describe, setDescribe] = useState([]);
  const [describeName, setDescribeName] = useState('');
  const [listDescribe, setListDescribe] = useState([]);
  const [name, setName] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const loadDescribe = () => {
    callApi(`api/Describe/getDescribe?limit=50&skip=1`, 'GET')
      .then((res) => {
        setDescribe(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [openAdd, setOpenAdd] = useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const addListDescribe = () => {
    const data = {
      name,
      detail: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    };
    setListDescribe((prev) => [...prev, data]);
    setName('');
    setEditorState(EditorState.createEmpty());
  };
  const deleteListDescribe = (i) => {
    const newDescribe = listDescribe.filter((data, index) => {
      return index !== i;
    });
    setListDescribe(newDescribe);
  };
  const saveAdd = () => {
    const data = {
      describeName,
      listDescribe,
    };
    callApi(`api/Describe/addDescribe`, 'POST', data)
      .then((res) => {
        window.alert('Thêm mô tả thành công');
        setDescribeName('');
        setListDescribe([]);
        setName('');
        setEditorState(EditorState.createEmpty());
        loadDescribe();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (localStorage.getItem('accessToken') === '') navigate('/login');
    loadDescribe();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = describe.map((n) => n._id);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - describe.length) : 0;

  const filteredUsers = applySortFilter(describe, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Describe">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Mô tả
          </Typography>
          <Button onClick={handleOpenAdd} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Tạo mô tả
          </Button>
        </Stack>

        <Modal
          open={openAdd}
          onClose={handleCloseAdd}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <TextField
              value={describeName}
              onChange={(event) => setDescribeName(event.target.value)}
              id="describeName"
              label="Tên mô tả"
              variant="outlined"
              style={{ width: '100%' }}
            />
            <TextField
              value={name}
              onChange={(event) => setName(event.target.value)}
              id="name"
              label="Tên tiêu đề"
              variant="outlined"
              style={{ width: '100%', marginTop: '5px' }}
            />
            <h4 style={{ marginTop: '5px', marginBottom: '5px' }}>Nội dung tiêu đề</h4>
            <Editor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={setEditorState}
            />
            <Button onClick={addListDescribe} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Thêm tiêu đề
            </Button>
            <h2>Danh sách tiêu đề đã thêm</h2>
            {listDescribe.map((data, i) => {
              return (
                <div style={{display: "flex", justifyContent: "space-between", marginTop: "5px", alignItems: "center"}}>
                  <h3>{data.name}</h3>
                  <Button onClick={()=>deleteListDescribe(i)} variant="contained" style={{background: "#8B0000"}}>
                    Xóa
                  </Button>
                </div>
              );
            })}
            <Button onClick={saveAdd} variant="contained" style={{background: "#32CD32"}}>
              Lưu
            </Button>
          </Box>
        </Modal>

        <Card>
          <DescribeListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={describe.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, describeName, listDescribe } = row;
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
                            <Typography variant="subtitle2" noWrap>
                              {describeName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">
                          {listDescribe.map((data) => {
                            return <>{data.name} / </>;
                          })}
                        </TableCell>
                        <TableCell align="left">{formatDate(row.createdAt)}</TableCell>

                        <TableCell align="right">
                          <DescribeMoreMenu id={_id} />
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
            count={describe.length}
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
