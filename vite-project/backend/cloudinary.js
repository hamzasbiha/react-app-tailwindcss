require("dotenv").config();
const cloudinary=require("cloudinary").v2


cloudinary.config({
    cloud_name:"decy2t1yc",
    api_key:"797587299415564",
    api_secret:"rqxN_N9DRijkn_qF-rqW1zag6d8"
})

module.exports=cloudinary