// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  // {
  //   title: 'user',
  //   path: '/dashboard/user',
  //   icon: getIcon('eva:people-fill'),
  // },
  {
    title: 'product',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: getIcon('eva:file-text-fill'),
  // },
  {
    title: 'Describe',
    path: '/dashboard/describe',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'Bill',
    path: '/dashboard/bill',
    icon: getIcon('eva:printer-outline'),
  },
  {
    title: 'Comment',
    path: '/dashboard/comment',
    icon: getIcon('eva:message-circle-fill'),
  },
  {
    title: 'Knowledge',
    path: '/dashboard/knowledge',
    icon: getIcon('eva:book-outline'),
  },
  {
    title: 'Login',
    path: '/login',
    icon: getIcon('eva:lock-fill'),
  },
  
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default navConfig;
