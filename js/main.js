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
                            <p>{{ task.name }}</p>
                            <input v-model="task.done" type="checkbox" @change="checkQuota(todo)" :disabled="blocked">
                        </li>
                    </ul>
                </li>
            </ul>
            <button v-if="addable && !blocked" class="tableButton" @click="openModal">Добавить задачу</button>
        </div>
    `,
    methods: {
        checkQuota(todo) {
            const total = todo.tasks.length;
            const checked = todo.tasks.filter(t => t.done).length;
            if ((checked / total) * 100 >= this.transitionQuota) this.$emit('task-transition', todo)
            else this.$emit('update-todos', this.todos);
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
                :blocked="blockData.firstTable || blockData.secondTable"
                :todos="tableData.firstTable.todos"
                :addable="true" :max="tableData.firstTable.max"
                :transitionQuota="tableData.firstTable.transitionQuota"
                @task-transition="moveToSecond"
                @update-todos="saveFirst"
            ></todo-table>
            <todo-table
                :todos="tableData.secondTable.todos"
                :max="tableData.secondTable.max"
                :transitionQuota="tableData.secondTable.transitionQuota"
                @task-transition="moveToThird"
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
                            id: 0,
                            name: 'Первая задача',
                            tasks: [
                                {
                                    id: 0,
                                    name: 'Погладить чайник',
                                    done: false
                                },
                                {
                                    id: 1,
                                    name: 'Вскипятить кота',
                                    done: false
                                }
                            ],
                        },
                        {
                            id: 1,
                            name: 'ddsa задача',
                            tasks: [
                                {
                                    id: 0,
                                    name: 'Погладить чайник',
                                    done: false
                                },
                                {
                                    id: 1,
                                    name: 'Вскипятить кота',
                                    done: false
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
            moveQueue: []
        }
    },
    methods: {
        moveToSecond(todo) {
            if (!this.blockData.secondTable) {
                this.tableData.firstTable.todos = this.tableData.firstTable.todos.filter(t => t.id !== todo.id);
                this.tableData.secondTable.todos.push(todo);
                this.saveData();
            }
            else this.moveQueue.push(() => {
                this.tableData.firstTable.todos = this.tableData.firstTable.todos.filter(t => t.id !== todo.id);
                this.tableData.secondTable.todos.push(todo);
                this.saveData();
            })
        },
        moveToThird(todo) {
            this.tableData.secondTable.todos = this.tableData.secondTable.todos.filter(t => t.id !== todo.id);
            this.tableData.thirdTable.todos.push({
                ...todo,
                finished: new Date().toLocaleString()
            });
            if (this.moveQueue[0]) {
                this.moveQueue[0]();
                this.moveQueue = this.moveQueue.slice(1);
            }
            this.saveData();
        },
        saveFirst(todos) {
            this.tableData.firstTable.todos = todos;
            this.saveData();
        },
        saveSecond(todos) {
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
            const tasks = todo.tasks.map((t, i) => ({id: i, name: t, done: false}));
            const newTodo = {
                id: new Date().toISOString(),
                name: todo.name,
                tasks
            }
            this.tableData.firstTable.todos.push(newTodo);
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
                <form class="modalForm" @submit.prevent="onSubmit">
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
            </div>
        </div>
    `,
    data() {
        return {
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
        onSubmit() {
            modalEventBus.$emit('create-todo', {
                name: this.todoTitle,
                tasks: this.todoTasks,
            });
            modalEventBus.$emit('close-modal');
        }
    },
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