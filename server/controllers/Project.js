const models = require('../models');

const { Project } = models;

const editProject = (request, response) => {
  const req = request;
  const res = response;

  const { body } = req;
  let msg = '';
  if (!body.name) {
    msg = 'Missing required param name';
    return res.status(400).json({ error: msg });
  }

  return Project.ProjectModel.findByName(body.name.short, (err, docs) => {
    if (err) {
      msg = 'An error has occured.';
      res.status.json({ error: msg });
    }
    let newProject = {};
    let callback = {};

    // Update existing
    if (docs) {
      newProject = docs;

      if (body.name.full) {
        newProject.name.full = body.name.full;
      }
      if (body.startdate) {
        newProject.startDate = body.startdate;
      }
      if (body.enddate) {
        newProject.endDate = body.enddate;
      }
      if (body.featured) {
        newProject.featured = body.featured;
      }
      if (body.languages) {
        newProject.languages = body.languages;
      }
      if (body.skills) {
        newProject.skills = body.skills;
      }
      if (body.description) {
        newProject.description = body.description;
      }

      callback = () => {
        res.status(204).send('');
      };
    } else {
      // Create new
      if (!body.startdate || !body.enddate) {
        msg = 'Missing required param startdate or enddate';
        return req.status(400).json({ error: msg });
      }

      const projectData = {
        name: body.name,
        startDate: body.startdate,
        endDate: body.enddate,
      };

      if (body.featured) {
        projectData.featured = body.featured;
      }
      if (body.languages) {
        projectData.languages = body.languages;
      }
      if (body.skills) {
        projectData.skills = body.skills;
      }
      if (body.description) {
        projectData.description = body.description;
      }
      newProject = new Project.ProjectModel(projectData);

      callback = () => {
        res.status(200).json({ message: `Project ${body.name.short} created.` });
      };
    }
    const savePromise = newProject.save();

    savePromise.then(callback);
    savePromise.catch((e) => {
      console.log(e);

      return res.status(400).json({ error: 'An error occured.' });
    });

    return savePromise;
  });
};

module.exports = {
  editProject,
};
