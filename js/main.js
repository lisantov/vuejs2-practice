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
                    <div style="display: grid; gap: 2px">
                        <h2 class="itemTitle">{{task.name}}</h2>
                        <p v-if="task.finished" class="itemFinish">{{ task.finished }}</p>
                    </div>
                </li>
            </ul>
        </div>
    `,
    methods: {
    }
})

Vue.component('canban-list', {
    template: `
        <main>
            <div class="canbanGrid">
                <todo-table
                    :tasks="tableData.firstTable.tasks"
                    :name="tableData.firstTable.name"
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
                            name: 'Первая задача'
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
            modalEventBus.$emit('open-modal');
        },
    },
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