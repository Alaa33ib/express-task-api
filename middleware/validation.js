import fs from "fs/promises";

// Middleware to validate creation of a new task
export const validateTask = async (req, res, next)=>{
    try{
        const {title, priority, progress} = req.body ;

        // Check if title exists or is an empty string
        if (!title || typeof title != 'string' || title.trim()===''){
            const error  = new Error("Title is required and must be a valid non-empty text");
            error.statusCode = 400;
            return next(error);
        }
        
        const data = await fs.readFile("./tasks.json", 'utf-8');
        const tasks = JSON.parse(data);

        if (tasks.some(task=>task.title.toLowerCase().trim() === title.toLowerCase().trim())){
            const error  = new Error("This task already exists, try a different title");
            error.statusCode = 400;
            return next(error);
        }

        //Checks if priority is one of the specified values and is a non-empty string
        const validPriorities = ['low', 'medium', 'high'];
        if (!priority || typeof priority !== 'string' || !validPriorities.includes(priority.toLowerCase().trim())){
            const error  = new Error("Priority is required and should be low, medium, or high.");
            error.statusCode = 400;
            return next(error);
        }

        // Sets progress to 0 by default and checks if its an integer between [0-100]
        if(progress === undefined || progress === null){
            req.body.progress = 0;
        }
        else{
            if (progress > 100 || progress < 0 || !Number.isInteger(progress) ){
                const error  = new Error("Progress should be a whole number between 0 and 100.");
                error.statusCode = 400;
                return next(error);

            }
                
        }
        
        next();
    // Error handling
    } catch(error){
        next(error);
    }
}

// Middleware to validate updating tasks
export const validateUpdateTask = async (req, res, next) => {
    try {
        const { title, priority, progress } = req.body;
        const validPriorities = ['low', 'medium', 'high'];

        // Check if title is updated and ensure the new title doesnt exist and follows the rules
        if (title !== undefined) {
            if (typeof title !== 'string' || title.trim() === '') {
                const error = new Error("Updated title must be a valid non-empty text string.");
                error.statusCode = 400;
                return next(error);
            }

            const data = await fs.readFile("./tasks.json", 'utf-8');
            const tasks = JSON.parse(data);
            
            const titleExists = tasks.some(task => 
                task.title.toLowerCase().trim() === title.toLowerCase().trim() && 
                task.id !== parseInt(req.params.id)
            );
            
            if (titleExists) {
                const error = new Error("This task title already exists, try a different title.");
                error.statusCode = 400;
                return next(error);
            }
        }

        // Check if priority is updated and ensure it folllows the rules
        if (priority !== undefined) {
            if (typeof priority !== 'string' || !validPriorities.includes(priority.toLowerCase().trim())) {
                const error = new Error("Updated priority must be either 'low', 'medium', or 'high'.");
                error.statusCode = 400;
                return next(error);
            }
        }

        // Check if progress was updated and ensure new value follows the rules
        if (progress !== undefined) {
            if (progress > 100 || progress < 0 || !Number.isInteger(progress)) {
                const error = new Error("Updated progress must be a whole number between 0 and 100.");
                error.statusCode = 400;
                return next(error);
            }
        }

        next();
    // Error handling
    } catch (error) {
        next(error);
    }
};