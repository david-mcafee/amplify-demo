import { useState, useEffect, useCallback } from 'react';
import { DataStore, Predicates } from 'aws-amplify';
import { Todo } from '../../models';
import {
	Button,
	Collection,
	Card,
	Heading,
	Flex,
	Text,
} from '@aws-amplify/ui-react';
import DataStoreOperations from '../DataStoreOperations';

let subscriptions: any[] = [];

function TodoComponent() {
	const [todos, setTodos] = useState<any>([]);

	const initSubs = useCallback(() => {
		if (subscriptions.length) {
			unsubSubs();
		}

		subscriptions.push(
			DataStore.observe(Todo).subscribe(msg => {
				console.log('observe:', msg);
				getTodos();
			})
		);
	}, []);

	useEffect(() => {
		initSubs();

		return () => {
			unsubSubs();
		};
	}, [initSubs]);

	function unsubSubs() {
		subscriptions &&
			subscriptions.length &&
			subscriptions.forEach(sub => sub.unsubscribe());
	}

	async function getTodos() {
		const _todos = await DataStore.query(Todo);
		setTodos(_todos);
		console.log('Todos', _todos);
	}

	async function createTodo() {
		try {
			const todo = await DataStore.save(
				new Todo({
					name: `Todo ${Date.now()}`,
					description: 'test',
				})
			);
			console.log('Todo created:', todo);
		} catch (error) {
			console.error('Save failed:', error);
		}
	}

	async function updateTodo(originalTodo: Todo) {
		try {
			const todo = await DataStore.save(
				// @ts-ignore
				Todo.copyOf(originalTodo, updated => {
					updated.name = `Todo ${Date.now()}`;
				})
			);

			console.log('Todo updated:', todo);
		} catch (error) {
			console.error('Update failed:', error);
		}
	}

	async function deleteTodo(todo: Todo) {
		if (!todo) return;
		await DataStore.delete(todo);
	}

	async function deleteAll() {
		await DataStore.delete(Todo, Predicates.ALL);
	}

	return (
		<Card width={'100%'} variation={'elevated'}>
			<Flex direction="column" alignItems="center">
				<Card width={'100%'} variation={'elevated'}>
					<Flex direction={'column'} alignItems="center">
						<Heading level={1}>DataStore Tests</Heading>
						<Card width={'100%'} variation={'elevated'}>
							<Flex direction={'column'} alignItems="center">
								<Heading level={2}>Instructions:</Heading>
								<Text>
									Create, Update, and Delete records. Updates will should be
									reflected in the UI.
								</Text>
							</Flex>
						</Card>
						<Card width={'100%'} variation={'elevated'}>
							<Flex direction={'column'} alignItems="center">
								<DataStoreOperations
									initSubs={initSubs}
									deleteAll={deleteAll}
								/>
							</Flex>
						</Card>
					</Flex>
				</Card>
				<Card width={'100%'} variation={'elevated'}>
					<Flex direction={'column'} alignItems="center">
						<Heading level={2}>Todos:</Heading>
						<Button onClick={createTodo}>Create Todo</Button>
						<Card width={'100%'} variation={'elevated'}>
							<Flex direction="column" alignItems="center">
								<Collection type="list" items={todos} gap="1.5rem">
									{(todo: Todo, index: number) => (
										<Card
											key={todo.id ? todo.id : index}
											padding="1.5rem"
											variation={'elevated'}
										>
											<Heading level={4}>{todo.name}</Heading>
											<Text>{todo.description}</Text>
											<Button
												loadingText="loading"
												ariaLabel="Update"
												onClick={() => updateTodo(todo)}
											>
												Update
											</Button>
											<Button
												loadingText="loading"
												ariaLabel="Delete"
												onClick={() => deleteTodo(todo)}
											>
												Delete
											</Button>
										</Card>
									)}
								</Collection>
							</Flex>
						</Card>
					</Flex>
				</Card>
			</Flex>
		</Card>
	);
}

export default TodoComponent;
