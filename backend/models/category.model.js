const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ name: 1 }, { unique: true });
const Category = mongoose.model("Category", categorySchema);
export default Category;
