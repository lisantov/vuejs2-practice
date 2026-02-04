const eventBus = new Vue()

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
                <li v-for="todo in todos" class="item">
                    <h2 class="itemTitle">{{todo.name}}</h2>
                    <ul class="itemGrid">
                        <li v-for="task in todo.tasks" class="itemGridTask">
                            <p>{{ task }}</p>
                            <input type="checkbox">
                        </li>
                    </ul>
                </li>
            </ul>
            <button v-if="addable" class="tableButton">Добавить задачу</button>
        </div>
    `,
    computed: {

    },
})

Vue.component('todo-list', {
    template: `
        <main class="todo-grid">
            <todo-table :blocked="blockData.firstTable" :todos="tableData.firstTable.todos" :addable="true" :max="tableData.firstTable.max" :transitionQuota="tableData.firstTable.transitionQuota"></todo-table>
            <todo-table :blocked="blockData.secondTable" :todos="tableData.secondTable.todos" :max="tableData.secondTable.max" :transitionQuota="tableData.secondTable.transitionQuota"></todo-table>
            <todo-table :todos="tableData.thirdTable.todos"></todo-table>
        </main>
    `,
    data() {
        return {
            tableData: {
                firstTable: {
                    todos: [
                        {
                            name: 'Первая задача',
                            tasks: ['Погладить чайник', 'Вскипятить кота'],
                        },
                        {
                            name: 'Вторая задача',
                            tasks: ['Почесать голову', 'Почистить зубы'],
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
            }
        }
    },
    computed: {
        blockData() {
            return {
                firstTable: this.tableData.firstTable.todos.length >= this.tableData.firstTable.max,
                secondTable: this.tableData.secondTable.todos.length >= this.tableData.secondTable.max,
            }
        }
    }
})

let app = new Vue({
    el: '#app',
})