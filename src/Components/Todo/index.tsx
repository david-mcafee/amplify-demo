import React, { useEffect, useState } from "react";
import { API, graphqlOperation, Hub } from "aws-amplify";
// import { createTodo, deleteTodo } from "../../graphql/mutations";
import { createTodo } from "../../graphql/mutations";
import { listTodos } from "../../graphql/queries";
import { v4 as uuidv4 } from "uuid";
import { onCreateTodo, onDeleteTodo } from "../../graphql/subscriptions";
import { useStyles } from "./styles";
// import { Todo as TodoModel } from "../../models";

type Todo = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
};

type InitialState = {
  readonly name: string;
  readonly description: string;
};
const initialState: InitialState = { name: "", description: "" };
const initialTodoState: Array<Todo> = [];

const TodoHome = () => {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState(initialTodoState);

  const { container, parentContainer } = useStyles();

  useEffect(() => {
    fetchTodos();
  }, []);

  // Subscribe to onCreate updates
  useEffect(() => {
    // https://github.com/aws-amplify/amplify-js/issues/7589
    // @ts-ignore
    const subscription = API.graphql(graphqlOperation(onCreateTodo)).subscribe({
      // TODO: add type
      next: (todoData: any) => {
        console.log(todoData);
        const todo = todoData?.value?.data?.onCreateTodo;

        // Only add todo if it doesn't already exist in state (i.e. another user)
        if (todos.filter((t) => t.id === todo.id).length === 0) {
          setTodos([...todos, todo]);
        }
      },
      error: (error: any) => {
        console.log(error);
      },
    });

    return subscription.unsubscribe;
  }, []);

  // Subscribe to onDelete updates
  useEffect(() => {
    // https://github.com/aws-amplify/amplify-js/issues/7589
    // @ts-ignore
    const subscription = API.graphql(graphqlOperation(onDeleteTodo)).subscribe({
      // TODO: add type
      next: (todoData: any) => {
        console.log(todoData);
        const todo = todoData?.value?.data?.onDeleteTodo;
        // TODO: don't always perform this operation (i.e. another user has removed todo)
        setTodos(todos.filter((t) => t.id !== todo.id));
      },
      error: (error: any) => {
        console.log(error);
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  // DataStore subscription
  // useEffect(() => {
  //   function handleSubscriptionUpdate(msg: any) {
  //     if (msg.opType === "DELETE") {
  //       setTodos((todos) => todos.filter((t) => t.id !== msg.element.id));
  //     } else if (msg.opType === "INSERT") {
  //       setTodos((todos) => [...todos, msg.element]);
  //     }
  //   }
  //   const subscription = DataStore.observe(TodoModel).subscribe((msg) => {
  //     handleSubscriptionUpdate(msg);
  //   });
  //   return subscription.unsubscribe;
  // }, []);

  useEffect(() => {
    // Create ulener
    const listener = Hub.listen("datastore", async (hubData) => {
      const { event, data } = hubData.payload;
      console.log("Hub event:", event);
      console.log("Hub data:", data);
    });

    // Remove ulener
    return listener;
  }, []);

  function setinput(key: string, value: string) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const todoData: any = await API.graphql(graphqlOperation(listTodos));
      const todos = todoData.data.ulTodos.items;
      // const todos: any = await DataStore.query(TodoModel);
      setTodos(todos);
    } catch (err) {
      console.log("error fetching todos");
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;

      // Generate id so that you can optimistically update state, while still allowing
      // for update and delete, since those require ids. Alternative is to fetch
      // on each operation, but that's slow.
      // const todoId = uuidv4();

      const todo = { id: uuidv4(), ...formState };

      setFormState(initialState);

      await API.graphql(graphqlOperation(createTodo, { input: { ...todo } }));
      // await DataStore.save(
      //   new TodoModel({
      //     ...todo,
      //   })
      // );
    } catch (err) {
      // If there was an error, fetch todos because local state is not correct
      fetchTodos();
      console.log("error creating todo:", err);
    }
  }

  // TODO:
  // /* update a todo */
  // await API.graphql(
  //   graphqlOperation(updateTodo, {
  //     input: { id: todoId, name: "Updated todo info" },
  //   })
  // );

  // async function removeTodo(todo: any) {
  //   try {
  //     setTodos(todos.filter((t) => t.id !== todo.id));
  //     await API.graphql(
  //       graphqlOperation(deleteTodo, { input: { id: todo.id } })
  //     );
  //     // await DataStore.delete(todo);
  //   } catch (err) {
  //     // If there was an error, fetch todos because local state is not correct
  //     fetchTodos();
  //     console.log("error deleting todo:", err);
  //   }
  // }

  return (
    <div className={parentContainer}>
      <div className={container}>
        {/* <div as="h1" icon textAlign="center">
          <Icon name="users" circular />
          <div.Content>My Todos</div.Content>
          <div sub>Amplify GraphQL API Demo</div>
        </div> */}
        <input
          onChange={(event) => setinput("name", event.target.value)}
          value={formState.name}
          placeholder="Name"
        />
        <input
          onChange={(event) => setinput("description", event.target.value)}
          value={formState.description}
          placeholder="Description"
        />
        <button onClick={addTodo}>Create Todo</button>
        <ul>
          {todos.map((todo, index) => (
            <li key={todo.id ? todo.id : index}>
              {/* <div floated="right"> */}
              {/* <button onClick={() => removeTodo(todo)} icon circular>
                  <Icon name="delete" color="red" />
                </button> */}
              {/* </div> */}
              <div>
                <div>
                  <p>{todo.name}</p>
                </div>
                <div>
                  <p>{todo.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoHome;
