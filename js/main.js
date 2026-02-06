const modalEventBus = new Vue();

Vue.component('todo-table', {
    props: {
        todos: {
            type: Array,
            required: true
        },
        max: Number,
        transitionQuota: Number,
        blocked: Boolean,
        nextAvailable: Boolean,
        editable: Boolean,
        addable: Boolean,
    },
    template: `
        <div class="table">
            <p v-if="!todos">Задач нету</p>
            <ul v-else class="tableGrid">
                <li v-for="todo in todos" class="item" :key="todo.id">
                    <div style="display: grid; gap: 2px">
                        <h2 class="itemTitle">{{todo.name}}</h2>
                        <p v-if="todo.finished" class="itemFinish">{{ todo.finished }}</p>
                    </div>
                    <ul class="itemGrid">
                        <li v-for="task in todo.tasks" class="itemGridTask" :key="task.id">
                            <label style="display: flex; justify-content: space-between; width: 100%">
                                <p>{{ task.name }}</p>
                                <input v-model="task.done" type="checkbox"  v-if="task.subtasks.every(s => s.done) && task.subtasks.length" :disabled="true">
                                <input v-model="task.done" type="checkbox" v-else-if="!task.subtasks.length" :disabled="task.blocked || blocked" @change="checkQuota(todo)">
                            </label>
                            <ul v-if="task.subtasks.length" class="itemSubGrid">
                                <li v-for="subtask in task.subtasks" style="width: 100%">
                                    <label style="display: flex; justify-content: space-between; width: 100%">
                                        <p>{{ subtask.name }}</p>
                                        <input v-model="subtask.done" type="checkbox" @change="checkQuota(todo)" :disabled="task.blocked || blocked">
                                    </label>
                                </li>
                            </ul>
                            <button v-if="todo.table === 0 && !task.blocked" @click="addSubtask(todo.id, task.id)">Добавить подзадачу</button>
                        </li>
                    </ul>
                </li>
            </ul>
            <button v-if="addable && !editable" class="tableButton" @click="addTodo">Добавить задачу</button>
        </div>
    `,
    methods: {
        checkQuota(todo) {
            const total = this.countTotal(todo);
            const checked = this.countChecked(todo);
            const percentage = (checked / total) * 100
            if (percentage >= this.transitionQuota) this.$emit('task-next', todo)
            else if (percentage < 50 && todo.table === 1) {
                this.$emit('task-previous', todo)
            }
            else this.$emit('update-todos', this.todos);
        },
        countTotal(todo) {
            let sum = todo.tasks.filter(t => !t.subtasks.length).length;
            todo.tasks.forEach(task => {
                if (task.subtasks) sum += task.subtasks.length;
            })
            return sum;
        },
        countChecked(todo) {
            let sum = todo.tasks.filter(t => !t.subtasks.length && t.done).length;
            todo.tasks.forEach(task => {
                const subtasks = task.subtasks.filter(s => s.done);
                if (subtasks) sum += subtasks.length;
            })
            return sum;
        },
        addSubtask(todoId, taskId) {
            modalEventBus.$emit('subtask-form', todoId, taskId);
            this.openModal()
        },
        addTodo() {
            modalEventBus.$emit('todo-form');
            this.openModal()
        },
        openModal() {
            modalEventBus.$emit('open-modal');
        }
    }
})

