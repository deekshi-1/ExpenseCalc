const mongoose = require("mongoose");
const User = require("./user.model");

const expenseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please add an expense name"],
    },
    paymentType: {
      type: String,
      required: [true, "Payment type required"],
    },
    amount: {
      type: Number,
      required: [true, "Please add an amount"],
    },
    date: {
      type: Date,
      required: [true, "Please add a date"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please add a category"],
      ref: "Category",
    },
    comment: { type: String },
  },
  {
    timestamps: true,
  }
);

expenseSchema.post("save", async function (doc, next) {
  try {
    await User.findByIdAndUpdate(doc.user, {
      $set: { lastExpenseDate: doc.date },
      $inc: { expenseCount: 1 },
    });
    next();
  } catch (err) {
    next(err);
  }
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
