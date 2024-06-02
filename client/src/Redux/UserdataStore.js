import { configureStore } from "@reduxjs/toolkit";
import userAuthenticator from "./SetAuthData"

export default configureStore ({
    reducer:{
        Identity: userAuthenticator
    }
});