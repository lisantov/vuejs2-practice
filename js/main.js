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
                    <h2 class="itemTitle">{{todo.name}}</h2>
                    <ul class="itemGrid">
                        <li v-for="task in todo.tasks" class="itemGridTask" :key="task.id">
                            <p>{{ task.name }}</p>
                            <input v-model="task.done" type="checkbox" @change="checkQuota(todo)">
                        </li>
                    </ul>
                </li>
            </ul>
            <button v-if="addable && !blocked" class="tableButton">Добавить задачу</button>
        </div>
    `,
    methods: {
        checkQuota(todo) {
            const total = todo.tasks.length;
            const checked = todo.tasks.filter(t => t.done).length;
            if ((checked / total) * 100 >= this.transitionQuota) this.$emit('task-transition', todo)
        }
    }
})

Vue.component('todo-list', {
    template: `
        <main class="todo-grid">
            <todo-table
                :blocked="blockData.firstTable"
                :todos="tableData.firstTable.todos"
                :addable="true" :max="tableData.firstTable.max"
                :transitionQuota="tableData.firstTable.transitionQuota"
                @task-transition="moveToSecond"
            ></todo-table>
            <todo-table
                :todos="tableData.secondTable.todos"
                :max="tableData.secondTable.max"
                :transitionQuota="tableData.secondTable.transitionQuota"
                @task-transition="moveToThird"
            ></todo-table>
            <todo-table :todos="tableData.thirdTable.todos"></todo-table>
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
                            id: 2,
                            name: 'Вторая задача',
                            tasks: [
                                {
                                    id: 0,
                                    name: 'Почесать голову',
                                    done: true
                                },
                                {
                                    id: 1,
                                    name: 'Сделать лабу',
                                    done: false
                                },
                                {
                                    id: 2,
                                    name: 'Ну и что-то ещё очень важное',
                                    done: false
                                },
                                {
                                    id: 3,
                                    name: 'Ну и что-то ещё очень важное',
                                    done: false
                                },
                                {
                                    id: 4,
                                    name: 'Ну и что-то ещё очень важное',
                                    done: false
                                },
                                {
                                    id: 5,
                                    name: 'Ну и что-то ещё очень важное',
                                    done: false
                                },
                                {
                                    id: 6,
                                    name: 'Ну и что-то ещё очень важное',
                                    done: false
                                }
                            ],
                        },
                        {
                            id: 3,
                            name: 'ТРЕТЬЯ задача',
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
                            id: 4,
                            name: 'ЧЕТВЁРТАЯ задача',
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
                            id: 5,
                            name: 'ПЯТАЯ задача',
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
                            id: 6,
                            name: 'ШЕСТАЯ задача',
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
                            id: 7,
                            name: 'СЕДЬМАЯ задача',
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
                            id: 8,
                            name: 'ВОСЬМАЯ задача',
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
            }
            else this.moveQueue.push(() => {
                this.tableData.firstTable.todos = this.tableData.firstTable.todos.filter(t => t.id !== todo.id);
                this.tableData.secondTable.todos.push(todo);
            })
        },
        moveToThird(todo) {
            this.tableData.secondTable.todos = this.tableData.secondTable.todos.filter(t => t.id !== todo.id);
            this.tableData.thirdTable.todos.push(todo);
            if (this.moveQueue[0]) {
                this.moveQueue[0]();
                this.moveQueue = this.moveQueue.slice(1);
            }
        },
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