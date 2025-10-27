import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization; 

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // If header is missing or doesn't use the 'Bearer' scheme, deny access.
        return res.status(401).json({ success: false, message: "Access denied. Token missing or invalid format." });
    }

    // --- STEP 2: Extract the token (Remove "Bearer ") ---
    const token = authHeader.split(' ')[1];

    // NOTE: Your original line `const token = req.headers.token;` should be removed.

    // Logging for debugging (optional, remove later)
    console.log("Token Received:", token);
    console.log("JWT Secret Used:", process.env.JWT_SECRET);
    
    // --- CRITICAL FIX: Use the hardcoded JWT SECRET for local stability ---
    // This is the guaranteed secret we added to userController.js. 
    // You should use the hardcoded secret here, or ensure process.env.JWT_SECRET is set reliably.
    const JWT_SECRET = 'c0833bc9eab92164e1b49bfac4388ce1'; 


    try {
        // --- STEP 3: Verify the token ---
        const tokenDecode = jwt.verify(token, JWT_SECRET); // Use the guaranteed secret

        console.log("Token Decoded:", tokenDecode);

        if (tokenDecode.id) {
            // Attach the userId to the request body for use in the controller
            req.body.userId = tokenDecode.id;
            
            // Proceed to the next route handler (e.g., the userCredits function)
            next();
        } else {
            return res.status(401).json({ success: false, message: "Not Authorized. Invalid token payload." });
        }
        
    } catch (error) {
        // Handle token expiration or invalid signature error
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ success: false, message: "Invalid or expired session. Please log in again." });
    }
};

export default userAuth;