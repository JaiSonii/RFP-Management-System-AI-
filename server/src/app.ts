import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { ImapService } from './services/ImapService'; // Import the new service

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rfp-system')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // START IMAP LISTENER
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const imapService = new ImapService();
        imapService.connectAndListen();
    } else {
        console.warn("SMTP credentials missing. Email receiving disabled.");
    }
});