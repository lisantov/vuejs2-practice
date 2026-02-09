const modalEventBus = new Vue();

Vue.component('todo-table', {
    props: {
        tasks: {
            type: Array,
            required: true
        },
        name: String,
        editable: Boolean,
        deletable: Boolean,
        canMovePrevious: Boolean,
        canMoveNext: Boolean,
        deadlineFixer: Boolean,
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
                        <div v-if="task.comment" class="deadline">
                            <div class="deadlineSeparator"></div>
                            <p class="itemDescription">{{ task.comment }}</p>
                        </div>
                        <div v-if="!deadlineFixer" class="deadline">
                            <div class="deadlineSeparator"></div>
                            <p>Дедлайн через {{getDaysAgo(task.deadline) * -1}} д. </p>
                        </div>
                        <p v-else :class="{ success: true, error: getDaysAgo(task.deadline) * -1 < 0 }">{{(getDaysAgo(task.deadline) * -1) < 0 ? 'Задание просрочено' : 'Задание выполнено в срок'}}</p>
                        <span class="itemDate">{{getDaysAgo(task.createdAt) > 0 ? getDaysAgo(task.createdAt) + ' д. назад' : 'сегодня'}}</span>
                    </div>
                    <div v-if="deletable || editable" class="itemControls">
                        <div v-if="canMovePrevious || canMoveNext" class="itemTableControls">
                            <button v-if="canMovePrevious" class="itemReturn" @click="moveTaskWithComment(task, -1)">Вернуть</button>
                            <button v-if="canMoveNext" class="itemNext" @click="moveTask(task, 1)">Принять</button>
                        </div>
                        <button v-if="editable" @click="updateTask(task)">Редактировать</button>
                        <button v-if="deletable" @click="deleteTask(task.id)">Удалить</button>
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
        },
        moveTask(task, step) {
            this.$emit('task-move', task, step);
        },
        moveTaskWithComment(task, step) {
            modalEventBus.$emit('handle-comment', task.id, step);
            modalEventBus.$emit('open-modal');
        }
    }
})

Vue.component('canban-list', {
    template: `
        <main>
            <div class="canbanGrid">
                <todo-table
                    v-for="(t, i) in tableData"
                    :key="i"
                    :tasks="tasks[i]"
                    :name="t.name"
                    :editable="t.editable"
                    :deletable="t.deletable"
                    :canMovePrevious="t.previous"
                    :canMoveNext="t.next"
                    :deadlineFixer="t.deadline"
                    @task-delete="handleDelete"
                    @task-move="handleMove"
                ></todo-table>
                <button class="canbanButton" @click="openModal">Добавить задачу</button>
            </div>
        </main>
    `,
    data() {
        return {
            tableData: [
                {
                    name: 'Запланированные задачи',
                    editable: true,
                    deletable: true,
                    previous: false,
                    next: true,
                    deadline: false,
                },
                {
                    name: 'Задачи в работе',
                    editable: true,
                    deletable: false,
                    previous: false,
                    next: true,
                    deadline: false,
                },
                {
                    name: 'Тестирование',
                    editable: true,
                    deletable: false,
                    previous: true,
                    next: true,
                    deadline: false,
                },
                {
                    name: 'Выполненные задачи',
                    editable: false,
                    deletable: false,
                    previous: false,
                    next: false,
                    deadline: true,
                },
            ],
            tasksData: [
                {
                    id: 0,
                    table: 0,
                    name: 'Первая задача',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec sapien consectetur, egestas massa tincidunt, vehicula risus. Integer suscipit ante sit amet luctus rutrum. Cras.',
                    createdAt: new Date('2025-11-11'),
                    deadline: new Date('2027-11-11'),
                    updatedAt: new Date(),
                    comment: null
                },
                {
                    id: 1,
                    table: 0,
                    name: 'Первая задача',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec sapien consectetur, egestas massa tincidunt, vehicula risus. Integer suscipit ante sit amet luctus rutrum. Cras.',
                    createdAt: new Date('2025-11-11'),
                    deadline: new Date('2026-01-01'),
                    updatedAt: new Date(),
                    comment: null
                }
            ]
        }
    },
    computed: {
        tasks() {
            return [
                ...this.tableData.map((t, i) => this.tasksData.filter((task) => task.table === i))
            ];
        },
    },
    methods: {
        openModal() {
            modalEventBus.$emit('handle-create');
            modalEventBus.$emit('open-modal');
        },
        handleDelete(id) {
            this.tasksData = this.tasksData.filter((task) => task.id !== id);
        },
        handleMove(task, step) {
            this.tasksData = this.tasksData.map((t) => {
                if (t.id === task.id) return {
                    ...task,
                    table: t.table + step
                };
                return t;
            });
        },
    },
    mounted() {
        modalEventBus.$on('create-task', (task) => {
            this.tasksData.push({
                ...task,
                id: new Date().getTime() + Math.random() * 1000,
                table: 0,
            });
        });
        modalEventBus.$on('update-task', (task) => {
            task.deadline = new Date(`${task.deadline.getFullYear()}-${task.deadline.getMonth()+1}-${task.deadline.getDate()}`);
            this.tasksData = this.tasksData.map((t) => {
                if (t.id === task.id) return Object.assign(t, task);
                return t;
            });
        });
        modalEventBus.$on('add-comment', (comment, taskId, step) => {
            const task = this.tasksData.find((t) => t.id === taskId);
            this.handleMove({ ...task, comment }, step);
        });
    }
})

