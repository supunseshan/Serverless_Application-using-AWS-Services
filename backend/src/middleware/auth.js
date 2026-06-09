// src/middleware/auth.js
const { CognitoJwtVerifier } = require("aws-jwt-verify");

let verifier;

const getVerifier = () => {
  if (!verifier) {
    verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      tokenUse: "id",
      clientId: process.env.COGNITO_CLIENT_ID,
    });
  }
  return verifier;
};

const getUserFromEvent = async (event) => {
  const authHeader = event.headers?.Authorization || event.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No authorization token provided");
  }

  const token = authHeader.split(" ")[1];
  const payload = await getVerifier().verify(token);

  return {
    cognitoId: payload.sub,
    email: payload.email,
    name: payload.name,
  };
};

module.exports = { getUserFromEvent };
