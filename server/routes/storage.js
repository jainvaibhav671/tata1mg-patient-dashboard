import { getClient } from "@/lib/db"

const express = require("express")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const fs = require('fs');

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Use a unique filename
    },
});
const upload = multer({ storage: storage });

router.get("/", (req, res) => {
    res.send({ message: "Storage router" })
})

router.post("/test", upload.single("avatar_img"), async (req, res) => {
    try {
        // const { originalname, path } = req.file;
        res.send({
            headers: req.headers,
            file: req.file,
            body: req.body
        })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

// upload a file to supabase storage
router.post('/upload', upload.single("avatar_img"), async (req, res) => {
    try {
        const { originalname, path } = req.file;

        if (originalname.length == 0) {
            return;
        }

        // Get the session cookie
        const token = req.cookies.session;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Verify the JWT and extract the user ID
        const { id: userId } = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
        const client = getClient()

        // Check if the bucket exists
        const { data: bucketData, error: bucketError } = await client
            .storage
            .getBucket(userId);

        // if (bucketError && bucketError.code !== 'storage.bucket_not_found') {
        //     throw bucketError;
        // }

        // Create the bucket if it doesn't exist
        if (!bucketData) {
            const { error: createBucketError } = await client.storage.createBucket(userId, { public: true });

            if (createBucketError) {
                throw createBucketError;
            }
        }

        // Upload the file to Supabase storage
        const { error: uploadError } = await client.storage
            .from(userId)
            .upload(originalname, fs.readFileSync(path), {
                contentType: req.file.mimetype,
                upsert: true
            });

        if (uploadError) {
            throw uploadError;
        }

        // Clean up the temporary file
        fs.unlinkSync(path);

        res.json({
            file_name: originalname,
            message: 'File uploaded successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'File upload failed', details: error.message });
    }
});

router.get("/get-avatar-url", async (req, res) => {
    const token = req.cookies.session
    if (!token) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    const client = getClient()

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const { data: User } = await client
            .from('User')
            .select("avatar_img")
            .eq('id', decoded.id)

        if (!User[0].avatar_img) {
            return res.status(200).send({ url: null })
        }

        if (User.length > 0) {
            const { data: { publicUrl } } = await client.storage
                .from(decoded.id)
                .getPublicUrl(User[0].avatar_img)

            return res.status(200).send({ url: publicUrl })
        } else {
            return res.status(200).send({ url: null })
        }

    } catch (err) {
        console.log(err)
        res.status(200).send({ error: "Unauthorized" })
    }
})

export default router;
