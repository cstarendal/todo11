/**
 * Helper function to load the minimal HTML structure for testing
 */
export function loadMinimalTaskUI() {
  // Create the basic task UI structure
  document.body.innerHTML = `
    <div id="app">
      <h1>🎯 Task11 - Task Management</h1>
      
      <form id="task-form" class="task-form">
        <input 
          type="text" 
          id="task-input" 
          placeholder="Enter task title..." 
          required
        />
        <button type="submit">Add Task</button>
      </form>

      <div class="tasks-section">
        <h2 id="task-counter">Tasks (0)</h2>
        <div id="task-list"></div>
      </div>
    </div>
  `;
}
