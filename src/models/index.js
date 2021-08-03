// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Todo, Appointment } = initSchema(schema);

export {
  Todo,
  Appointment
};