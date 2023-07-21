const Joi = require("joi");

function input(schema, data) {
  const { error } = schema.validate(data);
  if (error) throw new Error(error);
}

function assert(schema, data) {
  const { error } = schema.validate(data, {
    abortEarly: false,
  });
  if (error) throw error;
}

const template = {
  optionalText: Joi.string(),
  text: Joi.string().required(),
  provider: Joi.string().optional().allow("", null),
  validText: (valid) =>
    Joi.string()
      .valid(...valid)
      .required(),
  email: Joi.string().email().required(),
  possibleText: Joi.string(),
  texts: Joi.array().items(Joi.string().required()).required(),
  date: Joi.string().isoDate().required(),
  number: Joi.number().integer().positive().required(),
  ids: Joi.array().items(Joi.number()),
  emails: Joi.array().items(Joi.string().email()),
  domains: Joi.array().items(Joi.string().domain()),
};

const schema = {
  addEvent: Joi.object({
    eventName: template.text,
    startDate: template.date,
    endDate: template.date,
    roomId: template.number,
    videoProvider: template.provider,
  }),
  modifyEvent: Joi.object({
    eventId: template.number,
    newEventName: template.text,
    newStartDate: template.date,
    newEndDate: template.date,
    newRoomId: template.number,
  }),
  cancelEvent: Joi.object({
    eventId: template.number,
  }),
  admin: Joi.object({
    email: template.email,
    permissions: template.texts,
  }),
  dysfunction: Joi.object({
    emailDelegate: template.email,
    name: template.text,
    icon: template.text,
    actionCode: template.possibleText,
  }),
  reportDysfunction: Joi.object({
    roomId: template.number,
    email: template.email,
    comment: template.text,
    dysfunctions: template.texts,
  }),
  reorderDysfunction: Joi.object({
    order: template.texts,
  }),
  member: Joi.object({
    userEmail: template.email,
    role: template.validText(["member", "manager", "main-manager"]),
    jwtToken: template.text,
  }),
  addGreylist: Joi.object({
    name: template.text,
    roomIds: template.ids,
    managerEmails: template.emails,
    userEmails: template.emails,
    domains: template.domains,
  }),
  modifyGreylist: Joi.object({
    name: template.optionalText,
    roomIds: template.ids,
    managerEmails: template.emails,
    userEmails: template.emails,
    domains: template.domains,
  }),
  modifyWhitelist: Joi.object({
    domains: template.domains,
  }),
};

module.exports = { assert, input, schema };
