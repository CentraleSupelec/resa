const visualFeedback = (validator, term) => (validator(term) ? 'is-valid' : 'is-invalid');

export default visualFeedback;
