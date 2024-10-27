import mongoose from "mongoose";
import { number } from "zod";
 


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
const ClientSchema = new mongoose.Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  clientNumber: { type: Number }, // Incremental number field
  name: { type: String, required: true},
  contact: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\d{10}$/.test(v);
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid email or mobile number!`,
    },
  },
  gst_number: { type: String}
}, { timestamps: true });

// Item Schema (Sub-document)
const ItemSchema = new mongoose.Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  itemNumber: { type: Number },
  name: { type: String, required: true},
  description: String,
  price: { type: Number, required: true },
  tax: { type: Number, required: true } // Ensure this is properly defined
}, { timestamps: true });



// Business Schema


// const BusinessSchema = new Schema({
//   user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   name: { type: String, required: true, unique: true },
//   contact: {
//     type: String,
//     required: true,
//     validate: {
//       validator: function(v: string) {
//         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\d{10}$/.test(v);
//       },
//       message: (props: { value: string }) => `${props.value} is not a valid email or mobile number!`
//     }
//   },
//   address: String,
//   description: String,
//   gst_number: String,
   
//   clients: [ClientSchema],
//   items: [ItemSchema]
// }, { timestamps: true }); 

const BusinessSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, unique: true },
  contact: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email or mobile number!`
    }
  },
  address: String,
  description: String,
  gst_number: String,
  clients: [ClientSchema],
  items: [ItemSchema],
  activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }] // Add this line
}, { timestamps: true });


// Invoice Schema
const InvoiceSchema = new Schema({
  business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  client: { type: Schema.Types.ObjectId, ref: 'Business.clients', required: true },
  invoice_id: {type: String, required: true},
  invoice_number: { type: String, required: true },
  billDate: { type: Date, required: true },
  dueDate: { type: Date },
  total_amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['paid', 'due', 'duedate'], required: true },
  isItemwiseTax: { type: Boolean, required: true },
  totalTaxRate: { type: Number },
  items: [{
    item: { type: Schema.Types.ObjectId, ref: 'Business.items', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    tax: { type: Number, required: true }
  }],
  total:{type:Number, required:true}
}, { timestamps: true });// Add timestamps

// Activity Schema
const ActivitySchema = new Schema({
  business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  activity_type: { 
    type: String, 
    enum: ['invoice_generated', 'client_added', 'invoice_paid', 'item_added','invoice_marked_paid', 'invoice_due_date_extended',], 
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