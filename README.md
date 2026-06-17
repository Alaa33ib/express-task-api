# Task Management API

A lightweight, production-grade REST API built with Node.js and Express for managing a collection of tasks. The application stores data locally in a JSON file format and implements strict server-side schema verification via custom middleware components before executing mutations.

---

## Technical Stack

* **Runtime Environment:** Node.js
* **Backend Framework:** Express.js
* **Database Storage:** Local JSON file filesystem (`fs/promises`)
* **Testing Tool:** VS Code REST Client Extension (`api.http`)

---

## Core Features and Route Constraints

The server intercepts payloads using dedicated middleware to maintain strict data integrity within the JSON database.

### 1. Create Task (`POST /tasks`)
Validates the entire body payload before appending a new task object with a auto-incrementing unique ID.
* **Title Integrity:** Must exist, be a text string, and cannot consist of blank spaces.
* **Global Uniqueness:** Duplicate titles are blocked (case-insensitive and trailing spaces trimmed).
* **Priority Enforcement:** Strictly restricted to string values of `low`, `medium`, or `high`. 
* **Progress Initialization:** Defaults automatically to `0` if omitted. If provided, it must be an integer between 0 and 100.

### 2. Update Task (`PUT /tasks/:id`)
Enforces partial schema checks dynamically based on fields provided in the request payload.
* **Target Check:** Returns a `404 Not Found` if the targeted task ID does not exist.
* **Isolated Updates:** Allows updating individual fields independently without breaking omissions.
* **Collision Prevention:** Verifies that changing a task title does not clash with another existing record's title, while ignoring its own previous title.

### 3. Fetch Tasks (`GET /tasks`)
Reads the storage layer and returns the complete array of active tasks in standard JSON payload format.

### 4. Delete Task (`DELETE /tasks/:id`)
Locates the targeted record by ID, purges it from the array mapping, commits the structural mutation back to the disk storage layer, and returns the deleted object.

---

## Setup and Local Execution

### Start the Server
1. Clone the project repository and open the project root path in your terminal.
2. Initialize dependencies by ensuring Express is installed.
3. Launch the runtime environment inside the CLI console:
```bash
node server.js
```
The console will verify connection integrity by reporting that the port listener loop is active on port 3000.

### Execute Route Operations in VS Code
The repository includes an `api.http` file structured for instant testing natively via the VS Code REST Client extension interface.

1. Open `api.http` within VS Code.
2. Ensure your CLI execution of `server.js` remains running concurrently.
3. Click the interactive **Send Request** text link hovering directly above any defined HTTP action block to transmit live payloads and observe automated validation behaviors in the split panel view.