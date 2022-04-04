const mongoose = require('mongoose');

const removedContentSchema = mongoose.Schema({
  content: {
    type: mongoose.Mixed,
  },
});

const RemovedContentModal = mongoose.model('RemovedContent', removedContentSchema);
module.exports = RemovedContentModal;