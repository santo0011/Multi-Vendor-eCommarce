import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Shops from './pages/Shops';
import Card from './pages/Card';
import Details from './pages/Details';
import Shipping from './pages/Shipping';
import { useDispatch } from 'react-redux';
import { get_category } from './store/reducers/homeReducer';
import CategoryShops from './pages/CategoryShops';
import SearchProducts from './pages/SearchProducts';


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_category())
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
        <Route path='/shops' element={<Shops />} />
        <Route path='/products?' element={<CategoryShops />} />
        <Route path='/products/search?' element={<SearchProducts />} />
        <Route path='/card' element={<Card />} />
        <Route path='/shipping' element={<Shipping />} />
        <Route path='/product/details/:slug' element={<Details />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;