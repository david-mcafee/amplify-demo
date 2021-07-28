import React, { useEffect, useState } from "react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { createTodo, deleteTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";
import {
  Button,
  Input,
  List,
  ListItem,
  ListContent,
  ListHeader,
  ListDescription,
} from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = { name: "", description: "" };

const Todo = () => {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

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

      const todo = { ...formState };
      setFormState(initialState);
      setTodos([...todos, todo]);
      // Generate id so that you can optimistically update state, while still allowing
      // for update and delete, since those require ids. Alternative is to fetch
      // on each operation, but that's slow.
      await API.graphql(
        graphqlOperation(createTodo, { input: { id: uuidv4(), ...todo } })
      );
    } catch (err) {
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
      /* delete a todo */
      setTodos(todos.filter((todo) => todo.id !== todoId));
      await API.graphql(
        graphqlOperation(deleteTodo, { input: { id: todoId } })
      );
    } catch (err) {
      fetchTodos();
      console.log("error deleting todo:", err);
    }
  }

  return (
    <div style={styles.parentContainer}>
      <div style={styles.container}>
        <h2>Amplify Todos</h2>
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
        <Button onClick={addTodo}>Create Todo</Button>
        <List as="ul">
          {todos.map((todo, index) => (
            <ListItem key={todo.id ? todo.id : index}>
              <ListContent>
                <ListHeader>
                  <p>{todo.name}</p>
                </ListHeader>
                <ListDescription>
                  <p>{todo.description}</p>
                </ListDescription>
                <Button color={"red"} onClick={() => removeTodo(todo.id)}>
                  Delete
                </Button>
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
