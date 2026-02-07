export const registerUserValidation = {
  name: {
    isString: true,
    notEmpty: true,
  },
  email: {
    isEmail: true,
  },
  password: {
    isLength: {
      options: { min: 6 },
    },
  },
}

export const loginUserValidation = {
  email: {
    isEmail: true,
  },
  password: {
    notEmpty: true,
  },
}
