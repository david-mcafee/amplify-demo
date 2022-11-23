import { useState } from 'react';
import { Analytics } from 'aws-amplify';
import { Button, Card, Heading, Flex, Text } from '@aws-amplify/ui-react';

type InitialFormState = {
	readonly attrKey: string;
	readonly attrValue: string;
};

const initialFormState: InitialFormState = { attrKey: '', attrValue: '' };

const AnalyticsComponent = () => {
	const [formAttributes, setFormAttributes] = useState(initialFormState);
	const [updateResponses, setUpdateResponses] = useState([]);
	const [eventResponses, setEventResponses] = useState([]);

	function setInput(key: string, value: string) {
		setFormAttributes({ ...formAttributes, [key]: value });
	}

	const updateEndpoint = async () => {
		try {
			if (!formAttributes.attrKey || !formAttributes.attrValue) {
				return;
			}

			const attributesPayload: any = {};
			attributesPayload[formAttributes.attrKey] = [formAttributes.attrValue];

			console.log(attributesPayload);

			const result: any = await Analytics.updateEndpoint({
				attributes: attributesPayload,
			});

			setUpdateResponses(prev => [...prev, result] as any);
		} catch (err) {
			console.log('Error updating endpoint: ', err);
		}
	};

	const updateEndpointEmptyPayload = async () => {
		try {
			const result: any = await Analytics.updateEndpoint({});

			setUpdateResponses(prev => [...prev, result] as any);
		} catch (err) {
			console.log('Error updating endpoint: ', err);
		}
	};

	const sendEventWithCustomAttribute = async () => {
		try {
			const attributesPayload: any = {};
			attributesPayload[formAttributes.attrKey] = formAttributes.attrValue;

			const result: any = await Analytics.record({
				name: 'test-event',
				attributes: attributesPayload,
			});

			setEventResponses(prev => [...prev, result] as any);
		} catch (err) {
			console.log('Error sending event: ', err);
		}
	};

	const sendBasicEvent = async () => {
		try {
			const result: any = await Analytics.record({
				name: 'test-event',
			});

			setEventResponses(prev => [...prev, result] as any);
		} catch (err) {
			console.log('Error sending basic event: ', err);
		}
	};

	return (
		<Card variation={'elevated'}>
			<Flex direction={'column'}>
				<Card width={'100%'} variation={'elevated'}>
					<Flex direction="column" alignItems="center">
						<Heading level={1}>Analytics Tests</Heading>
						<Card width={'100%'} variation={'elevated'}>
							<Flex direction={'column'} alignItems="center">
								<Heading level={2}>Instructions:</Heading>
								<Text>
									Click each button below. Each should correspond with a `200`
									response.
								</Text>
								<Text>
									Custom attribute operations will require a key and value in
									the input fields below.
								</Text>
								<Text>Note: response times may be delayed.</Text>
							</Flex>
						</Card>
					</Flex>
				</Card>
				<input
					onChange={event => setInput('attrKey', event.target.value)}
					value={formAttributes.attrKey}
					placeholder="Attribute key"
				/>
				<input
					onChange={event => setInput('attrValue', event.target.value)}
					value={formAttributes.attrValue}
					placeholder="Attribute value"
				/>
				<Button variation="primary" onClick={sendBasicEvent}>
					Send Basic Event
				</Button>
				<Button variation="primary" onClick={updateEndpoint}>
					Update Endpoint with Custom Attribute
				</Button>
				<Button variation="primary" onClick={sendEventWithCustomAttribute}>
					Send Event with Custom Attribute
				</Button>
				<Button variation="primary" onClick={updateEndpointEmptyPayload}>
					Update Event with Empty Payload
				</Button>
				<pre>Update Responses: {JSON.stringify(updateResponses, null, 2)}</pre>
				<pre>Event Responses: {JSON.stringify(eventResponses, null, 2)}</pre>
			</Flex>
		</Card>
	);
};

export default AnalyticsComponent;
