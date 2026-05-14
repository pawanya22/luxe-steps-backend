const User = require('../models/User');

// @desc    Add to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.wishlist.includes(req.params.productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    user.wishlist.push(req.params.productId);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.wishlist = user.wishlist.filter(
      item => item.toString() !== req.params.productId
    );
    
    await user.save();

    res.status(200).json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'name slug price comparePrice discount images rating brand'
    });

    res.status(200).json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add to cart
// @route   POST /api/users/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { product, quantity, size, color } = req.body;
    const user = await User.findById(req.user.id);

    // Check if item already in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === product && item.size === size && item.color === color
    );

    if (existingItemIndex > -1) {
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      user.cart.push({ product, quantity, size, color });
    }

    await user.save();

    const populatedUser = await User.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'name slug price images brand'
    });

    res.status(200).json({
      success: true,
      data: populatedUser.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update cart item
// @route   PUT /api/users/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user.id);

    const item = user.cart.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    item.quantity = quantity;
    await user.save();

    const populatedUser = await User.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'name slug price images brand'
    });

    res.status(200).json({
      success: true,
      data: populatedUser.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove from cart
// @route   DELETE /api/users/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.cart = user.cart.filter(
      item => item._id.toString() !== req.params.itemId
    );

    await user.save();

    res.status(200).json({
      success: true,
      data: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get cart
// @route   GET /api/users/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'name slug price images brand sizes'
    });

    res.status(200).json({
      success: true,
      data: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/users/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // If this is set as default, remove default from other addresses
    if (req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(req.body);
    await user.save();

    res.status(201).json({
      success: true,
      data: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If setting as default, remove default from others
    if (req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    Object.assign(address, req.body);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== req.params.addressId
    );

    await user.save();

    res.status(200).json({
      success: true,
      data: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('addresses');

    res.status(200).json({
      success: true,
      data: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
