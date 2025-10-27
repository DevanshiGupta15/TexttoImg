import userModel from "../models/userModel.js";
import FormData from 'form-data'
import axios from "axios"

// NOTE: Ensure this key is your REAL, actual ClipDrop API Key
const CLIPDROP_KEY = '2527f5dfc417a7acdbf267a8aba1c4c0f5c2a9ac4311e1aeb2496c802c4ec3ae86d26c408f92b28ecf0546e212e5db21'; 

export const generateImage = async (req, res) => {
    try {
        const { userId, prompt } = req.body;
        const user = await userModel.findById(userId);
        if (!user || !prompt) {
            return res.json({
                success: false,
                message: "Missing Details"
            })
        }

        if (user.creditBalance === 0 || user.creditBalance < 0) {
            return res.json({ success: false, message: 'No Credit Balance', creditBalance: user.creditBalance })
        }

        const formData = new FormData()
        formData.append('prompt', prompt)

        // --- CRITICAL FIX APPLIED HERE: Merging formData headers ---
        const { data } = await axios.post(
            'https://clipdrop-api.co/text-to-image/v1',
            formData,
            {
                headers: {
                    // Merges Content-Type and boundary headers required by the API
                    ...formData.getHeaders(), 
                    'x-api-key': CLIPDROP_KEY, // Your key is sent alongside
                },
                responseType: 'arraybuffer'
            }
        );
        // --- END CRITICAL FIX ---
        
        const base64Image = Buffer.from(data, 'binary').toString('base64')
        const resultImage = `data:image/png;base64,${base64Image}`
        
        // Deduct credit after successful generation
        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })
        
        res.json({ success: true, message: "Image Generated", creditBalance: user.creditBalance - 1, resultImage })
    } catch (error) {
        // A 401 error will now show the message 'Request failed with status code 401'
        console.log(error.message); 
        res.json({ success: false, message: error.message });
    }
}