/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("../auth/index").Auth;
  type DatabaseUserAttributes = {
    name: string;
    picture: string;
    email?: string | null;
    access_token: string;
    refresh_token?: string | null;
    token_expires_in?: number;
  };
  type DatabaseSessionAttributes = {};
}