Vue.component('todo-list', {
    template: `
        <main class="todo-grid">
            <todo-table
                :editable="blockData.firstTable"
                :todos="tableData.firstTable.todos"
                :addable="true" :max="tableData.firstTable.max"
                :transitionQuota="tableData.firstTable.transitionQuota"
                :nextAvailable="blockData.secondTable"
                @task-next="moveToSecond"
                @update-todos="saveFirst"
            ></todo-table>
            <todo-table
                :todos="tableData.secondTable.todos"
                :max="tableData.secondTable.max"
                :transitionQuota="tableData.secondTable.transitionQuota"
                @task-next="moveToThird"
                @task-previous="moveToFirst"
                @update-todos="saveSecond"
            ></todo-table>
            <todo-table :todos="tableData.thirdTable.todos" :blocked="true"></todo-table>
        </main>
    `,
    data() {
        return {
            tableData: {
                firstTable: {
                    todos: [
                        {
                            id: new Date().toISOString() + Math.random() * 1000,
                            name: 'Первая задача',
                            table: 0,
                            tasks: [
                                {
                                    id: 0,
                                    name: 'Погладить чайник',
                                    done: false,
                                    blocked: false,
                                    subtasks: [],
                                },
                                {
                                    id: 1,
                                    name: 'Вскипятить кота',
                                    done: false,
                                    blocked: false,
                                    subtasks: [],
                                }
                            ],
                        },
                        {
                            id: new Date().toISOString() + Math.random() * 1000,
                            name: 'Вторая задача',
                            table: 0,
                            tasks: [
                                {
                                    id: 0,
                                    name: 'Погладить чайник',
                                    done: false,
                                    blocked: false,
                                    subtasks: [
                                        {
                                            id: 0,
                                            name: 'Взять чайник',
                                            done: false,
                                        },
                                        {
                                            id: 1,
                                            name: 'Погладить чайник',
                                            done: false,
                                        },
                                        {
                                            id: 2,
                                            name: 'Поставить чайник',
                                            done: false,
                                        },
                                    ]
                                },
                                {
                                    id: 1,
                                    name: 'Вскипятить кота',
                                    done: false,
                                    blocked: false,
                                    subtasks: []
                                }
                            ],
                        },
                    ],
                    max: 3,
                    transitionQuota: 50,
                },
                secondTable: {
                    todos: [],
                    max: 5,
                    transitionQuota: 100,
                },
                thirdTable: {
                    todos: [],
                },
            },
            moveQueue: {
                toFirst: [],
                toSecond: [],
            }
        }
    },
    methods: {
        moveToFirst(todo) {
            if (!this.blockData.firstTable) {
                this.tableData.secondTable.todos = this.tableData.secondTable.todos.filter(t => t.id !== todo.id);
                todo.table = 0;
                this.tableData.firstTable.todos.push(todo);
                this.saveData();
                if (this.moveQueue.toSecond[0]) this.resolveSecondQueue()
            }
            else if (this.moveQueue.toSecond[0]) {
                this.resolveSecondQueue()
                this.tableData.secondTable.todos = this.tableData.secondTable.todos.filter(t => t.id !== todo.id);
                todo.table = 0;
                this.tableData.firstTable.todos.push(todo);
                this.saveData();
            }
            else {
                this.tableData.secondTable.todos = this.tableData.secondTable.todos.map((t) => {
                    if (t.id === todo.id) return {...t, tasks: t.tasks.map((m) => ({...m, blocked: true})) };
                    return t;
                });
                this.moveQueue.toFirst.push(() => {
                    this.tableData.secondTable.todos = this.tableData.secondTable.todos.filter(t => t.id !== todo.id);
                    todo.table = 0;
                    this.tableData.firstTable.todos.push(todo);
                    this.saveData();
                })
            }
        },
        resolveFirstQueue() {
            this.moveQueue.toFirst[0]();
            this.moveQueue.toFirst = this.moveQueue.toFirst.slice(1);
        },
        resolveSecondQueue() {
            this.moveQueue.toSecond[0]();
            this.moveQueue.toSecond = this.moveQueue.toSecond.slice(1);
        },
        moveToSecond(todo) {
            if (!this.blockData.secondTable) {
                this.tableData.firstTable.todos = this.tableData.firstTable.todos.filter(t => t.id !== todo.id);
                todo.table = 1;
                this.tableData.secondTable.todos.push(todo);
                this.saveData();
                if (this.moveQueue.toFirst[0]) this.resolveFirstQueue()
            }
            else if (this.moveQueue.toFirst[0]) {
                this.resolveFirstQueue()
                this.tableData.firstTable.todos = this.tableData.firstTable.todos.filter(t => t.id !== todo.id);
                todo.table = 1;
                this.tableData.secondTable.todos.push(todo);
                this.saveData();
            }
            else {
                this.tableData.firstTable.todos = this.tableData.firstTable.todos.map((t) => {
                    if (t.id === todo.id) return {...t, tasks: t.tasks.map((m) => ({...m, blocked: true})) };
                    return t;
                });
                this.moveQueue.toSecond.push(() => {
                    this.tableData.firstTable.todos = this.tableData.firstTable.todos.filter(t => t.id !== todo.id);
                    todo.table = 1;
                    this.tableData.secondTable.todos.push(todo);
                    this.saveData();
                })
            }

        },
        moveToThird(todo) {
            this.tableData.secondTable.todos = this.tableData.secondTable.todos.filter(t => t.id !== todo.id);
            todo.table = 2;
            this.tableData.thirdTable.todos.push({
                ...todo,
                finished: new Date().toLocaleString()
            });
            if (this.moveQueue.toSecond[0]) {
                this.moveQueue.toSecond[0]();
                this.moveQueue.toSecond = this.moveQueue.toSecond.slice(1);
            }
            this.saveData();
        },
        saveFirst(todos) {
            todos = todos.map(t => ({
                    ...t,
                    tasks: t.tasks.map(tsk => {
                        if (tsk.subtasks.length) tsk.done = tsk.subtasks.every(s => s.done);
                        return tsk
                    })
                })
            )
            this.tableData.firstTable.todos = todos;
            this.saveData();
        },
        saveSecond(todos) {
            todos = todos.map(t => ({
                    ...t,
                    tasks: t.tasks.map(tsk => {
                        if (tsk.subtasks.length) tsk.done = tsk.subtasks.every(s => s.done);
                        return tsk
                    })
                })
            )
            this.tableData.secondTable.todos = todos;
            this.saveData();
        },
        saveData() {
            localStorage.setItem('tableData', JSON.stringify(this.tableData));
        }
    },
    computed: {
        blockData() {
            return {
                firstTable: this.tableData.firstTable.todos.length >= this.tableData.firstTable.max,
                secondTable: this.tableData.secondTable.todos.length >= this.tableData.secondTable.max,
            }
        }
    },
    mounted() {
        const savedTasks = JSON.parse(localStorage.getItem('tableData'));
        if (savedTasks) this.tableData = savedTasks;
        modalEventBus.$on('create-todo', (todo) => {
            const tasks = todo.tasks.map((t, i) => ({id: i, name: t, done: false, blocked: false, subtasks: []}));
            const newTodo = {
                id: new Date().toISOString() + Math.random() * 1000,
                name: todo.name,
                table: 0,
                tasks,
            }
            this.tableData.firstTable.todos.push(newTodo);
            this.saveData();
        })
        modalEventBus.$on('add-subtask', (id, taskId, subtask) => {
            const newSubtask = {
                id: new Date().toISOString() + Math.random() * 1000,
                name: subtask,
                done: false,
            }
            this.tableData.firstTable.todos = this.tableData.firstTable.todos.map(t => {
                if (t.id === id) return {
                    ...t,
                    tasks: t.tasks.map(tsk => {
                        if (tsk.id === taskId) return {...tsk, subtasks: [...tsk.subtasks, newSubtask]};
                        return tsk
                    })
                }
                return t;
            })
            this.saveData();
        })
    }
})

