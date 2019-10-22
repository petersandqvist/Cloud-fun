const express = require('express');
const app = express();
app.enable('trust proxy');
const { Datastore } = require('@google-cloud/datastore');
const datastore = new Datastore();

const getCustomers = () => {
  const query = datastore
    .createQuery('Customer')
    .order('Firstname', { descending: true })
    .limit(10);

  return datastore.runQuery(query);
};

app.get('/getCustomers', async (req, res, next) => {
  try {
    const [entities] = await getCustomers();
    res.json(entities);
  } catch (error) {
    next(error);
  }
});

app.get('/getCustomer', async (req, res, next) => {
  //get all costumers id
  if (req.query.id === '' || req.query.id == 'all') {
    try {
      const [entities] = await getCustomers();
      const entityKeys = entities.map(entity => entity[datastore.KEY].id);
      res.json({ id: entityKeys });
    } catch (error) {
      next(error);
    }
  }
  //get costumer by id
  else {
    try {
      const [entities] = await getCustomers();
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
