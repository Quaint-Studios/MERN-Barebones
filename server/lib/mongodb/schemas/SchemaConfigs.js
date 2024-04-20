let mongoose = require('mongoose');

export function findOneOrCreate(schema, options) {
  schema.static('findOneOrCreate', async function fn(condition, doc) {
    const one = await this.findOne(condition);

    return one || this.create(doc);
  });
}
mongoose.plugin(findOneOrCreate);
