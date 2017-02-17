export const API = 'https://knowlead.co:8080';
export const FRONTEND = 'https://knowlead.co';
export const LOGIN = API + '/connect/token';
export const REGISTER = API + '/api/account/register';
export const CONFIRMEMAIL = API + '/api/account/confirmEmail';
export const USER = API + '/api/account';
export const ME = API + '/api/account/me';
export const USER_DETAILS = API + '/api/account/details';
export const CHANGE_PROFILE_PICTURE = API + '/api/account/changeProfilePicture';
export const REMOVE_PROFILE_PICTURE = API + '/api/account/removeProfilePicture';

export const LANGUAGES = API + '/api/lookup/languages';
export const COUNTRIES = API + '/api/lookup/countries';
export const STATES = API + '/api/lookup/states';
export const FOSES = API + '/api/lookup/foses';
export const REWARDS = API + '/api/lookup/rewards';

export const P2P_NEW = API + '/api/p2p/create';
export const P2P_ALL = API + '/api/p2p/list';
export const P2P_MESSAGE = API + '/api/p2p/message';
export const P2P_MESSAGES = API + '/api/p2p/messages';
export const P2P = API + '/api/p2p';
export const P2P_DELETE = API + '/api/p2p/delete';
export const P2P_SCHEDULE = API + '/api/p2p/schedule';

export const FILE_UPLOAD = API + '/api/blob/upload';
export const FILE_REMOVE = API + '/api/blob/delete';

export const GET_FRIENDS = API + '/api/chat/getallfriends';
export const CHANGE_FRIENDSHIP = API + '/api/chat/changefriendshipstatus';

export const FEEDBACK = API + '/api/statistics/feedback';

export const NOTEBOOK = API + '/api/notebook';

export const NOTIFICATIONS = API + '/api/notification';
export const NOTIFICATION_STATS = API + '/api/notification/stats';
export const NOTIFICATIONS_MARK_AS_READ = API + '/api/notification/markAsRead';

export const REFERRALS = API + '/api/store/referralStats';