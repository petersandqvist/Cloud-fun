const express = require('express');
const app = express();
app.enable('trust proxy');
const { Datastore } = require('@google-cloud/datastore');
const datastore = new Datastore();

const getCostumers = () => {
  const query = datastore
    .createQuery('costumer')
    .order('firstName', { descending: true })
    .limit(10);

  return datastore.runQuery(query);
};

app.get('/getCostumers', async (req, res, next) => {
  try {
    const [entities] = await getCostumers();
    res.json(entities);
  } catch (error) {
    next(error);
  }
});

app.get('/getCostumer', async (req, res, next) => {
  //get all costumers id
  if (req.query.id === '' || req.query.id == 'all') {
    try {
      const [entities] = await getCostumers();
      const entityKeys = entities.map(entity => entity[datastore.KEY].id);
      res.json({ id: entityKeys });
    } catch (error) {
      next(error);
    }
  }
  //get costumer by id
  else {
    try {
      const [entities] = await getCostumers();
      const entity = entities.filter(
        entity => entity[datastore.KEY].id == req.query.id
      );
      res.json(entity);
    } catch (error) {
      next(error);
    }
  }
});

const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
