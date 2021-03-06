import mongoose from "mongoose";
import {OrderStatus} from "@kchaiene-corp/common";




interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}
interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs:OrderAttrs): OrderDoc;
}



const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    "enum": Object.values(OrderStatus),
    "default": OrderStatus.Created,
  }
},{
  toJSON:{
    transform(doc, ret){
      ret.id = ret._id;
      delete ret._id;
    }
  },
});
orderSchema.set("versionKey", "version");
// ticketSchema.set("optimisticConcurrency", true);

orderSchema.pre("save", function(done) {
  // @ts-ignore
  this.$where = {version: {$lt: this.get("version") }};
  done();
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({_id: attrs.id, ...attrs});
};




const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);
export {Order};
