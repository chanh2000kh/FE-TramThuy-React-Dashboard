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
  const sURLVariables = sPageURL.split('&');
  for (let i = 0; i < sURLVariables.length; i += 1) {
    const sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam) {
      return sParameterName[1].toString();
    }
  }
};
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

export default function KnowledgeAdd() {
  const navigate = useNavigate();

  const [id, setId] = useState(GetURLParameter('id'));
  const [name, setName] = useState('');
  const [img, setImg] = useState([]);
  const [author, setAuthor] = useState('');
  const [describe, setDescribe] = useState('');
  const [tag, setTag] = useState('');
  const [detail, setDetail] = useState('');
  const Cancel = () => {
    navigate('/dashboard/knowledge');
  };
  const Save = () => {
    const data = {
      id,
      name,
      author,
      describe,
      tag,
      detail: draftToHtml(convertToRaw(detail.getCurrentContent())),
    };
    const editKnowledge = jsonToFormData(data);
    Array.from(img).forEach((file) => {
      editKnowledge.append('img', file);
    });
    callApi(`api/knowledge/updateKnowledge`, 'PUT', editKnowledge)
      .then((res) => {
        window.alert('Chỉnh sửa bài viết thành công');
        navigate('/dashboard/knowledge');
      })
      .catch((err) => {
        window.alert('Chỉnh sửa bài viết thất bại');
        console.log(err);
      });
  };
  const loadKnowledge = () => {
    callApi(`api/knowledge/getOneKnowled?id=${id}`, 'GET')
      .then((res) => {
        setName(res.data.data.name);
        setDetail(getEditorState(res.data.data.detail));
        setDescribe(res.data.data.describe);
        setTag(res.data.data.tag);
        setAuthor(res.data.data.author);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (localStorage.getItem('accessToken') === '') navigate('/login');
    loadKnowledge();
  }, []);
  return (
    <Page title="Edit Knowledge">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Thêm bài viết kiến thức
        </Typography>

        <TextField
          value={name}
          onChange={(event) => setName(event.target.value)}
          id="describeName"
          label="Tiêu đề bài viết"
          variant="outlined"
          style={{ width: '100%' }}
        />
        <h3>Ảnh của bài viết</h3>
        <input
          onChange={(event) => setImg(event.target.files)}
          id="img"
          name="img"
          type="file"
          style={{ marginBottom: '10px', marginTop: '10px' }}
          multiple
        />
        <TextField
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          id="author"
          label="Tên tác giả"
          variant="outlined"
          style={{ width: '100%', marginBottom: '10px', marginTop: '10px' }}
        />
        <TextField
          value={describe}
          onChange={(event) => setDescribe(event.target.value)}
          id="describe"
          label="Đoạn mô tả ngắn"
          variant="outlined"
          style={{ width: '100%', marginBottom: '10px', marginTop: '10px' }}
        />
        <TextField
          value={tag}
          onChange={(event) => setTag(event.target.value)}
          id="describe"
          label="Tag"
          variant="outlined"
          style={{ width: '100%', marginBottom: '10px', marginTop: '10px' }}
        />
        <h3>Nội dung bài viết</h3>
        <Editor
          editorState={detail}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={setDetail}
        />
        <Button onClick={Save} variant="contained" style={{ background: '#32CD32' }}>
          Lưu
        </Button>
        <Button onClick={Cancel} variant="contained" style={{ background: '#8B0000', marginLeft: '10px' }}>
          Hủy
        </Button>
      </Container>
    </Page>
  );
}
