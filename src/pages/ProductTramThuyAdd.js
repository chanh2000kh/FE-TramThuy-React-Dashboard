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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Input,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
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

// ----------------------------------------------------------------------
const getEditorState = (html) => {
  const blocks = convertFromHTML(html);
  const content = ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap);

  return EditorState.createWithContent(content);
};
const TypeSize = [
  {
    id: 0,
    name: 'Null',
  },
  {
    id: 1,
    name: 'Loại',
  },
  {
    id: 2,
    name: 'Size',
  },
];
const jewels = [
  {
    id: 1,
    name: 'Vòng tay trầm tốc vương',
  },
  {
    id: 2,
    name: 'Vòng tay trầm sánh chìm',
  },
  {
    id: 3,
    name: 'Vòng trầm hương Việt Nam',
  },
  {
    id: 4,
    name: 'Vòng trầm hương rừng Lào',
  },
  {
    id: 5,
    name: 'Vòng trầm rừng cao cấp',
  },
];
const incense = [
  {
    id: 1,
    name: 'Nhang trầm không tăm',
  },
  {
    id: 2,
    name: 'Nhang khoanh trầm hương',
  },
  {
    id: 3,
    name: 'Nụ rầm hương',
  },
];
function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}
function buildFormData(formData, data, parentKey) {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach((key) => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else {
    const value = data == null ? '' : data;

    formData.append(parentKey, value);
  }
}

function jsonToFormData(data) {
  const formData = new FormData();

  buildFormData(formData, data);

  return formData;
}
export default function ProductTramThuyAdd() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState([]);
  const [numberOfRemain, setNumberOfRemain] = useState(0);
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

  // Size - Type
  const [checkSizeType, setCheckSizeType] = useState(0);
  const [nameSizeType, setNameSizeType] = useState('');
  const [priceSizeType, setPriceSizeType] = useState(0);

  const [type, setType] = useState([]);
  const [size, setSize] = useState([]);

  const addListSizeType = () => {
    if (checkSizeType === 1) {
      setType((prev) => {
        const data = {
          typeName: nameSizeType,
          priceAdd: priceSizeType,
        };
        return [...prev, data];
      });
      setNameSizeType('');
      setPriceSizeType(0);
    }
    if (checkSizeType === 2) {
      setSize((prev) => {
        const data = {
          typeName: nameSizeType,
          priceAdd: priceSizeType,
        };
        return [...prev, data];
      });
      setNameSizeType('');
      setPriceSizeType(0);
    }
  };
  const DeleteListSizeType = (i) => {
    if (checkSizeType === 1) {
      const listNew = type.filter((data, index) => {
        return index !== i;
      });
      setType(listNew);
    }
    if (checkSizeType === 2) {
      const listNew = size.filter((data, index) => {
        return index !== i;
      });
      setSize(listNew);
    }
  };
  // -------------------
  // Tag------------
  const [tag, setTag] = useState(0);
  // -------------
  // Detail Product---------------
  const [detailProduct, setDetailProduct] = useState('');

  // Detail Product----------------
  const [listDescribeId, setListDescribeId] = useState([]);
  const [listDescribeCanChoose, setListDescribeCanChoose] = useState([]);
  const loadListDescribeCanChoose = () => {
    callApi(`api/Describe/getDescribe?limit=50&skip=1`, 'GET')
      .then((res) => {
        setListDescribeCanChoose(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [checked, setChecked] = useState([]);

  const leftChecked = intersection(checked, listDescribeCanChoose);
  const rightChecked = intersection(checked, listDescribeId);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setListDescribeId(listDescribeId.concat(leftChecked));
    setListDescribeCanChoose(not(listDescribeCanChoose, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setListDescribeCanChoose(listDescribeCanChoose.concat(rightChecked));
    setListDescribeId(not(listDescribeId, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} đã chọn`}
      />
      <Divider />
      <List
        sx={{
          width: '100%',
          height: 230,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.describeName} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  // ------------------------------------
  useEffect(() => {
    if (localStorage.getItem('accessToken') === '') navigate('/login');
    loadListProductType();
    loadListDescribeCanChoose();
  }, []);
  // save
  const saveAddProduct = () => {
    // const addProduct = new FormData();
    // addProduct.append('name', name);
    // addProduct.append('price', price);
    // addProduct.append('productTypeId', productTypeId);
    // Array.from(img).forEach((file) => {
    //   addProduct.append('img', file);
    // });
    // addProduct.append('numberOfRemain', numberOfRemain);
    // if (checkSizeType === 1) {
    //   type.forEach((data) => {
    //     addProduct.append('type', JSON.parse(JSON.stringify(data)));
    //   });
    // }
    // if (checkSizeType === 0) {
    //   size.forEach((data) => {
    //     addProduct.append('size', JSON.parse(JSON.stringify(data)));
    //   });
    // }
    // addProduct.append('tag', tag);
    // addProduct.append('detailProduct', draftToHtml(convertToRaw(detailProduct.getCurrentContent())));
    // listDescribeId.forEach((data) => {
    //   addProduct.append('listDescribeId', JSON.parse(JSON.stringify(data)));
    // });
    const data = {
        name,
        price,
        productTypeId,
        numberOfRemain,
        type,
        size,
        tag,
        detailProduct : draftToHtml(convertToRaw(detailProduct.getCurrentContent())),
        listDescribeId
    }
    const addProduct = jsonToFormData(data)
    Array.from(img).forEach((file) => {
      addProduct.append('img', file);
    });
    callApi(`api/product/createProduct`, 'POST', addProduct)
      .then((res) => {
        window.alert('Thêm sản phẩm thành công');
        navigate('/dashboard/products');
      })
      .catch((err) => {
        window.alert('Thêm sản phẩm thất bại');
        console.log(err);
      });
  };
  const Cancel = ()=>{
    navigate('/dashboard/products');
  }
  return (
    <Page title="Add product">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Thêm sản phẩm
        </Typography>
        <Box sx={{ minWidth: 120 }}>
          <FormControl style={{ width: '100%', marginBottom: '10px' }}>
            <InputLabel id="demo-simple-select-label">Chọn loại sản phẩm</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={productTypeId}
              label="Chọn loại sản phẩm"
              onChange={handleChangeProductType}
            >
              {listProductType.map((data) => {
                return <MenuItem value={data._id}>{data.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Box>
        <TextField
          value={name}
          onChange={(event) => setName(event.target.value)}
          id="name"
          label="Tên Sản phẩm"
          variant="outlined"
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <TextField
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          id="name"
          label="Giá"
          variant="outlined"
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <h3>Ảnh sản phẩm</h3>
        <input
          onChange={(event) => setImg(event.target.files)}
          id="img"
          name="img"
          type="file"
          style={{ marginBottom: '10px', marginTop: '10px' }}
          multiple
        />
        <TextField
          value={numberOfRemain}
          onChange={(event) => setNumberOfRemain(event.target.value)}
          id="name"
          label="Số lượng sản phẩm"
          variant="outlined"
          style={{ width: '100%', marginBottom: '10px', marginTop: '10px' }}
        />
        <Box style={{ display: 'flex' }}>
          {TypeSize.map((data) => {
            return (
              <Stack style={{ marginLeft: '10px' }}>
                <h4>{data.name}</h4>
                <Checkbox
                  checked={checkSizeType === data.id}
                  onClick={() => {
                    setCheckSizeType(data.id);
                  }}
                />
              </Stack>
            );
          })}
        </Box>
        {checkSizeType !== 0 && (
          <>
            <Box style={{ width: '100%', marginBottom: '10px', marginTop: '10px', display: 'flex' }}>
              <TextField
                value={nameSizeType}
                onChange={(event) => setNameSizeType(event.target.value)}
                id="nameSizeType"
                label="Tên"
                variant="outlined"
              />
              <TextField
                value={priceSizeType}
                onChange={(event) => setPriceSizeType(event.target.value)}
                id="addPrice"
                label="Giá tiền thêm"
                variant="outlined"
                style={{ marginLeft: '5px' }}
              />
              <Button onClick={() => addListSizeType()} variant="contained" style={{ marginLeft: '5px' }}>
                Thêm
              </Button>
            </Box>
            <h4>Danh sách đã thêm</h4>
            {checkSizeType === 1 && (
              <>
                {type.map((data, i) => {
                  return (
                    <div style={{ display: 'flex', width: '30%', justifyContent: 'space-between', marginTop: '5px' }}>
                      Loại {data.typeName} : Tiền thêm {data.priceAdd} ₫
                      <Button
                        onClick={() => DeleteListSizeType(i)}
                        variant="contained"
                        style={{ background: '#8B0000' }}
                      >
                        Xóa
                      </Button>
                    </div>
                  );
                })}
              </>
            )}

            {checkSizeType === 2 && (
              <>
                {size.map((data, i) => {
                  return (
                    <div style={{ display: 'flex', width: '30%', justifyContent: 'space-between', marginTop: '5px' }}>
                      Size {data.typeName} : Tiền thêm {data.priceAdd} ₫
                      <Button
                        onClick={() => DeleteListSizeType(i)}
                        variant="contained"
                        style={{ background: '#8B0000' }}
                      >
                        Xóa
                      </Button>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
        {productTypeId === '62cd7c7a0d2a3b3e78ed4438' && (
          <div>
            <h3>Danh mục sản phẩm</h3>
            {incense.map((data) => {
              return (
                <div key={data.id}>
                  {data.name}
                  <Checkbox
                    checked={tag === data.id}
                    onClick={() => {
                      setTag(data.id);
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
        {productTypeId === '62cd7b3584e523f391176a97' && (
          <div>
            <h3>Danh mục sản phẩm</h3>
            {jewels.map((data) => {
              return (
                <div key={data.id}>
                  {data.name}
                  <Checkbox
                    checked={tag === data.id}
                    onClick={() => {
                      setTag(data.id);
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
        <h3>Chi tiết sản phẩm</h3>
        <Editor
          defaultEditorState={detailProduct}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={setDetailProduct}
        />
        <h3>Chọn danh sách câu hỏi mô tả</h3>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item>{customList('Danh sách câu hỏi mô tả có sẵn', listDescribeCanChoose)}</Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center">
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>
            </Grid>
          </Grid>
          <Grid item>{customList('Danh sách đã chọn câu hỏi mô tả', listDescribeId)}</Grid>
        </Grid>

        <Button onClick={saveAddProduct} variant="contained" style={{ background: '#32CD32' }}>
          Lưu
        </Button>
        <Button onClick={Cancel} variant="contained" style={{ background: '#8B0000', marginLeft: '10px' }}>
          Hủy
        </Button>
      </Container>
    </Page>
  );
}
