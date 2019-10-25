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

const getCustomerByID = customerID => {
  const customer = parseInt(customerID);
  const query = datastore
    .createQuery('Customer')
    .filter('CustomerID', '=', customer);

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
  const customer = req.query.id;

  if (customer === '') {
    try {
      const [entities] = await getCustomers();
      const entityKeys = entities.map(entity => entity.CustomerID);
      res.json({ id: entityKeys });
    } catch (error) {
      next(error);
    }
  }
  //get costumer by id
  else {
    try {
      const [entities] = await getCustomerByID(customer);
      res.json(entities[0]);
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
