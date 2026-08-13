const Category = require("../models/Category");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [
        ["sortOrder", "ASC"],
        ["name", "ASC"],
      ],
    });
    return res.json({ success: true, data: { categories } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, icon, sortOrder } = req.body;
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const category = await Category.create({
      name,
      slug,
      description,
      icon,
      sortOrder,
    });
    return res.status(201).json({ success: true, data: { category } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    await category.update(req.body);
    return res.json({ success: true, data: { category } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    await category.destroy();
    return res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
