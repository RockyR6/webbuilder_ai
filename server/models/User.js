import {Schema} from "mongoose"; 
import bcrypt from "bcryptjs";



const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
			select: false,
		},
	},
	{ timestamps: true }
);

// hash password before saving
UserSchema.pre("save", async function (){
    if(!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


//compare password method
UserSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", UserSchema)
