const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const _ = require('underscore');

let ProjectModel = {};

const sanitizeString = str => _.escape(str).trim();
const sanitizeArray = array => array.map(sanitizeString);

const NameSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true,
    trim: true,
    set: sanitizeString,
    match: /^[A-Za-z0-9 .,]{1,32}$/,
  },
  short: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    set: sanitizeString,
    match: /^[A-Za-z]{1,16}$/,
  },
});

const DateSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    trim: true,
    set: sanitizeString,
    enum: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  year: {
    type: Number,
    required: true,
    min: 2014,
  },
});

const ImageSchema = new mongoose.Schema({
  big: {
    type: String,
    required: true,
    trim: true,
    set: sanitizeString,
    match: /^[A-Za-z._-]{1,64}$/,
  },
  small: {
    type: String,
    required: true,
    trim: true,
    set: sanitizeString,
    match: /^[A-Za-z._-]{1,64}$/,
  },
});

const LinkSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    set: sanitizeString,
    match: /^[A-Za-z ]{1,16}$/,
  },
  url: {
    type: String,
    required: true,
    trim: true,
    set: sanitizeString,
    match: /^https?:\/\/[A-Za-z0-9_.~!*'();:@&=+$,/?#[\]-]{1,64}$/,
  },
});

const ProjectSchema = new mongoose.Schema({
  name: {
    type: NameSchema,
    required: true,
  },
  featured: {
    type: Boolean,
    default: () => false,
  },
  startDate: {
    type: DateSchema,
    required: true,
  },
  endDate: {
    type: DateSchema,
    required: true,
  },
  images: {
    type: ImageSchema,
    required: true,
  },
  languages: {
    type: [String],
    trim: true,
    set: sanitizeArray,
    match: /^.{1,16}$/,
  },
  skills: {
    type: [String],
    trim: true,
    set: sanitizeArray,
    match: /^.{1,16}$/,
  },
  teammates: {
    type: [String],
    trim: true,
    set: sanitizeArray,
    match: /^[A-Za-z ]{1,16}$/,
  },
  links: {
    type: [LinkSchema],
  },
  programmingWork: {
    type: [String],
    trim: true,
    set: sanitizeArray,
    match: /^[A-Za-z ]{1,128}$/,
  },
  description: {
    type: [String],
    trim: true,
    set: sanitizeArray,
    minlength: 1,
    maxlength: 2048,
  },
});

ProjectSchema.statics.findProjects = (featured, filters, callback) => {
  const select = 'name startDate endDate languages skills teammates';

  const searchArr = [];
  if (featured) {
    searchArr.push({ featured: true });
  }

  if (filters) {
    const filtEntries = Object.entries(filters);
    for (let i = 0; i < filtEntries.length; i++) {
      const entry = filtEntries[i];
      const filtSearch = {};
      filtSearch[entry[0]] = { $in: entry[1] };
      searchArr.push(filtSearch);
    }
  }

  const search = (searchArr.length > 0) ? { $and: searchArr } : {};

  return ProjectModel.find(search).select(select).exec(callback);
};

ProjectSchema.statics.findByName = (name, callback) => {
  const search = { 'name.short': name };

  return ProjectModel.findOne(search).exec(callback);
};

ProjectSchema.statics.getFilterValues = (success, error) => {
  const getPromise = mongoose.Promise.all([
    ProjectModel.distinct('languages'),
    ProjectModel.distinct('skills'),
  ]);
  getPromise.then(success);
  getPromise.catch(error);
};

ProjectModel = mongoose.model('Project', ProjectSchema);

module.exports = {
  ProjectModel,
  ProjectSchema,
};
