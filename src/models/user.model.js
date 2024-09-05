import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
            index: true
        },
        
        username: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phoneNo: {
            type: Number,
        },

        password: {
            type: String,
            required: true,
            trim: true
        },

        role: {
            type: String,
            enum: ["student", "recruiter"],
            required: true
        },

        profile: {
            bio: {
                type: String
            },
            skills: [{type: String}],
            avatar: {
                type: String,
                default: ""
            },
            resume: {
                type: String,
                default: ""
            },
            resumeOriginalName: {
                type: String
            },
            company: {
                type: Schema.Types.ObjectId,
                ref: "Company"
            }

        },

        refreshToken: {
            type: String
        }

    },

    {timestamps: true}
);


userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next()
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            fullname: this.fullname,
            username: this.username,
            email: this.email,
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            fullname: this.fullname,
            username: this.username,
            email: this.email,
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}






export const User = mongoose.model("User", userSchema);