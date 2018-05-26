const controllers = require('./controllers');

const router = (app) => {
  app.post('/project', controllers.Project.editProject);
};

module.exports = router;
