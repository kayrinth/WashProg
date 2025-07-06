const errorName = {
  BAD_REQUEST: "BAD_REQUEST",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  CONFLICT: "CONFLICT",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
};

const errorMsg = {
  USER_NOT_FOUND: "User Not Found",
  ORDER_NOT_FOUND: "Order Not Found",
  WRONG_CREDENTIALS: "Wrong Email or Password",
  NOT_VERIFIED: "User Not Verified",
  USER_ALREADY_EXISTS: "User Already Exists",
  TITLE_ALREADY_EXISTS: "Title Already Exists",
  INVALID_CREDENTIALS: "Invalid phone number or Password",
  VERIFICATION_LINK_EXPIRED: "Verification Link invalid Or Expired",
};

module.exports = { errorName, errorMsg };
