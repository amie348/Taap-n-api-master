const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const env = require('../configs');

AWS.config.update({
  accessKeyId: env.ACCESS_KEY_ID,
  secretAccessKey: env.SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

exports.uploadFile = async (pictureData) => {
  const fileCompetePath = path.join(__dirname, '../', pictureData.filePath);
  const fileStream = fs.createReadStream(fileCompetePath);
  const params = {
    Bucket: env.S3_BUCKET_NAME,
    Body: fileStream,
    Key: pictureData.filePath,
    //ACL: env.S3_BUCKET_ACL,
  };

  const result = await s3.upload(params).promise();
  fs.unlink(fileCompetePath, (err) => {
    if (err) throw err;
  });

  return result;
};

exports.deleteFile = async (Key) => {
  var params = { Bucket: env.S3_BUCKET_NAME, Key };
  return await s3.deleteObject(params).promise();
};
