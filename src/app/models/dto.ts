export interface P2PMessageModel
{
	p2pMessageId: number;
	text: string;
	timestamp: Date;
	p2pId: number;
	p2p: P2PModel;
	messageToId: Guid;
	messageTo: ApplicationUserModel;
	messageFromId: Guid;
	messageFrom: ApplicationUserModel;
}
export interface ImageBlobModel extends _BlobModel
{
	width: number;
	height: number;
}
export interface FileBlobModel extends _BlobModel
{
}
export interface _BlobModel
{
	blobId: Guid;
	blobType: string;
	filename: string;
	extension: string;
	filesize: number;
	uploadedById: Guid;
	uploadedBy: ApplicationUserModel;
}
export enum PeerStatus
{
	Accepted = 0,
	Rejected = 1,
	Waiting = 2,
}
export interface PeerInfoModel
{
	peerId: Guid;
	peer: ApplicationUserModel;
	connectionId: string;
	sDP: string;
	status: PeerStatus;
}
export interface P2PCallModel extends _CallModel
{
	p2pId: number;
	p2p: P2PModel;
}
export interface FriendCallModel extends _CallModel
{
	receiverId: Guid;
	receiver: ApplicationUserModel;
}
export interface _CallModel
{
	callId: Guid;
	failed: boolean;
	failReason: string;
	callerId: Guid;
	caller: ApplicationUserModel;
	duration: number;
	endDate: Date;
	callStarted: boolean;
	peers: PeerInfoModel[];
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
	children: FOSModel[];
	parent: FOSModel;
	parentFosId: number;
}
export interface AchievementModel extends _CoreLookupModel
{
	desc: string;
	imageBlobId: Guid;
	imageBlob: ImageBlobModel;
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
	Active = 1,
	Scheduled = 2,
	Finsihed = 3,
}
export interface P2PModel
{
	p2pId: number;
	title: string;
	text: string;
	chargePerMinute: number;
	deadline: Date;
	scheduledAt: Date;
	isDeleted: boolean;
	scheduledWithId: Guid;
	scheduledWith: ApplicationUserModel;
	createdById: Guid;
	createdBy: ApplicationUserModel;
	languages: LanguageModel[];
	blobs: _BlobModel[];
	p2pMessageModels: P2PMessageModel[];
	fosId: number;
	fos: FOSModel;
	status: P2PStatus;
}
export interface P2PLanguageModel
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
	imageBlobId: Guid;
	imageBlob: ImageBlobModel;
}
export interface P2PFileModel
{
	p2pId: number;
	p2p: P2PModel;
	fileBlobId: Guid;
	fileBlob: FileBlobModel;
}
export interface P2PScheduleModel
{
	p2pId: number;
	scheduleTime: Date;
	scheduleWithId: Guid;
}
export interface ResponseModel
{
	formErrors: { [index: string]: string[] };
	errors: string[];
	object: any;
}
export enum UserRelationshipStatus
{
	Pending = 0,
	Accepted = 1,
	Declined = 2,
	Blocked = 3,
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
	imageBlobId: Guid;
	imageBlob: ImageBlobModel;
}
export interface UserCertificateModel
{
	userCertificateId: number;
	name: string;
	desc: string;
	createdAt: Date;
	applicationUserId: Guid;
	applicationUser: ApplicationUserModel;
	imageBlobId: Guid;
	imageBlob: ImageBlobModel;
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
export interface InterestModel
{
	fosId: number;
	fos: FOSModel;
	stars: number;
}
export interface ApplicationUserRelationshipModel
{
	applicationUserSmallerId: Guid;
	applicationUserSmaller: ApplicationUserModel;
	applicationUserBiggerId: Guid;
	applicationUserBigger: ApplicationUserModel;
	status: UserRelationshipStatus;
	lastActionById: Guid;
	lastActionBy: ApplicationUserModel;
	updatedAt: Date;
	createdAt: Date;
}
export interface ApplicationUserModel
{
	id: Guid;
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
	interests: InterestModel[];
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
	stars: number;
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
