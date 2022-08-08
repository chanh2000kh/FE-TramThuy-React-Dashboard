import { faker } from '@faker-js/faker';
import { useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Box, TextField, Stack } from '@mui/material';
import React, { useState, useEffect, Fragment } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import callApi from '../api/ApiSevice';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------
function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}
const toDay = new Date();
export default function DashboardApp() {
  const navigate = useNavigate();

  const theme = useTheme();
  const [quantityStatistics, setQuantityStatistics] = useState({
    totalProduct: 0,
    totalRevenueBill: [
      {
        _id: null,
        sum: 0,
      },
    ],
    totalBill: 0,
    toatlReview: 0,
  });
  const quantityStatisticsAdmin = () => {
    callApi(`api/admin/quantityStatisticsAdmin`, 'GET')
      .then((res) => {
        setQuantityStatistics(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [totalBill, setTotalBill] = useState({
    totalBill0: 1,
    totalBill1: 1,
    totalBill2: 1,
  });
  const statisticsBillAdmin = () => {
    callApi(`api/admin/statisticsBillAdmin`, 'GET')
      .then((res) => {
        setTotalBill(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [listProduct, setListProduct] = useState([]);
  const getBestSellProductAdmin = () => {
    callApi(`api/admin/getBestSellProductAdmin`, 'GET')
      .then((res) => {
        setListProduct(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [listKnowledge, setListKnowledge] = useState([
    {
      _id: '62e7deebc9b56b1c4f31c635',
      name: 'Cách nhận biết lỗi của trầm hương?',
      author: 'Chánh',
      tag: 'nhan trầm, trầm hương',
      img: [
        'https://storage.googleapis.com/tram-thuy.appspot.com/Products/C%C3%A1ch%20nh%E1%BA%ADn%20bi%E1%BA%BFt%20l%E1%BB%97i%20c%E1%BB%A7a%20tr%E1%BA%A7m%20h%C6%B0%C6%A1ng%3F/img-165936304895438.png?GoogleAccessId=firebase-adminsdk-pfqbk%40tram-thuy.iam.gserviceaccount.com&Expires=16446992400&Signature=ZMGIAhBTR7TsIElgRzbj0fl7il2VkLz0YcrJx7HlrCwFvYomLXZbXkCciAkGlz%2FX9UJui21HlFPcP7p861EydlN6N3RYv3Y0PP5O7ypxjeCxCLEPBDUJSKIW7Us8PFki7VJ3MwKpgKhBVOJ%2B47VCgaSp2bmwAEbQaezRMdPCWjLFETtcHD41Q6BIhnegxctfDcXCoOyjNk2Ms82pT0PGxLGGqJ%2BmsjYyoW0Q%2FAp4mj4v0eGk3sR0IODBC5AAtJxiUva2kUV2aMNRkG2JyWt7bmT1DfdJ6tI0BGfsd0CbDMzGipErn8AfpcuPSW19fIOhiP%2BL0vDCwdwwXWP7U%2BfvSQ%3D%3D',
      ],
      describe: 'Đây là một đoạn ngắn. Nên tôi không biết viết gì cả',
      view: 37,
      createdAt: '2022-08-01T14:07:05.505Z',
    },
  ]);
  const getListKnowledge = () => {
    callApi(`api/knowledge/getKnowledgeAll?limit=5&skip=1`, 'GET')
      .then((res) => {
        setListKnowledge(res.data.data.knowledge);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [statisticsReview, setStatisticsReview] = useState({
    star0: 0,
    star1: 0,
    star2: 0,
    star3: 0,
    star4: 0,
    star5: 0,
  });
  const statisticsReviewAdmin = () => {
    callApi(`api/admin/statisticsReviewAdmin`, 'GET')
      .then((res) => {
        setStatisticsReview(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [listReviewNew, setListReviewNew] = useState([]);
  const getReviewNewAdmin = () => {
    callApi(`api/admin/getReviewNewAdmin`, 'GET')
      .then((res) => {
        setListReviewNew(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [listDay, setListDay] = useState([
    '2022-07-24',
    '2022-07-25',
    '2022-07-26',
    '2022-07-27',
    '2022-07-28',
    '2022-07-29',
    '2022-07-30',
    '2022-07-31',
    '2022-08-01',
  ]);
  const [listTotalBill, setListTotalBill] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [listTotalMoney, setListTotalMoney] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [valueDayEnd, setValueDayEnd] = useState(toDay);
  const [valueDayStart, setValueDayStart] = useState(toDay);
  const getStatisticsSellAdmin = () => {
    const date = new Date();

    // add a day
    date.setDate(date.getDate() - 30);
    // const timeStart = formatDate(valueDayEnd);
    // const timeEnd = formatDate(valueDayEnd);
    const timeStart = formatDate(date);
    const timeEnd = formatDate(valueDayEnd);
    const day = [];
    const totalBill = [];
    const totalMoney = [];
    callApi(`api/admin/getStatisticsSellAdmin?timeStart=${timeStart}&skip=1&timeEnd=${timeEnd}`, 'GET')
      .then((res) => {
        const list = res.data.data;

        list.forEach((item) => {
          day.push(item.day);
          totalBill.push(Number(item.totalBill));
          totalMoney.push(item.totalMoney);
        });
        setListDay(day);
        setListTotalBill(totalBill);
        setListTotalMoney(totalMoney);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (localStorage.getItem('accessToken') === '') navigate('/login');
    quantityStatisticsAdmin();
    statisticsBillAdmin();
    getBestSellProductAdmin();
    getListKnowledge();
    statisticsReviewAdmin();
    getReviewNewAdmin();
  }, []);
  useEffect(() => {
    getStatisticsSellAdmin();
  }, [valueDayEnd, valueDayStart]);
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Số lượng sản phẩm"
              total={quantityStatistics.totalProduct}
              icon={'eva:shopping-bag-fill'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Tổng doanh thu"
              total={quantityStatistics.totalRevenueBill[0].sum}
              color="info"
              icon={'eva:flip-2-fill'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Tổng số Bill đã xác nhận"
              total={quantityStatistics.totalBill}
              color="warning"
              icon={'eva:printer-outline'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Số lượng đánh giá"
              total={quantityStatistics.toatlReview}
              color="error"
              icon={'eva:message-circle-fill'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DesktopDatePicker
                  label="Ngày bắt đầu"
                  inputFormat="MM/dd/yyyy"
                  value={valueDayStart}
                  onChange={(newValue) => setValueDayStart(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DesktopDatePicker
                  label="Ngày kết thúc"
                  inputFormat="MM/dd/yyyy"
                  value={valueDayEnd}
                  onChange={(newValue) => setValueDayEnd(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </LocalizationProvider> */}

            <AppWebsiteVisits
              title="Thống kê doanh trong 30 ngày vừa"
              subheader=""
              chartLabels={listDay}
              chartData={[
                {
                  name: 'Tổng Bill',
                  type: 'column',
                  fill: 'solid',
                  data: listTotalBill,
                  // data: [4, 25, 36, 30, 45, 35],
                },
                {
                  name: 'Doanh Thu',
                  type: 'area',
                  fill: 'gradient',
                  // data: [30, 25, 36, 30, 45, 35],
                  data: listTotalMoney,
                },
                // {
                //   name: 'Team C',
                //   type: 'line',
                //   fill: 'solid',
                //   data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                // },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Thống kê hóa đơn"
              chartData={[
                { label: 'Xác nhận', value: totalBill.totalBill1 },
                { label: 'Hủy', value: totalBill.totalBill2 },
                { label: 'Chờ xác nhận', value: totalBill.totalBill0 },
              ]}
              chartColors={[theme.palette.primary.main, theme.palette.chart.blue[0], theme.palette.chart.violet[0]]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Danh sách sản phẩm bán chạy"
              subheader="Sắp xếp từ nhiều đến ít theo số lượng bán"
              chartData={listProduct}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Thống kê phân bố đánh giá"
              chartLabels={['0 Sao', '1 Sao', '2 Sao', '3 Sao', '4 Sao', '5 sao']}
              chartData={[
                {
                  name: 'Phân bố đánh giá',
                  data: [
                    statisticsReview.star0,
                    statisticsReview.star1,
                    statisticsReview.star2,
                    statisticsReview.star3,
                    statisticsReview.star4,
                    statisticsReview.star5,
                  ],
                },
                // { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                // { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="Danh sách bài kiến thức mới nhất"
              list={listKnowledge}
              // list={[...Array(5)].map((_, index) => ({
              //   id: faker.datatype.uuid(),
              //   title: faker.name.jobTitle(),
              //   description: faker.name.jobTitle(),
              //   image: `/static/mock-images/covers/cover_${index + 1}.jpg`,
              //   postedAt: faker.date.recent(),
              // }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Một số đánh giá gần đây"
              list={listReviewNew}
              // list={[...Array(5)].map((_, index) => ({
              //   id: faker.datatype.uuid(),
              //   title: [
              //     '1983, orders, $4220',
              //     '12 Invoices have been paid',
              //     'Order #37745 from September',
              //     'New order placed #XF-2356',
              //     'New order placed #XF-2346',
              //   ][index],
              //   type: `order${index + 1}`,
              //   time: faker.date.past(),
              // }))}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Lưu lượng truy cập theo trang web"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} height={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} height={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} height={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} height={32} />,
                },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
