import mongoose from "mongoose";
import {OrderStatus} from "@kchaiene-corp/common";
import {TicketDoc} from "./Ticket";



interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc,
}
interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc
}
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs:OrderAttrs): OrderDoc;
}


const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    "enum": Object.values(OrderStatus),
    default: OrderStatus.Created,
  },
  expiresAt: mongoose.Schema.Types.Date,
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
  }
}, {
  toJSON:{
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});
orderSchema.set("versionKey", "version");
// @ts-ignore
orderSchema.set("optimisticConcurrency", true);



orderSchema.statics.build = (attrs: OrderAttrs) => new Order(attrs);



export const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);
