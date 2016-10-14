export interface UploadedFileModel
{
	filename: Guid;
	filesize: number;
	uploadedById: Guid;
	uploadedBy: ApplicationUserModel;
}
export interface ImageModel
{
	filename: Guid;
	width: number;
	height: number;
	uploadedById: Guid;
	uploadedBy: ApplicationUserModel;
}
export interface _FeedbackModel
{
	feedbackText: string;
	fosId: number;
	fos: FOSModel;
	teacherId: Guid;
	teacher: ApplicationUserModel;
	studentId: Guid;
	student: ApplicationUserModel;
}
export interface FriendshipRequestModel
{
	userSentId: Guid;
	userSent: ApplicationUserModel;
	userReceivedId: Guid;
	userReceived: ApplicationUserModel;
}
export interface FriendshipModel
{
	userSentId: Guid;
	userSent: ApplicationUserModel;
	userAcceptedId: Guid;
	userAccepted: ApplicationUserModel;
}
export interface LanguageModel extends _CoreLookupModel
{
}
export interface FOSModel extends _CoreLookupModel
{
	fosDesc: string;
	parentFos: FOSModel;
	parentFosId: number;
}
export interface AchievementModel extends _CoreLookupModel
{
	desc: string;
	imageId: Guid;
	image: ImageModel;
}
export interface _CoreLookupModel
{
	coreLookupId: number;
	code: string;
	name: string;
}
export interface FeedbackQuestionModel extends _FeedbackModel
{
}
export interface FeedbackP2PModel extends _FeedbackModel
{
	knowleadge: number;
	accurate: number;
}
export interface FeedbackCourseModel extends _FeedbackModel
{
}
export interface FeedbackClassModel extends _FeedbackModel
{
}
export interface StateModel extends _GeoLookupModel
{
	statesCountryId: number;
	statesCountry: CountryModel;
}
export interface CountryModel extends _GeoLookupModel
{
}
export interface _GeoLookupModel
{
	geoLookupId: number;
	code: string;
	name: string;
}
export enum P2PStatus
{
	Inactive = 0,
	PendingAction = 1,
	Scheduled = 2,
	Finsihed = 3,
}
export interface P2PModel
{
	rate: number;
	startingAt: Date;
	status: P2PStatus;
}
export interface P2PLangugageModel
{
	p2pId: number;
	p2p: P2PModel;
	languageId: number;
	language: LanguageModel;
}
export interface P2PImageModel
{
	p2pId: number;
	p2p: P2PModel;
	imageId: Guid;
	image: ImageModel;
}
export interface P2PFileModel
{
	p2pId: number;
	p2p: P2PModel;
	uploadedFileId: number;
	uploadedFile: UploadedFileModel;
}
export interface P2PDiscussionModel
{
	text: string;
	responseToId: number;
	responseTo: P2PDiscussionModel;
	p2pId: number;
	p2p: P2PModel;
}
export interface ResponseModel
{
	formErrors: { [index: string]: string[] };
	errors: string[];
	object: any;
}
export enum UserStatus
{
	Online = 0,
	Offline = 1,
	Busy = 2,
}
export interface UserNotebookModel
{
	userNotebookId: number;
	name: string;
	markdown: string;
	createdAt: Date;
	applicationUserId: Guid;
	applicationUser: ApplicationUserModel;
	imageId: Guid;
	image: ImageModel;
}
export interface UserCertificateModel
{
	userCertificateId: number;
	name: string;
	desc: string;
	createdAt: Date;
	applicationUserId: Guid;
	applicationUser: ApplicationUserModel;
	imageId: Guid;
	image: ImageModel;
}
export interface UserAchievementModel
{
	userAchievementId: number;
	createdAt: Date;
	applicationUserId: Guid;
	applicationUser: ApplicationUserModel;
	achievementId: number;
	achievement: AchievementModel;
}
export interface ApplicationUserSkillModel
{
	applicationUserId: Guid;
	applicationUser: ApplicationUserModel;
	fosId: number;
	fos: FOSModel;
}
export interface ApplicationUserModel
{
	email: string;
	name: string;
	surname: string;
	birthdate: Date;
	isMale: boolean;
	timezone: string;
	aboutMe: string;
	countryId: number;
	country: CountryModel;
	stateId: number;
	state: StateModel;
	motherTongueId: number;
	motherTongue: LanguageModel;
	languages: LanguageModel[];
	status: UserStatus;
}
export interface ApplicationUserLanguageModel
{
	applicationUserId: Guid;
	applicationUser: ApplicationUserModel;
	languageId: number;
	language: LanguageModel;
}
export interface ApplicationUserInterestModel
{
	applicationUserId: Guid;
	applicationUser: ApplicationUserModel;
	fosId: number;
	fos: FOSModel;
}
export interface ConfirmEmailModel
{
	email: string;
	code: string;
	password: string;
}
export interface RegisterUserModel
{
	email: string;
	password: string;
}
export type Guid = string;
