document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const tasksContainer = document.getElementById('tasks');
    const viewButtons = document.querySelectorAll('.view-options button');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentView = 'all'; // 'all', 'pending', 'completed'

    // 渲染任务列表
    function renderTasks() {
        const filteredTasks = filterTasks();
        tasksContainer.innerHTML = '';
        
        filteredTasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-card${task.completed ? ' completed' : ''}`;
            
            // 如果是新添加的任务，添加adding类
            if (index === 0 && task === tasks[0]) {
                taskElement.classList.add('adding');
            }
            
            const dateObj = new Date(task.date + ' ' + task.time);
            const formattedDate = dateObj.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const formattedTime = dateObj.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
            });

            taskElement.innerHTML = `
                <h3>${task.title}</h3>
                <p><i class="fas fa-calendar"></i> ${formattedDate}</p>
                <p><i class="fas fa-clock"></i> ${formattedTime}</p>
                <p><i class="fas fa-align-left"></i> ${task.description || '无描述'}</p>
                <div class="task-actions">
                    <button class="complete-btn" onclick="toggleComplete(${index})">
                        <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                        ${task.completed ? '撤销' : '完成'}
                    </button>
                    <button class="delete-btn" onclick="deleteTask(${index})">
                        <i class="fas fa-trash"></i>
                        删除
                    </button>
                </div>
            `;
            
            taskElement.style.opacity = '0';
            tasksContainer.appendChild(taskElement);
            requestAnimationFrame(() => {
                taskElement.style.transition = 'opacity 0.3s ease';
                taskElement.style.opacity = '1';
            });
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // 过滤任务
    function filterTasks() {
        switch(currentView) {
            case 'pending':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            default:
                return tasks;
        }
    }

    // 切换视图
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentView = button.textContent === '全部' ? 'all' : 
                         button.textContent === '待办' ? 'pending' : 'completed';
            renderTasks();
        });
    });

    // 添加任务
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const task = {
            title: document.getElementById('taskTitle').value,
            date: document.getElementById('taskDate').value,
            time: `${document.getElementById('taskHour').value}:${document.getElementById('taskMinute').value}`,
            description: document.getElementById('taskDescription').value,
            completed: false
        };

        tasks.unshift(task); // 新任务添加到开头
        renderTasks();
        taskForm.reset();

        // 添加成功提示
        const submitButton = taskForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-check"></i> 已添加';
        submitButton.style.background = 'var(--success)';
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.style.background = 'var(--primary)';
        }, 2000);
    });

    // 切换完成状态
    window.toggleComplete = (index) => {
        const taskElement = document.querySelectorAll('.task-card')[index];
        taskElement.classList.add('completing');
        
        setTimeout(() => {
            tasks[index].completed = !tasks[index].completed;
            renderTasks();
        }, 300);
    };

    // 删除任务
    window.deleteTask = (index) => {
        if (confirm('确定要删除这个日程吗？')) {
            const taskElement = document.querySelectorAll('.task-card')[index];
            taskElement.classList.add('deleting');
            
            setTimeout(() => {
                tasks.splice(index, 1);
                renderTasks();
            }, 300); // 等待动画完成
        }
    };

    // 初始渲染
    renderTasks();
}); 