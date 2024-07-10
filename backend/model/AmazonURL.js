const mongoose = require("mongoose");

const AmazonURLSchema = new mongoose.Schema({
  url: { 
    type: String, 
    required: true },

  userId: {
     type: String,
      required: true 
    },
  data: [
    {
      title: { 
        type: String,
        default: "N/A"
     },
      price: { 
        type: String, 
        default: "N/A" 
     },
      rating: {
         type: String, 
         default: "N/A"
         },
      availability: { 
        type: String,
         default: "N/A" 
        },
    }
  ],
  createdAt:
   { 
    type: Date, 
    default: Date.now
 },
});

AmazonURLSchema.index(
    { url: 1, userId: 1 }, 
    { unique: true });

module.exports = mongoose.model("AmazonURL", AmazonURLSchema);
