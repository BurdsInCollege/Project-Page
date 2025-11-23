const STORAGE_KEY = 'todoChecklist';
const DATE_KEY = 'checklistDate';
const VERSION_KEY = 'checklistVersion';
// Increment this when you change `DEFAULT_TASKS` so browsers reset stored tasks
const DEFAULT_VERSION = 1;

// Pre-made tasks that cannot be modified
const DEFAULT_TASKS = [
    { id: 1, text: 'Check Foundry (Forma and Other Completed Items)', completed: false },
    { id: 2, text: 'Do Daily Sortie', completed: false },
    { id: 3, text: 'Steel Path Incursions', completed: false },
];

function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function displayDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('dateDisplay').textContent = today.toLocaleDateString('en-US', options);
}

function updateCountdown() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    
    const timeLeft = midnight - now;
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = `Tasks reset in: ${hours}h ${minutes}m ${seconds}s`;
}

function checkAndUncheckIfNeeded() {
    const today = getTodayDate();
    const savedDate = localStorage.getItem(DATE_KEY);

    if (savedDate !== today) {
        // Reset all tasks to unchecked
        const tasks = DEFAULT_TASKS.map(task => ({...task, completed: false}));
        saveTasks(tasks);
        localStorage.setItem(DATE_KEY, today);
    }
}

// If DEFAULT_TASKS was changed in the source, bump DEFAULT_VERSION.
// This function ensures stored tasks are replaced with the new defaults
// when the version doesn't match.
function ensureVersion() {
    const savedVersion = localStorage.getItem(VERSION_KEY);
    if (savedVersion !== String(DEFAULT_VERSION)) {
        const initialTasks = DEFAULT_TASKS.map(task => ({...task}));
        saveTasks(initialTasks);
        localStorage.setItem(VERSION_KEY, String(DEFAULT_VERSION));
        localStorage.setItem(DATE_KEY, getTodayDate());
    }
}

function loadTasks() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        // Initialize with default tasks if nothing saved
        const initialTasks = DEFAULT_TASKS.map(task => ({...task}));
        saveTasks(initialTasks);
        return initialTasks;
    }
    return JSON.parse(saved);
}

function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function toggleTask(id) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks(tasks);
        renderTasks();
    }
}

function deleteTask(id) {
    const tasks = loadTasks();
    const filtered = tasks.filter(t => t.id !== id);
    saveTasks(filtered);
    renderTasks();
}

function renderTasks() {
    const tasks = loadTasks();
    const checklist = document.getElementById('checklist');
    const stats = document.getElementById('stats');

    checklist.innerHTML = tasks.map(task => `
        <li class="checklist-item ${task.completed ? 'completed' : ''}">
            <input 
                type="checkbox" 
                ${task.completed ? 'checked' : ''} 
                onchange="toggleTask(${task.id})"
            />
            <span class="item-text">${task.text}</span>
        </li>
    `).join('');

    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    stats.innerHTML = `${completed} of ${total} tasks completed`;
}

function scheduleNextMidnightReset() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    
    const timeUntilMidnight = midnight - now;

    setTimeout(() => {
        checkAndUncheckIfNeeded();
        renderTasks();
        displayDate();
        scheduleNextMidnightReset();
    }, timeUntilMidnight);
}

// Initialize app
window.addEventListener('DOMContentLoaded', function() {
    ensureVersion();
    checkAndUncheckIfNeeded();
    displayDate();
    renderTasks();
    updateCountdown();
    scheduleNextMidnightReset();

    // Update countdown every second
    setInterval(updateCountdown, 1000);
});