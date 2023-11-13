import {Repository} from "typeorm";
import {TaskEntity} from "../db/entities/task.entity";
import {AppDataSource} from "../db/data-source";
import {app} from "../main";
import {UserEntity} from "../db/entities/user.entity";
import {TaskStatusEnum} from "../db/interfaces";

export class TaskController {
    taskRepository: Repository<TaskEntity>
    userRepository: Repository<UserEntity>

    constructor(public baseRoute: string) {
        this.taskRepository = AppDataSource.dataSource.getRepository(TaskEntity);
        this.userRepository = AppDataSource.dataSource.getRepository(UserEntity);

        this._getAllTasksListener();
        this._addNewTaskListener();
        this._removeTaskListener();
        this._updateTaskListener();

    }

    private _getAllTasksListener() {
        app.get(`${this.baseRoute}`, async (req, res, next) => {

            const tasks = await this.taskRepository.find({
                relations: {
                    assignee: true
                }
            })

            res
                .status(200)
                .send(tasks)
        })
    }

    private _addNewTaskListener() {
        app.post(
            `${this.baseRoute}`,
            async (req, res, next) => {
                const {userEmail, title, description, taskId} = req.body
                let user: UserEntity | null = null;

                if (!taskId) {
                    res
                        .status(400)
                        .send('Bad request')
                    return;
                }

                const existTask = await this.taskRepository.findOneBy({displayId: taskId})

                if (existTask) {
                    res
                        .status(409)
                        .send('Task with this id is Existed')
                    return;
                }

                if (userEmail)
                    user = await this.userRepository.findOneBy({email: userEmail})

                const task = new TaskEntity();
                task.title = title || '';
                task.description = description || '';
                task.displayId = taskId;

                if (user) task.assignee = user;

                this.taskRepository.save(task).then(t => {
                    res
                        .status(201)
                        .send(t)
                });
            }
        )
    }

    private _removeTaskListener() {
        app.delete(`${this.baseRoute}`, async (req, res, next) => {
                const {taskId} = req.body
                if (!taskId) {

                    res
                        .status(400)
                        .send('Bad request')
                    return;
                }
                const task = await this.taskRepository.findOneBy({displayId: taskId})
                if (!task) {
                    res
                        .status(404)
                        .send('Task not found')

                    return;
                }

                this.taskRepository.remove(task).then(t => {
                    res
                        .status(201)
                        .send(t)
                })

            }
        )
    }

    private _updateTaskListener() {
        app.patch(`${this.baseRoute}`, async (req, res, next) => {
            const {taskId, title, description, status, user} = req.body

            if (!taskId) {
                res
                    .status(400)
                    .send('Bad request')
                return;
            }

            const task = await this.taskRepository.findOne({
                where: {displayId: taskId},
                relations: {assignee: true}
            })

            if (!task) {
                res
                    .status(404)
                    .send('task with this id is not found')
                return;
            }

            if (user) task.assignee = user;

            task.title = title;
            task.description = description;

            if (Object.values(TaskStatusEnum).includes(status))
                task.status = status

            this.taskRepository.save(task).then(t => {
                res
                    .status(201)
                    .send(t)
            })
        })
    }
}