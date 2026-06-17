import http from "http";
import fs from 'fs/promises';


const app = express();
const PORT  = '3000';


app.use(express.json());

app.get('./tasks', async (req, res, next)=>{
    try {
        data = await fs.readFile("./tasks.json", 'utf-8');
        tasks = JSON.parse(data);
        res.json(tasks);
    } catch(error){
        next(error);
    }
});

app.use((err, req, res, next)=>{
    console.error("Server Error: ", err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || "Internal Server Error"
    });
});

app.listen(PORT, ()=> {console.log(`Server is running on http://localhost:${PORT}`);});
