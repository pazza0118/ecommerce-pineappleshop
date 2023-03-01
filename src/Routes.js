import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./core/Home";
import Shop from "./core/Shop";
import SignUp from "./user/SignUp";
import SignIn from "./user/SignIn";

import PrivateRoute from "./auth/PrivateRoute";
import UserDashboard from "./user/UserDashboard";
import UserProfileUpdate from "./user/UserProfileUpdate";

import AdminDashboard from "./admin/AdminDashboard";
import AdminRoute from "./auth/AdminRoute";
import AddCategory from "./admin/AddCategory";
import AddProduct from "./admin/AddProduct";
import Order from "./admin/Order";
import Menu from "./core/Menu";
import Product from "./core/Product";
import Cart from "./core/Cart";
import ManageProducts from "./admin/ManageProducts";
import UpdateProduct from "./admin/UpdateProduct";

const Routes = () => {
  return (
    <BrowserRouter>
      <Menu />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/shop" exact component={Shop} />
        <Route path="/signin" exact component={SignIn} />
        <Route path="/signup" exact component={SignUp} />
        <PrivateRoute path="/user/dashboard"
          exact component={UserDashboard} />
        <PrivateRoute path="/profile/update/:userId"
          exact component={UserProfileUpdate} />
        <AdminRoute path="/admin/dashboard"
          exact component={AdminDashboard} />
        <AdminRoute path="/create/category"
          exact component={AddCategory} />
        <AdminRoute path="/create/product"
          exact component={AddProduct} />
        <AdminRoute path="/admin/order"
          exact component={Order} />
        <AdminRoute path="/admin/manage/products/:userId"
          exact component={ManageProducts} />
        <AdminRoute path="/admin/update/product/:productId"
          exact component={UpdateProduct} />
        <Route path="/cart" exact component={Cart} />
        <Route path="/product/:productId" exact component={Product} />
      </Switch>
    </BrowserRouter>
  )

}
export default Routes;
