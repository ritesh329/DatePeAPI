import multer from "multer";

// ✅ Memory storage — no local file saving
const storage = multer.memoryStorage();

// ✅ Multer upload middleware
export const upload = multer({ storage });
