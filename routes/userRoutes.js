const express = require('express');
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
  clearCart,
  addAddress,
  updateAddress,
  deleteAddress,
  getAddresses
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Wishlist routes
router.route('/wishlist')
  .get(protect, getWishlist);

router.route('/wishlist/:productId')
  .post(protect, addToWishlist)
  .delete(protect, removeFromWishlist);

// Cart routes
router.route('/cart')
  .get(protect, getCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);

router.route('/cart/:itemId')
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart);

// Address routes
router.route('/addresses')
  .get(protect, getAddresses)
  .post(protect, addAddress);

router.route('/addresses/:addressId')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

module.exports = router;
