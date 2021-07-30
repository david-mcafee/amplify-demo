import React, { useEffect, useState } from "react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { createTodo, deleteTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";
import {
  Button,
  Header,
  Icon,
  Input,
  List,
  ListItem,
  ListContent,
  ListHeader,
  ListDescription,
} from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";
import awsExports from "./aws-exports";
import { onCreateTodo, onDeleteTodo } from "./graphql/subscriptions";

Amplify.configure(awsExports);

const initialState = { name: "", description: "", priority: "" };

const Todo = () => {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  // Subscribe to onCreate updates
  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onCreateTodo)).subscribe({
      next: (todoData) => {
        console.log(todoData);
        const todo = todoData?.value?.data?.onCreateTodo;

        // Only add todo if it doesn't already exist in state (i.e. another user)
        if (todos.filter((t) => t.id === todo.id).length === 0) {
          setTodos([...todos, todo]);
        }
      },
    });

    return () => subscription.unsubscribe();
  }, [todos]);

  // Subscribe to onDelete updates
  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onDeleteTodo)).subscribe({
      next: (todoData) => {
        console.log(todoData);
        const todo = todoData?.value?.data?.onDeleteTodo;
        // TODO: don't always perform this operation (i.e. another user has removed todo)
        setTodos(todos.filter((t) => t.id !== todo.id));
      },
    });

    return () => subscription.unsubscribe();
  }, [todos]);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todos = todoData.data.listTodos.items;
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
      const todoId = uuidv4();

      const todo = { id: todoId, ...formState };

      setTodos([...todos, todo]);

      setFormState(initialState);

      await API.graphql(graphqlOperation(createTodo, { input: { ...todo } }));
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

  async function removeTodo(todoId) {
    try {
      // TODO:
      setTodos(todos.filter((todo) => todo.id !== todoId));
      await API.graphql(
        graphqlOperation(deleteTodo, { input: { id: todoId } })
      );
    } catch (err) {
      // If there was an error, fetch todos because local state is not correct
      fetchTodos();
      console.log("error deleting todo:", err);
    }
  }

  return (
    <div style={styles.parentContainer}>
      <div style={styles.container}>
        <Header as="h1" icon textAlign>
          <Icon name="users" circular />
          <Header.Content>Shared Todos</Header.Content>
          <Header sub>Open in 2 tabs to test concurrent updates</Header>
        </Header>
        <Input
          onChange={(event) => setInput("name", event.target.value)}
          value={formState.name}
          placeholder="Name"
        />
        <Input
          onChange={(event) => setInput("description", event.target.value)}
          value={formState.description}
          placeholder="Description"
        />
        <Input
          onChange={(event) => setInput("priority", event.target.value)}
          value={formState?.priority}
          placeholder="Priority"
        />
        <Button onClick={addTodo}>Create Todo</Button>
        <List>
          {todos.map((todo, index) => (
            <ListItem key={todo.id ? todo.id : index}>
              <ListContent floated="right">
                <Button onClick={() => removeTodo(todo.id)} icon circular>
                  <Icon name="delete" color="red" />
                </Button>
              </ListContent>
              <ListContent>
                <ListHeader>
                  <p>{todo.name}</p>
                </ListHeader>
                <ListDescription>
                  <p>{todo.description}</p>
                </ListDescription>
                <ListDescription>
                  <p>{todo?.priority}</p>
                </ListDescription>
              </ListContent>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: 400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  parentContainer: {
    width: "100%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
};

export default Todo;
