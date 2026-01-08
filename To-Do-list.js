const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAllBtn');
const container = document.querySelector('.container');

// 1. Create a Counter Element dynamically
const counterDisplay = document.createElement('p');
counterDisplay.style.textAlign = 'center';
counterDisplay.style.color = '#888';
counterDisplay.style.fontSize = '0.9rem';
counterDisplay.style.marginTop = '15px';
container.appendChild(counterDisplay);

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 2. Render tasks
function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.classList.add("fade-in");

        if (task.completed) li.classList.add('completed');

        // Toggle Complete (Single Click)
        li.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            li.classList.add("pop");
            saveTasks();
            setTimeout(() => renderTasks(), 200); // Wait for animation
        });

        // EDIT TASK (Double Click)
        li.addEventListener('dblclick', (e) => {
            e.stopPropagation(); // Prevent toggling complete when editing
            const newText = prompt("Edit your task:", task.text);
            
            if (newText !== null && newText.trim() !== "") {
                tasks[index].text = newText.trim();
                saveTasks();
                renderTasks();
            }
        });

        // Delete Button
        const delBtn = document.createElement('button');
        delBtn.textContent = 'X';
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop click from bubbling to the li
            li.classList.add("fade-out");

            setTimeout(() => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            }, 400); // Matches CSS transition time
        });

        li.appendChild(delBtn);
        taskList.appendChild(li);
    });

    updateCounter();
}

// 3. Update Pending Tasks Counter
function updateCounter() {
    const pendingCount = tasks.filter(t => !t.completed).length;
    const text = pendingCount === 1 ? 'task' : 'tasks';
    counterDisplay.textContent = `You have ${pendingCount} pending ${text}`;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 4. Add Task Logic
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({ text: taskText, completed: false });
        taskInput.value = '';
        saveTasks();
        renderTasks();
    }
}

// Event Listener: Click Button
addTaskBtn.addEventListener('click', addTask);

// Event Listener: Press Enter Key
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Event Listener: Clear All
clearAllBtn.addEventListener('click', () => {
    const allItems = document.querySelectorAll("li");
    
    // Animate items out one by one
    allItems.forEach((item, i) => {
        setTimeout(() => {
            item.classList.add("fade-out");
        }, i * 50);
    });

    // Clear data after animations finish
    setTimeout(() => {
        tasks = [];
        saveTasks();
        renderTasks();
    }, allItems.length * 50 + 400);
});

// Initial Load
renderTasks();
