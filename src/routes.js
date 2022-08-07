import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductTramThuy from './pages/ProductTramThuy'
import Comment from './pages/Comment'
import Describe from './pages/Describe'
import DescribeEdit from './pages/DescribeEdit'
import DashboardApp from './pages/DashboardApp';
import ProductTramThuyAdd from './pages/ProductTramThuyAdd';
import ProductTramThuyEdit from './pages/ProductTramThuyEdit';
import Knowledge from './pages/Knowledge';
import KnowledgeAdd from './pages/KnowledgeAdd';
import KnowledgeEdit from './pages/KnowledgeEdit';
import Bill from './pages/Bill';
import BillDetail from './pages/BillDetail';
// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        // { path: 'products', element: <Products /> },
        { path: 'products', element: <ProductTramThuy /> },
        { path: 'blog', element: <Blog /> },
        { path: 'comment', element: <Comment /> },
        { path: 'describe', element: <Describe /> },
        { path: 'describeedit', element: <DescribeEdit /> },
        { path: 'producttramthuyadd', element: <ProductTramThuyAdd /> },
        { path: 'producttramthuyedit', element: <ProductTramThuyEdit /> },
        { path: 'knowledge', element: <Knowledge /> },
        { path: 'knowledgeadd', element: <KnowledgeAdd /> },
        { path: 'knowledgeedit', element: <KnowledgeEdit /> },
        { path: 'bill', element: <Bill /> },
        { path: 'billdetail', element: <BillDetail /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
