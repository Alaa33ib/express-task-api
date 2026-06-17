import fs from 'fs/promises';
import express from "express";
import { validateTask, validateUpdateTask } from './middleware/validation.js';

// Declaring constants
const app = express();  
const PORT  = '3000';


app.use(express.json());

// GET to retrieve all tasks
app.get('/tasks', async (req, res, next)=>{
    try {
        const data = await fs.readFile("./tasks.json", 'utf-8');
        const tasks = JSON.parse(data);
        res.json(tasks);
    } catch(error){
        next(error);
    }
});

// POST to create a new task (calls the validation middleware)
app.post('/tasks', validateTask, async (req, res, next)=>{
    try{
        const data = await fs.readFile("./tasks.json", 'utf-8');
        const tasks = JSON.parse(data);
        let newTask = {
            id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
            ...req.body
        };
        tasks.push(newTask);
        await fs.writeFile('./tasks.json', JSON.stringify(tasks, null, 2));
        res.status(201).json({ success: true, data: newTask});
    } catch(error){
        next(error);
    }
})

// POST to update an existing task (calls the validation middleware)
app.put('/tasks/:id', validateUpdateTask, async (req, res, next)=>{
    try{
        const data = await fs.readFile("./tasks.json", 'utf-8');
        const tasks = JSON.parse(data);

        const taskID = Number(req.params.id);
        const taskIndx = tasks.findIndex(task=>task.id === taskID);
    
        if(taskIndx===-1){
            const error = new Error('Task not found');
            error.statusCode= 404;
            return next(error);
        }

        tasks[taskIndx] = {
            ...tasks[taskIndx],
            ...req.body
        };

        await fs.writeFile('./tasks.json', JSON.stringify(tasks, null, 2));
        res.status(200).json({ success: true, data: tasks[taskIndx]});

    } catch(error){
        next(error);
    }
})

// DELETE to remove a task
app.delete('/tasks/:id', async (req, res, next)=>{
    try{
        const data = await fs.readFile("./tasks.json", 'utf-8');
        const tasks = JSON.parse(data);

        const taskID = Number(req.params.id);
        const taskIndx = tasks.findIndex(task=>task.id === taskID);
    
        if(taskIndx===-1){
            const error = new Error('Task not found');
            error.statusCode= 404;
            return next(error);
        }

        const deletedTask = tasks[taskIndx];
        tasks.splice(taskIndx, 1);

        await fs.writeFile('./tasks.json', JSON.stringify(tasks, null, 2));
        res.status(200).json({ success: true, data: deletedTask});
    } catch(error){
        next(error);
    }
})

// Handling errors
app.use((err, req, res, next)=>{
    console.error("Server Error: ", err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || "Internal Server Error"
    });
});

// Starting the server
app.listen(PORT, ()=> {console.log(`Server is running on http://localhost:${PORT}`);});
