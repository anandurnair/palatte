import mongoose, { Schema } from 'mongoose';

// Define the Transaction sub-schema
const TransactionSchema = new Schema({

  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'], 
    required: true
  },
   payer: {
    type: Schema.Types.ObjectId,
    ref: 'Users', 
    required: true
  },
 date: {
    type: String,
   
  }
});

const WalletSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
    unique: true 
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  transactions: [TransactionSchema], 
});


const WalletModel = mongoose.model('Wallet', WalletSchema);

export default WalletModel;
