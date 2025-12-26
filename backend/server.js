const express = require("express"); 
const app = express();
const cors = require("cors");//importowanie modułu CORS
const PORT = 5000;


app.use(cors()); //zezwalanie na żądania z innych domen
app.use(express.json()); //parsowanie JSON w ciele żądania

const filesRoutes = require('./routes/files'); //importowanie pliku z trasami do obsługi plików
const authRoutes = require('./routes/auth'); //importowanie pliku z trasami do obsługi autoryzacji
app.use('/api/files', filesRoutes); //używanie tras do obsługi plików z prefiksem /api/files
app.use('/api/auth', authRoutes); //używanie tras do obsługi autoryzacji z prefiksem /api/auth
const protectedRoutes = require('./routes/protected');
app.use('/api/protected', protectedRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
