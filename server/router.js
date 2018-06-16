const controllers = require('./controllers');

const router = (app) => {
  app.post('/project', controllers.Project.editProject);
  app.delete('/project', controllers.Project.deleteProject);
};

module.exports = router;