Vue.component('task-modal', {
    template: `
        <div class="modal">
            <div class="overlay" @click="closeModal"></div>
            <div class="modalContent">
                <button class="modalClose" @click="closeModal"></button>
                <form v-if="variant === 'todo'" class="modalForm" @submit.prevent="onTodoSubmit">
                    <label class="modalInput">
                        Имя задачи
                        <input type="text" v-model="todoTitle" required placeholder="Имя вашей задачи">
                    </label>
                    <label v-for="(task, index) in todoTasks" :key="index" class="modalInput">
                        Задание {{ index + 1 }}
                        <input type="text" v-model="todoTasks[index]" required placeholder="Введите задание...">
                    </label>
                    <div style="display: flex; gap: 12px">
                        <button type="button" @click="addTask">Добавить задание</button>
                        <button type="button" @click="removeTask">Убрать задание</button>
                    </div>
                    <button type="submit">Добавить</button>
                </form>
                <form v-else-if="variant === 'subtask'" class="modalForm" @submit.prevent="onSubtaskSubmit">
                    <label class="modalInput">
                        Имя подзадачи
                        <input type="text" v-model="todoSubtask" required placeholder="Имя вашей задачи">
                    </label>
                    <button type="submit">Добавить</button>
                </form>
            </div>
        </div>
    `,
    data() {
        return {
            variant: 'todo',
            todoId: null,
            taskId: null,
            todoSubtask: '',
            todoTitle: '',
            todoTasks: ['', '', ''],
        };
    },
    methods: {
        addTask() {
            if (this.todoTasks.length < 5) this.todoTasks.push('')
        },
        removeTask() {
            if (this.todoTasks.length > 3) this.todoTasks.pop()
        },
        closeModal() {
            modalEventBus.$emit('close-modal');
        },
        onTodoSubmit() {
            modalEventBus.$emit('create-todo', {
                name: this.todoTitle,
                tasks: this.todoTasks,
            });
            modalEventBus.$emit('close-modal');
        },
        onSubtaskSubmit() {
            modalEventBus.$emit('add-subtask', this.todoId, this.taskId, this.todoSubtask);
            modalEventBus.$emit('close-modal');
        },
    },
    mounted() {
        modalEventBus.$on('todo-form', () => {
            this.variant = 'todo';
            this.todoTitle = '';
            this.todoTasks = ['', '', ''];
        });
        modalEventBus.$on('subtask-form', (id, taskId) => {
            this.variant = 'subtask';
            this.todoId = id;
            this.taskId = taskId;
            this.todoSubtask = '';
        });
    }
})

let app = new Vue({
    el: '#app',
    data: {
        isModalOpen: false,
    },
    mounted() {
        modalEventBus.$on('close-modal', () => {
            this.isModalOpen = false;
        });
        modalEventBus.$on('open-modal', () => {
            this.isModalOpen = true;
        });
    }
})