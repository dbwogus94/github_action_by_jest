'use strict';
require('express-async-errors');
const { Product } = require('../models');

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    throw error;
  }
};

const createProduct = async (req, res, next) => {
  //res.send('create');
  const { name, description, price } = req.body;
  try {
    const newProduct = await Product.create({ name, description, price });
    res.status(201).json(newProduct);
  } catch (error) {
    // 'express-async-errors' 미사용 : 에러를 next에 전달해 에러 처리 미들웨어를 호출해야한다.
    // next(error);
    // 'express-async-errors' 사용 : 에러를 던지기만 해도 에러 처리 미들웨어에서 처리 할 수 있다.
    throw error;
  }
};

module.exports = { getProducts, createProduct };
