const mongoose = require("mongoose");

const uri = "mongodb+srv://hayesha081_db_user:thpJp3kmAbXY15cZ@to-do-list.78kccuu.mongodb.net/?appName=To-Do-List";


const conn = async () => {
    try {
        await mongoose.connect(uri);
        console.log("DB Connected");
    } catch (err) {
        console.error("DB Connection Error:", err.message);
    }
};

conn();


//pwd: thpJp3kmAbXY15cZ
//usernam: hayesha081_db_user
//playground-mongodb-string: mongodb+srv://hayesha081_db_user:thpJp3kmAbXY15cZ@to-do-list.78kccuu.mongodb.net/

//mongodb+srv://hayesha081_db_user:<db_password>@to-do-list.78kccuu.mongodb.net/?appName=To-Do-List



//NODE MANAGER
// curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
//source ~/.zshrc
//command -v nvm
//nvm install --lts
