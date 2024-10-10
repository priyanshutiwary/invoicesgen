import mongoose from "mongoose";
// const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    contact: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\d{10}$/.test(v);
        },
        message: (props: { value: string }) => `${props.value} is not a valid email or mobile number!`
      }
    },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    last_login: { type: Date },
    verifyCode: {
        type: String,
        required: [true, 'Verify Code is required'],
      },
      verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
      },
    isVerified: { type: Boolean, default: false }  
  }, { timestamps: true }); // Add timestamps

// Client Schema (Sub-document)
const ClientSchema = new Schema({
  name: { type: String, required: true },
  contact: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\d{10}$/.test(v);
      },
      message: (props: { value: string }) => `${props.value} is not a valid email or mobile number!`
    }
  },
  gst_number: String
}, { timestamps: true }); // Add timestamps

// Item Schema (Sub-document)
const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true }
}, { timestamps: true }); // Add timestamps

// Business Schema
const BusinessSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  contact: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\d{10}$/.test(v);
      },
      message: (props: { value: string }) => `${props.value} is not a valid email or mobile number!`
    }
  },
  address: String,
  description: String,
  gst_number: String,
  clients: [ClientSchema],
  items: [ItemSchema]
}, { timestamps: true }); // Add timestamps

// Invoice Schema
const InvoiceSchema = new Schema({
  business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  client: { type: Schema.Types.ObjectId, ref: 'Business.clients', required: true },
  invoice_number: { type: String, required: true },
  invoice_date: { type: Date, required: true },
  due_date: { type: Date, required: true },
  total_amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], required: true },
  items: [{
    item: { type: Schema.Types.ObjectId, ref: 'Business.items', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }]
}, { timestamps: true }); // Add timestamps

// Activity Schema
const ActivitySchema = new Schema({
  business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  activity_type: { 
    type: String, 
    enum: ['invoice_generated', 'client_added', 'invoice_paid', 'item_added'], 
    required: true 
  },
  description: { type: String, required: true },
  amount: Number,
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true }); // Add timestamps

// Create models
// const User = mongoose.model('User', UserSchema);
// const Business = mongoose.model('Business', BusinessSchema);
// const Invoice = mongoose.model('Invoice', InvoiceSchema);
// const Activity = mongoose.model('Activity', ActivitySchema);

// Export models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Business = mongoose.models.Business || mongoose.model('Business', BusinessSchema);
const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);


export {
  User,
  Business,
  Invoice,
  Activity
};