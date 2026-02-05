const modalEventBus = new Vue();

Vue.component('todo-table', {
    props: {
        tasks: {
            type: Array,
            required: true
        },
        name: String,
        blocked: Boolean,
        editable: Boolean,
        addable: Boolean,
    },
    template: `
        <div class="table">
            <p class="tableTitle">{{ name }}</p>
            <p v-if="!tasks">Задач нету</p>
            <ul v-else class="tableGrid">
                <li v-for="task in tasks" class="item" :key="task.id">
                    <div style="display: grid; gap: 4px">
                        <h2 class="itemTitle">{{task.name}}</h2>
                        <p class="itemDescription">{{task.description}}</p>
                        <div class="deadline">
                            <div class="deadlineSeparator"></div>
                            <p>Дедлайн через {{getDaysAgo(task.deadline) * -1}} д. </p>
                        </div>
                        <span class="itemDate">{{getDaysAgo(task.createdAt) > 0 ? getDaysAgo(task.createdAt) + ' д. назад' : 'сегодня'}}</span>
                    </div>
                    <div class="itemControls">
                        <button @click="updateTask(task)">Редактировать</button>
                        <button @click="deleteTask(task.id)">Удалить</button>
                    </div>
                </li>
            </ul>
        </div>
    `,
    methods: {
        getDaysAgo(date) {
            const diff = new Date().getTime() - date.getTime();
            return Math.floor(diff / (1000 * 60 * 60 * 24));
        },
        deleteTask(id) {
            this.$emit('task-delete', id);
        },
        updateTask(task) {
            modalEventBus.$emit('handle-update', task);
            modalEventBus.$emit('open-modal');
        }
    }
})

Vue.component('canban-list', {
    template: `
        <main>
            <div class="canbanGrid">
                <todo-table
                    :tasks="tableData.firstTable.tasks"
                    :name="tableData.firstTable.name"
                    @task-delete="handleDelete"
                ></todo-table>
                <todo-table
                    :tasks="tableData.secondTable.tasks"
                    :name="tableData.secondTable.name"
                ></todo-table>
                <todo-table
                    :tasks="tableData.thirdTable.tasks"
                    :name="tableData.thirdTable.name"
                ></todo-table>
                <todo-table
                    :tasks="tableData.fourthTable.tasks"
                    :name="tableData.fourthTable.name"
                ></todo-table>
                <button class="canbanButton" @click="openModal">Добавить задачу</button>
            </div>
        </main>
    `,
    data() {
        return {
            tableData: {
                firstTable: {
                    name: 'Запланированные задачи',
                    tasks: [
                        {
                            id: 0,
                            name: 'Первая задача',
                            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec sapien consectetur, egestas massa tincidunt, vehicula risus. Integer suscipit ante sit amet luctus rutrum. Cras.',
                            createdAt: new Date('2025-11-11'),
                            deadline: new Date('2027-11-11'),
                            updatedAt: new Date(),
                        }
                    ],
                },
                secondTable: {
                    name: 'Задачи в работе',
                    tasks: [],
                },
                thirdTable: {
                    name: 'Тестирование',
                    tasks: [],
                },
                fourthTable: {
                    name: 'Выполненные задачи',
                    tasks: [],
                },
            },
        }
    },
    methods: {
        openModal() {
            modalEventBus.$emit('handle-create');
            modalEventBus.$emit('open-modal');
        },
        handleDelete(id) {
            this.tableData.firstTable.tasks = this.tableData.firstTable.tasks.filter((task) => task.id !== id);
        },
        handleUpdate(task) {
            this.tableData.firstTable.tasks = this.tableData.firstTable.tasks.filter((task) => task.id !== id);
        }
    },
    mounted() {
        modalEventBus.$on('create-task', (task) => {
            this.tableData.firstTable.tasks.push({
                ...task,
                id: new Date().getTime() + Math.random() * 1000,
            });
        });
        modalEventBus.$on('update-task', (task) => {
            task.deadline = new Date(`${task.deadline.getFullYear()}-${task.deadline.getMonth()+1}-${task.deadline.getDate()}`);
            this.tableData.firstTable.tasks = this.tableData.firstTable.tasks.map((t) => {
                if (t.id === task.id) return task;
                return t;
            });
        });
    }
})

Vue.component('canban-modal', {
    template: `
        <div class="modal">
            <div class="overlay" @click="closeModal"></div>
            <div class="modalContent">
                <button class="modalClose" @click="closeModal"></button>
                <form class="modalForm" @submit.prevent="onSubmit">
                    <label class="modalInput">
                        Имя задачи
                        <input type="text" v-model="taskTitle" required placeholder="Имя вашей задачи">
                    </label>
                    <label class="modalInput">
                        Описание задачи
                        <input type="text" v-model="taskDescription" required placeholder="Введите описание...">
                    </label>
                    <label class="modalInput">
                        Дедлайн задачи
                        <input type="date" v-model="taskDeadline" required placeholder="Выберите дедлайн задачи...">
                    </label>
                    <button type="submit">Создать</button>
                </form>
            </div>
        </div>
    `,
    data() {
        return {
            taskId: '',
            taskTitle: '',
            taskDescription: '',
            taskDeadline: null,
            taskCreatedAt: null,
            isRedacting: false,
        };
    },
    methods: {
        closeModal() {
            modalEventBus.$emit('close-modal');
        },
        onSubmit() {
            if (!this.isRedacting) {
                modalEventBus.$emit('create-task', {
                    name: this.taskTitle,
                    description: this.taskDescription,
                    deadline: new Date(this.taskDeadline),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
            }
            else {
                modalEventBus.$emit('update-task', {
                    id: this.taskId,
                    name: this.taskTitle,
                    description: this.taskDescription,
                    deadline: new Date(this.taskDeadline),
                    createdAt: this.taskCreatedAt,
                    updatedAt: new Date(),
                })
                this.isRedacting = false;
            }
            modalEventBus.$emit('close-modal');
        }
    },
    mounted() {
        modalEventBus.$on('handle-update', (task) => {
            this.taskId = task.id;
            this.taskTitle = task.name;
            this.taskDescription = task.description;
            this.taskDeadline = `${task.deadline.getFullYear()}-${task.deadline.getMonth()+1}-${task.deadline.getDate()}`;
            this.taskCreatedAt = task.createdAt;
            this.isRedacting = true;
        });
        modalEventBus.$on('handle-create', () => {
            this.taskId = null;
            this.taskTitle = null;
            this.taskDescription = null;
            this.taskDeadline = null;
            this.taskCreatedAt = null;
            this.isRedacting = false;
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