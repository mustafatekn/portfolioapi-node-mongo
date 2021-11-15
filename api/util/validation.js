exports.isEmpty = (value) => {
  if (value.trim() === "") {
    return true;
  } else {
    return false;
  }
};

exports.isEmail = (email) => {
  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegexp.test(String(email).toLowerCase());
};
