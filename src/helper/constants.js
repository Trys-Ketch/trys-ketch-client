export const CHAT_MSG = {
  ENTER: 'ENTER',
  LEAVE: 'LEAVE',
  CHAT: 'CHAT',
};

export const TIMER_CONST = {
  CIRCLE_RADIUS: 40,
  CENTER: 40,
  STROKE_WIDTH: 3,
};

export const LOGIN_URL = {
  KAKAO_LOGIN_URL: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}/login/kakao&response_type=code`,
  NAVER_LOGIN_URL: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.REACT_APP_NAVER_CLIENT_ID}&state=${process.env.REACT_APP_NAVER_STATE}&redirect_uri=${process.env.REACT_APP_BASE_URL}/login/naver`,
  GOOGLE_LOGIN_URL: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_BASE_URL}/login/google&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email`,
};

export const NOTACHIEVE = {
  visit: ['TSK_V_B_NN', 'TSK_V_S_NN', 'TSK_V_G_NN'],
  trial: ['TSK_T_B_NN', 'TSK_T_S_NN', 'TSK_T_G_NN'],
  playtime: ['TSK_P_B_NN', 'TSK_P_S_NN', 'TSK_P_G_NN'],
};

export const PAINT_OPTION = {
  thickness: [2, 3, 4, 6, 8, 10],
  opacity: ['1A', '33', '4D', '66', '80', '99', 'B3', 'CC', 'E6', 'FF'], // hex코드용 opacity
  color: [
    '#8B4513',
    '#CD0000',
    '#FF1493',
    '#006400',
    '#2E8B57',
    '#FFB400',
    '#fbceb1',
    '#FF8200',
    '#D2691E',
    '#9932CC',
    '#0000FF',
    '#00008C',
    '#ffffff',
    '#000000',
  ],
};

export const GAME_STATE = {
  KEYWORD: 'keyword',
  DRAWING: 'drawing',
  GUESSING: 'guessing',
};

export const EVENT_STATE = {
  DRAWING: 'drawing',
  ERASEING: 'eraseing',
  FILL: 'fill',
};

export const RTC_SOCKET_MSG = {
  CANDIDATE: 'rtc/candidate',
  ALL_USERS: 'rtc/all_users',
  OFFER: 'rtc/offer',
  ANSWER: 'rtc/answer',
  EXIT: 'rtc/user_exit',
};

export const MEDIA_STATE = {
  FULFILLED: 'fulfilled',
  PENDING: 'pending',
  REJECTED: 'rejected',
};

export const TIME_LIMIT = {
  INIT_LIMIT: 60 * 1000, // 1분
  MAX_LIMIT: 2.5 * 60 * 1000, // 2분 30초
  MIN_LIMIT: 60 * 1000, // 1분
  STEP: 30 * 1000, // 30초
};

export const SOCKET_MSG = {
  JOIN: 'ingame/join_room',
  KICK: 'ingame/kick',
  READY: 'ingame/toggle_ready',
  ATTENDEE: 'ingame/attendee',
  BE_KICKED: 'ingame/be_kicked',
  END_GAME: 'ingame/end_game',
};

export const SOCKET_PUB_DEST = {
  DIFFICULTY: '/app/game/difficulty',
  INCREASE_TIME: '/app/game/increase-time',
  DECREASE_TIME: '/app/game/decrease-time',
  START_GAME: '/app/game/start',
  SET_GAME: '/app/game/gameroom-data',
  INIT_GAME: '/app/game/ingame-data',
  SUBMIT_IMAGE: '/app/game/submit-image',
  SUBMIT_WORD: '/app/game/submit-word',
  READY: '/app/game/toggle-ready',
  RESULT: '/app/game/result',
  END_GAME: '/app/game/end',
  NEXT_RESULT_PAGE: '/app/game/next-keyword-index',
  PREV_RESULT_PAGE: '/app/game/prev-keyword-index',
};

export const SOCKET_SUB_DEST = {
  CHAT: '/topic/chat/room',
  START_GAME: '/topic/game/start',
  DIFFICULTY: '/topic/game/difficulty',
  TIME_LIMIT: '/topic/game/time-limit',
  SET_GAME: '/queue/game/gameroom-data',
  END_GAME: '/topic/game/end',
  SHUTDOWN: '/topic/game/shutdown',
  RESULT: '/queue/game/result',
  NEXT_RESULT_PAGE: '/topic/game/next-keyword-index',
  PREV_RESULT_PAGE: '/topic/game/prev-keyword-index',
  RANDOM_KEYWORD: '/queue/game/ingame-data',
  SUBMIT_WORD: '/topic/game/submit-word',
  SUBMIT_IMAGE: '/topic/game/submit-image',
  BEFORE_KEYWORD: '/queue/game/before-word',
  BEFORE_IMAGE: '/queue/game/before-image',
  BEFORE_RESULT: '/topic/game/before-result',
  IS_SUBMITTED: '/queue/game/is-submitted',
  SUBMIT_COUNT: '/topic/game/true-count',
  ACHIEVE: '/queue/game/achievement',
};
