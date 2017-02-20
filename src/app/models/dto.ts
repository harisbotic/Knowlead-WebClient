export enum UserStatus
{
	Online = 0,
	Offline = 1,
	Busy = 2,
}
export enum PeerStatus
{
	Accepted = 0,
	Rejected = 1,
	Waiting = 2,
	Disconnected = 3,
}
export enum FriendshipDTOActions
{
	NewRequest = 0,
	AcceptRequest = 1,
	DeclineRequest = 2,
	CancelRequest = 3,
	RemoveFriend = 4,
	BlockUser = 5,
	UnblockUser = 6,
}
export enum FriendshipStatus
{
	Pending = 0,
	Accepted = 1,
	Declined = 2,
	Blocked = 3,
}
export enum P2PStatus
{
	Active = 0,
	Scheduled = 1,
	Finished = 2,
}
export interface P2PMessageModel
{
	p2pMessageId: number;
	text: string;
	dateTimeOffer: Date;
	priceOffer: number;
	timestamp: Date;
	p2pId: number;
	p2p: P2PModel;
	messageToId: Guid;
	messageTo: ApplicationUserModel;
	messageFromId: Guid;
	messageFrom: ApplicationUserModel;
	offerAcceptedId: number;
	offerAccepted: P2PMessageModel;
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
export interface ImageBlobModel extends _BlobModel
{
	width: number;
	height: number;
}
export interface FileBlobModel extends _BlobModel
{
}
export interface _CallModel
{
	callId: Guid;
	failed: boolean;
	failReason: string;
	caller: PeerInfoModel;
	startDate: Date;
	endDate: Date;
	duration: number;
	sealed: boolean;
	inviting: boolean;
	inactiveSince: Date;
	callStarted: boolean;
	peers: PeerInfoModel[];
}
export interface PeerInfoModel
{
	peerId: Guid;
	peer: ApplicationUserModel;
	connectionId: string;
	sdps: string[];
	status: PeerStatus;
}
export interface P2PCallModel extends _CallModel
{
	callReceiverId: Guid;
	p2pId: number;
	p2p: P2PModel;
}
export interface FriendCallModel extends _CallModel
{
	receiverId: Guid;
	receiver: ApplicationUserModel;
}
export interface NewChatMessage
{
	message: string;
	sendToId: Guid;
}
export interface ChangeFriendshipStatusModel
{
	applicationUserId: Guid;
	action: FriendshipDTOActions;
}
export interface FriendshipModel
{
	applicationUserBiggerId: Guid;
	applicationUserBigger: ApplicationUserModel;
	applicationUserSmallerId: Guid;
	applicationUserSmaller: ApplicationUserModel;
	status: FriendshipStatus;
	lastActionById: Guid;
	lastActionBy: ApplicationUserModel;
	updatedAt: Date;
	createdAt: Date;
}
export interface ConversationModel
{
	isMessageSender: boolean;
	lastMessage: string;
	rowKey: string;
	timestamp: Date;
}
export interface ChatMessageModel
{
	message: string;
	sendToId: Guid;
	senderId: Guid;
	rowKey: string;
	timestamp: Date;
}
export interface _FeedbackModel
{
	feedbackId: number;
	feedbackText: string;
	teacherReply: string;
	fosId: number;
	fos: FOSModel;
	teacherId: Guid;
	teacher: ApplicationUserModel;
	studentId: Guid;
	student: ApplicationUserModel;
}
export interface StickyNoteModel
{
	stickyNoteId: number;
	name: string;
	noteText: string;
	createdAt: Date;
	isDeleted: boolean;
	createdById: Guid;
	createdBy: ApplicationUserModel;
}
export interface NotebookModel
{
	notebookId: number;
	name: string;
	markdown: string;
	primaryColor: string;
	secondaryColor: string;
	createdAt: Date;
	isDeleted: boolean;
	createdById: Guid;
	createdBy: ApplicationUserModel;
}
export interface _CoreLookupModel
{
	coreLookupId: number;
	code: string;
	name: string;
}
export interface RewardModel extends _CoreLookupModel
{
	pointsReward: number;
	minutesReward: number;
}
export interface LanguageModel extends _CoreLookupModel
{
}
export interface FOSModel extends _CoreLookupModel
{
	children: FOSModel[];
	parent: FOSModel;
	parentFosId: number;
	unlocked: boolean;
}
export interface AchievementModel extends _CoreLookupModel
{
	desc: string;
	imageBlobId: Guid;
	imageBlob: ImageBlobModel;
}
export interface QuestionFeedbackModel extends _FeedbackModel
{
}
export interface P2PFeedbackModel extends _FeedbackModel
{
	expertise: number;
	helpful: number;
	p2pId: number;
	p2p: P2PModel;
}
export interface CoursFeedbackeModel extends _FeedbackModel
{
}
export interface ClassFeedbackModel extends _FeedbackModel
{
}
export interface _GeoLookupModel
{
	geoLookupId: number;
	code: string;
	name: string;
}
export interface StateModel extends _GeoLookupModel
{
	statesCountryId: number;
	statesCountry: CountryModel;
}
export interface CountryModel extends _GeoLookupModel
{
}
export interface NotificationSourceStats
{
	unread: number;
	total: number;
}
export interface NotificationModel
{
	notificationId: Guid;
	notificationType: string;
	fromApplicationUserId: Guid;
	fromApplicationUser: ApplicationUserModel;
	p2pMessageId: number;
	p2pMessage: P2PMessageModel;
	p2pId: number;
	p2p: P2PModel;
	scheduledAt: Date;
	seenAt: Date;
}
export interface P2PModel
{
	p2pId: number;
	text: string;
	initialPrice: number;
	deadline: Date;
	priceAgreed: number;
	dateTimeAgreed: Date;
	dateCreated: Date;
	bookmarkCount: number;
	offerCount: number;
	didBookmark: boolean;
	canBookmark: boolean;
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
export interface P2PBookmarkModel
{
	p2pId: number;
	p2p: P2PModel;
	applicationUserId: Guid;
	applicationUser: ApplicationUserModel;
}
export interface ResponseModel
{
	formErrors: { [index: string]: string[] };
	errors: string[];
	object: any;
}
export interface ReferralStatsModel
{
	registratedReferralsCount: number;
	unregisteredReferralsCount: number;
	rewardsClaimed: number[];
	rewardsAvailable: number[];
	unregisteredReferrals: { [index: string]: string };
}
export interface PlatformFeedbackModel
{
	feedback: string;
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
	referralUserId: Guid;
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
export interface ApplicationUserModel
{
	id: Guid;
	email: string;
	name: string;
	surname: string;
	minutesBalance: number;
	pointsBalance: number;
	birthdate: Date;
	isMale: boolean;
	timezone: string;
	aboutMe: string;
	averageRating: number;
	profilePictureId: Guid;
	profilePicture: ImageBlobModel;
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
export type Guid = string;
