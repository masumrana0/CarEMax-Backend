export type ILoginUser = {
  email: string;
  password: string;
};

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
  isEmailVerified: boolean;
};

export type IDataValidationResponse = {
  validationResponse: {
    message?: string;
  };
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type IForgetPassword = {
  email: string;
};
