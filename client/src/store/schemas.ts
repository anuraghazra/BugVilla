import { schema } from 'normalizr';

const reactionSchema = new schema.Entity('reactions', {});
const commentSchema = new schema.Entity('comments');

const bugSchema = new schema.Object({
  comments: new schema.Array(commentSchema),
});
export { commentSchema, bugSchema, reactionSchema };
