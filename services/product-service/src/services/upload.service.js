const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client, bucketName } = require("../config/s3.config");
const path = require("path");
const crypto = require("crypto");

const uploadToS3 = async (file) => {
  const fileExtension = path.extname(file.originalname);
  const fileName = `${crypto.randomBytes(16).toString("hex")}${fileExtension}`;

  const params = {
    Bucket: bucketName,
    Key: `products/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // Construct the public URL
    // Note: This assumes the bucket is public or you use a CloudFront distribution
    const url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/products/${fileName}`;
    return url;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload image to S3");
  }
};

module.exports = {
  uploadToS3,
};
