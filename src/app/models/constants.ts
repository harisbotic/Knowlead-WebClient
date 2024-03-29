export enum ListP2PsRequest
{
	My = 0,
	Scheduled = 1,
	Bookmarked = 2,
	ActionRequired = 3,
	Deleted = 4,
	Recommended = 5,
}
export class CallEndReasons
{
	static requested: string = "CALL_END_REQUESTED";
	static inactive: string = "CALL_INACTIVE";
	static rejected: string = "CALL_REJECTED";
	static startProblem: string = "CALL_START_PROBLEM";
}
export class NotificationTypes
{
	static newP2PComment: string = "NotificationTypes.NEW_P2P_COMMENT";
	static p2PExpired: string = "NotificationTypes.P2P_EXPIRED";
	static p2POfferAccepted: string = "NotificationTypes.P2P_OFFER_ACCEPTED";
	static prepareForP2P: string = "NotificationTypes.PREPARE_FOR_P2P";
	static rewardClaimed: string = "NotificationTypes.REWARD_CLAIMED";
	static newFriendship: string = "NotificationTypes.NEW_FRIENDSHIP";
	static leaveP2PFeedback: string = "NotificationTypes.LEAVE_P2P_FEEDBACK";
	static p2PScheduled: string = "NotificationTypes.P2P_SCHEDULED";
}
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
	static sthWentWrong: string = "STH_WENT_WRONG";
	static incorrectValue: string = "INCORRECT_VALUE";
	static ownershipError: string = "OWNERSHIP_ERROR";
	static authorityError: string = "AUTHORITY_ERROR";
	static hackAttempt: string = "HACK_ATTEMPT";
	static ageTooYoung: string = "AGE_TOO_YOUNG";
	static ageTooOld: string = "AGE_TOO_OLD";
	static discussionClosed: string = "DISCUSSION_CLOSED";
	static alreadyScheduled: string = "ALREADY_SCHEDULED";
	static dateInPast: string = "DATE_IN_PAST";
	static userBlocked: string = "USER_BLOCKED";
	static alreadyFriends: string = "ALREADY_FRIENDS";
	static requestNotFound: string = "REQUEST_NOT_FOUND";
	static notInFriendlist: string = "NOT_IN_FRIENDLIST";
	static claimRewardError: string = "CLAIM_REWARD_ERROR";
	static alreadyGotReward: string = "ALREADY_GOT_REWARD";
	static notEnoughMinutes: string = "NOT_ENOUGH_MINUTES";
	static consecutiveOffersLimit: string = "CONSECUTIVE_OFFERS_LIMIT";
	static notLastOffer: string = "NOT_LAST_OFFER";
	static alreadyInCall: string = "ALREADY_IN_CALL";
	static feedbackAlreadyGiven: string = "FEEDBACK_ALREADY_GIVEN";
	static alreadyBookmarked: string = "ALREADY_BOOKMARKED";
	static wasntBookmarked: string = "WASNT_BOOKMARKED";
	static p2PFinished: string = "P2P_FINISHED";
	static p2PNotFinished: string = "P2P_NOT_FINISHED";
	static cantDeleteScheduledP2P: string = "CANT_DELETE_SCHEDULED_P2P";
	static alreadyReady: string = "ALREADY_READY";
	static cantBeReadyNow: string = "CANT_BE_READY_NOW";
	static promoCodeInvalid: string = "PROMOCODE_INVALID";
	static promoCodeAlreadyUsed: string = "PROMOCODE_ALREADY_USED";
	static promoCodeExpired: string = "PROMOCODE_EXPIRED";
}
