import { ErrorModel } from "./error.model";

export class LoginResponse {
    token_type: string;
    access_token: string;
    expires_in: number;
    error: string;
    error_description: string;
    asErrorModel():ErrorModel {
      if (this.error_description != null && this.error_description != "") {
        // TODO: Translate this.error to number
        return new ErrorModel(this.error_description);
      } else return null;
    }
}
