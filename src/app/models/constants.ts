export class ErrorCodes
{
	static requiredField: string = "REQUIRED_FIELD";
	static databaseError: string = "DATABASE_ERROR";
	static tokenInvalid: string = "TOKEN_INVALID";
	static emailInvalid: string = "EMAIL_INVALID";
	static emailTaken: string = "EMAIL_TAKEN";
	static emailNotVerified: string = "EMAIL_NOT_VERIFIED";
	static modelEmpty: string = "MODEL_EMPTY";
	static entityNotFound: string = "ENTITY_NOT_FOUND";
	static passwordIncorrect: string = "PASSWORD_INCORRECT";
	static tooShort: string = "TOO_SHORT";
	static requiresNonAlphanumeric: string = "REQUIRES_NON_ALPHANUMERIC";
	static requiresDigit: string = "REQUIRES_DIGIT";
	static requiresUppercase: string = "REQUIRES_UPPERCASE";
	static requiresLowercase: string = "REQUIRES_LOWERCASE";
	static alreadyDeleted: string = "ALREADY_DELETED";
	static confirmationCodeIncorrect: string = "CONFIRMATION_CODE_INCORRECT";
	static notLoggedIn: string = "NOT_LOGGED_IN";
	static loginCredentialsIncorrect: string = "LOGIN_CREDENTIALS_INCORRECT";
	static incorrectValue: string = "INCORRECT_VALUE";
	static ownershipError: string = "OWNERSHIP_ERROR";
	static authorityError: string = "AUTHORITY_ERROR";
	static hackAttempt: string = "HACK_ATTEMPT";
	static ageTooYoung: string = "AGE_TOO_YOUNG";
	static ageTooOld: string = "AGE_TOO_OLD";
	static discussionClosed: string = "DISCUSSION_CLOSED";
	static alreadyScheduled: string = "ALREADY_SCHEDULED";
	static dateInPast: string = "DATE_IN_PAST";
}
