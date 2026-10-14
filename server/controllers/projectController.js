


// POST /api/projects
// Create a new project form an AI prompt.
export async function createProject(req, res) {
    
}

// Background worker to progressive generate files and update database in real-time.
async function runBackgroundGeneration(projectId, prompt) {
    
}

// GET /api/projects
// List all projects owned by the user (summary only, no file contents).
export async function listProjects(req, res) {
    
}

// GET /api/projects/:id
// Get full project details.
export async function getProject(req, res) {
    
}

// DELETE /api/projects/:id
// Delete a project.
export async function deleteProjects(req, res) {
    
}


// PUT /api/projects/:id/files
// Update project files (manual edits)
export async function updateProjectFiles(req, res) {
    
}

// POST /api/projects/:id/publish
// Mark a project as publicly published.
export async function publishProject(req, res) {
    
}

// GET /api/projects/public/:id
// Get a publicly published project details (without auth).
export async function getPublicProjectFiles(req, res) {
    
}