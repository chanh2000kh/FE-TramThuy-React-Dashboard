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
const GetURLParameter = (sParam) => {
  const sPageURL = window.location.search.substring(1);
  const sURLVariables = sPageURL.split("&");
  for (let i = 0; i < sURLVariables.length; i += 1) {
    const sParameterName = sURLVariables[i].split("=");
    if (sParameterName[0] === sParam) {
      return sParameterName[1].toString();
    }
  }
};
export default function DescribeEdit() {
  const navigate = useNavigate();

  const [describeId, setDescribeId] = useState(GetURLParameter("id"));
  const [describeName, setDescribeName] = useState('');
  const [listDescribe, setListDescribe] = useState([]);
  const [name, setName] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  useEffect(() => {
    if (localStorage.getItem('accessToken') === '') navigate('/login');
    callApi(`api/Describe/getDescribeById?id=${describeId}`, 'GET')
      .then((res) => {
        setDescribeName(res.data.data.describeName);
        setListDescribe(res.data.data.listDescribe);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const deleteListDescribe = (i) => {
    const newDescribe = listDescribe.filter((data, index) => {
      return index !== i
    });
    setListDescribe(newDescribe)
  };
  const addListDescribe = () => {
    const data = {
      name,
      detail: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    };
    setListDescribe((prev) => [...prev, data]);
    setName('');
    setEditorState(EditorState.createEmpty());
  };
  const onEditorStateChange = (e, i)=>{
    setListDescribe((prev) => {
      prev[i].detail = draftToHtml(convertToRaw(e.getCurrentContent()));
      return [...prev];
    });
  }
  const saveDescribe = ()=>{
    const data = {
      id: describeId,
      describeName,
      listDescribe
    }
    callApi(`api/Describe/editDescribe`, 'PUT', data)
      .then((res) => {
        window.alert("Chỉnh sửa thành công")
        navigate('/dashboard/describe');
      })
      .catch((err) => {
        window.alert("Chỉnh sửa thất bại")
        console.log(err);
      });
  }
  const Cancel = ()=>{
    navigate('/dashboard/describe');
  }
  return (
    <Page title="Edit Describe ">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Chỉnh sửa mô tả
        </Typography>
        
        <TextField
          value={describeName}
          onChange={(event) => setDescribeName(event.target.value)}
          id="describeName"
          label="Tên mô tả"
          variant="outlined"
          style={{ width: '100%' }}
        />
        <h3>Chỗ thêm tiêu đề vào danh sách</h3>
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
        <Button onClick={() => addListDescribe()} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
          Thêm tiêu đề
        </Button>
        <h3>Danh sách tiêu đề</h3>
        {listDescribe.map((data, i) => {
          return (
            <>
              <Button onClick={()=>deleteListDescribe(i)} variant="contained" style={{background: "#8B0000"}}>Xóa</Button>
              <TextField
                value={listDescribe[i].name}
                onChange={(event) => {
                  setListDescribe((prev) => {
                    prev[i].name = event.target.value;
                    return [...prev];
                  });
                }}
                id="name"
                label="Tên tiêu đề"
                variant="outlined"
                style={{ width: '100%', marginTop: '10px' }}
              />
              <Editor
                defaultEditorState ={getEditorState(listDescribe[i].detail)}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(e) => {
                  onEditorStateChange(e, i)
                }}
              />
            </>
          );
        })}
        <Button onClick={saveDescribe} variant="contained" style={{background: "#32CD32"}}>Lưu</Button>
        <Button onClick={Cancel} variant="contained" style={{background: "#8B0000", marginLeft: "10px"}}>Hủy</Button>
      </Container>
    </Page>
  );
}