Vue.component('canban-modal', {
    template: `
        <div class="modal">
            <div class="overlay" @click="closeModal"></div>
            <div class="modalContent">
                <button class="modalClose" @click="closeModal"></button>
                <form v-if="variant === 'task'" class="modalForm" @submit.prevent="onTaskSubmit">
                    <label class="modalInput">
                        Имя задачи
                        <input type="text" v-model="task.name" required placeholder="Имя вашей задачи">
                    </label>
                    <label class="modalInput">
                        Описание задачи
                        <input type="text" v-model="task.description" required placeholder="Введите описание...">
                    </label>
                    <label class="modalInput" v-if="!isRedacting || isActualDate(task.deadline)">
                        Дедлайн задачи
                        <input type="date" v-model="task.deadline" required placeholder="Выберите дедлайн задачи...">
                    </label>
                    <button type="submit">Сохранить</button>
                </form>
                <form v-if="variant === 'comment'" @submit.prevent="onCommentSubmit">
                    <label class="modalInput">
                        Комментарий
                        <input type="text" v-model="comment" required placeholder="Напишите причину возврата...">
                    </label>
                    <button type="submit">Сохранить</button>
                </form>
            </div>
        </div>
    `,
    data() {
        return {
            task: {
                id: '',
                name: '',
                description: '',
                deadline: null,
                createdAt: null,
                step: 0
            },
            isRedacting: false,
            variant: 'task',
            comment: null,
        };
    },
    methods: {
        closeModal() {
            modalEventBus.$emit('close-modal');
        },
        onTaskSubmit() {
            if (!this.isRedacting) {
                modalEventBus.$emit('create-task', {
                    name: this.task.name,
                    description: this.task.description,
                    deadline: new Date(this.task.deadline),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
            }
            else {
                modalEventBus.$emit('update-task', {
                    id: this.task.id,
                    name: this.task.name,
                    description: this.task.description,
                    deadline: new Date(this.task.deadline),
                    createdAt: this.task.createdAt,
                    updatedAt: new Date(),
                })
                this.isRedacting = false;
            }
            modalEventBus.$emit('close-modal');
        },
        onCommentSubmit() {
            modalEventBus.$emit('add-comment', this.comment, this.task.id, this.task.step);
            modalEventBus.$emit('close-modal');
        },
        isActualDate(date) {
            return (new Date(date).getTime() - new Date().getTime()) > 0;
        },
    },
    mounted() {
        modalEventBus.$on('handle-update', (task) => {
            this.variant = 'task';
            this.task = {
                ...task,
                deadline: `${task.deadline.getFullYear()}-${task.deadline.getMonth()+1}-${task.deadline.getDate()}`,
            };
            this.isRedacting = true;
        });
        modalEventBus.$on('handle-create', () => {
            this.variant = 'task';
            this.task.id = null;
            this.task.name = null;
            this.task.description = null;
            this.task.deadline = null;
            this.task.createdAt = null;
            this.isRedacting = false;
        });
        modalEventBus.$on('handle-comment', (taskId, step) => {
            this.variant = 'comment';
            this.task.id = taskId;
            this.task.step = step;
            this.comment = null;
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