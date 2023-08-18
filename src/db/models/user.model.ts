import { Schema, model, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

interface UserSchema extends Document {
  name: string;
  email: string;
  avtar: string;
  password: string;
  role: string;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<UserSchema>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    avtar: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin", "writer"],
      default: "user",
    },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User: Model<UserSchema> = model<UserSchema>("User", userSchema);

export default User;
