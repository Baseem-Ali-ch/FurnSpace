const Category = require("../../model/categoryModel");
const Product = require("../../model/productModel");
const Order = require("../../model/orderModel");

const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;
const mongoose = require("mongoose");

//load product list in admin side
const loadProductList = async (req, res) => {
  const { search = '', page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const searchQuery = search
      ? { 
          $or: [
            { name: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') }
          ]
        }
      : {};

    const products = await Product.find(searchQuery).populate("category").skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalProducts / limit);
    const categories = await Category.find();
    const isAdmin = req.session.admin;

    return res.render("product-list", {
      products,
      categories,
      isAdmin,
      currentPage: parseInt(page),
      totalPages,
      search
    });
  } catch (error) {
    console.error("Error retrieving product list:", error);
    return res.status(500).send("Server Error");
  }
};


//load add product page
const loadAddProduct = async (req, res) => {
  try {
    const isAdmin = req.session.admin;
    const categories = await Category.find({ isListed: "true" });
    return res.render("add-product", { categories, isAdmin });
  } catch (error) {
    console.log(error);
  }
};

//admin can add product
const addProduct = async (req, res) => {
  try {
    const { productTitle, productDescription, productPrice, productDiscountedPrice, category: categoryId, isListed, stock } = req.body;
    const category = await Category.findById(categoryId);

    if (!category) {
      console.error("Category not found for ID:", categoryId);
      return res.status(404).send("Category not found");
    }

    let imageUrl_1 = req.files["productImage1"] ? "/assets/images/add-product/" + req.files["productImage1"][0].filename : "";
    let imageUrl_2 = req.files["productImage2"] ? "/assets/images/add-product/" + req.files["productImage2"][0].filename : "";
    let imageUrl_3 = req.files["productImage3"] ? "/assets/images/add-product/" + req.files["productImage3"][0].filename : "";

    // The cropping will be done client-side, so we don't need to modify the images here

    const product = new Product({
      name: productTitle,
      description: productDescription,
      price: productPrice,
      discountedPrice: productDiscountedPrice,
      category: category._id,
      isListed: isListed === "true",
      stock: stock,
      imageUrl_1: imageUrl_1,
      imageUrl_2: imageUrl_2,
      imageUrl_3: imageUrl_3,
    });
    await product.save();

    return res.redirect("/admin/add-product?success=true");
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).send("Server Error");
  }
};

//admin can edit product details
const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, description, category, price, discountPrice, stock, status } = req.body;

  try {
    // Validate category ID
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ success: false, message: "Invalid category ID" });
    }

    // Validate product ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Track changes for response feedback
    const changes = [];

    // Update product fields
    if (product.name !== name) {
      product.name = name;
      changes.push("name");
    }
    if (product.description !== description) {
      product.description = description;
      changes.push("description");
    }
    if (product.category.toString() !== category) {
      product.category = new mongoose.Types.ObjectId(category);
      changes.push("category");
    }
    if (product.price !== parseFloat(price)) {
      product.price = parseFloat(price);
      changes.push("price");
    }
    if (product.discountedPrice !== parseFloat(discountPrice)) {
      product.discountedPrice = parseFloat(discountPrice) || product.discountedPrice;
      changes.push("discountedPrice");
    }
    if (product.stock !== parseInt(stock)) {
      product.stock = parseInt(stock);
      changes.push("stock");
    }
    if (product.isListed !== (status === 'true')) {
      product.isListed = status === 'true';
      changes.push("status");
    }

    // Handle image updates
    if (req.files) {
      for (let i = 1; i <= 3; i++) {
        const fieldName = `productImage${i}`;
        if (req.files[fieldName] && req.files[fieldName][0]) {
          const file = req.files[fieldName][0];
          try {
            const fileName = `cropped_${Date.now()}_${file.originalname}`;
            const filePath = path.join(__dirname, '../public/assets/images/add-product/', fileName);

            // Verify the image buffer and process with sharp
            if (file.buffer) {
              await sharp(file.buffer)
                .resize(300, 300, { fit: 'cover' })
                .toFile(filePath);

              product[`imageUrl_${i}`] = `/assets/images/add-product/${fileName}`;
              changes.push(`image${i}`);
            } else {
              console.error(`Invalid input for image ${i}`);
              return res.status(400).json({ success: false, message: `Invalid input for image ${i}` });
            }
          } catch (sharpError) {
            console.error(`Error processing image ${i}:`, sharpError);
            return res.status(400).json({ success: false, message: `Error processing image ${i}` });
          }
        }
      }
    }

    if (changes.length === 0) {
      return res.json({ success: false, message: "No changes detected" });
    }

    await product.save();
    res.json({ success: true, product, changes });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



//load category list in admin side
const loadCategoryList = async (req, res) => {
  const { search = '', page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const searchQuery = search
      ? { 
          title: new RegExp(search, 'i') 
        }
      : {};

    const categories = await Category.find(searchQuery).skip(skip).limit(limit);
    const totalCategories = await Category.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalCategories / limit);
    const isAdmin = req.session.admin;

    return res.render("category-list", {
      categories,
      isAdmin,
      currentPage: parseInt(page),
      totalPages,
      search
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};


//admin can add categories
const addCategory = async (req, res) => {
  try {
    const { title, slug, isListed } = req.body;
    const image = req.file ? req.file.filename : null;

    const existingCategory = await Category.findOne({ title });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({
      title,
      slug,
      image,
      isListed: isListed === "true",
    });
    await newCategory.save();
    return res.status(201).json({ message: "Category added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

//admin can edit categories
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { title, description, status } = req.body;
    const image = req.file ? req.file.filename : null;
    const updateData = {
      title,
      description,
      isListed: status === "active",
    };

    if (image) {
      updateData.image = image;
    }

    const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  loadProductList,
  loadAddProduct,
  addProduct,
  updateProduct,
  loadCategoryList,
  addCategory,
  updateCategory
};
