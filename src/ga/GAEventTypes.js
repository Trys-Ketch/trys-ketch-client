const Category = {
  auth: 'Auth',
  userProfile: 'User Profile',
  room: 'Room',
  host: 'Host',
  game: 'Game',
  picture: 'Picture',
  paintTool: 'PaintTool',
  mypage: 'Mypage',
  setting: 'Setting',
};

const Action = {
  auth: {
    login: 'Login', // login api submit // 완료
    logout: 'Logout',
  },
  userProfile: {
    refreshImage: 'Refresh Image', // 완료
    refreshNickname: 'Refresh Nickname', // 완료
    profileEdit: 'Profile Edit',
  },
  room: {
    enterRoom: 'Enter Room', // enter room api submit // 완료
    inviteCodeEnter: 'Enter Room with Invite Code', // enter room api with invite code // 완료
    copyInviteCode: 'Copy Invite Code', // invite code copy button click // 완료
    createRoom: 'Create Room', // create room api submit // 완료
    submitChat: 'Sumbit Chat Message', // submit chat message // 완료
  },
  host: {
    forcedExit: 'Forced Exit Attendee', // forced exit attendee // 완료
    delegateHost: 'Delegate Host', // delegate host
  },
  game: {
    startGame: 'Start Game', // 완료
    submitPicture: 'Submit Picture', // 완료
    submitWord: 'Submit Word', // 완료
    backToRoom: 'Back to Room', // 완료
  },
  paintTool: {
    pencil: 'Pencil', // 완료
    erase: 'Erase', // 완료
    paint: 'Paint', // 완료
    Thickness: 'Thickness', // 완료
    undo: 'Undo', // 완료
    redo: 'Redo', // 완료
    color: 'Color', // 완료
  },
  picture: {
    likePicture: 'Like Picture',
    savePicture: 'Save Picture',
  },
  mypage: {
    goToMypage: 'Go To Mypage', // 완료
    showBadges: 'Show Badges',
    selectBadges: 'Select Badges',
    watchLikedPicture: 'Watch Liked Picture', // watch liked picture in mypage
  },
  setting: {
    Settings: 'Set options', // on setting modal // 완료
    modulateBGM: 'Modulate BGM',
    muteMic: 'Mute Mic',
  },
};

const Label = {
  kakao: 'kakao',
  naver: 'naver',
  google: 'google',
  guest: 'guest',
};

const GAEventTypes = {
  Category,
  Action,
  Label,
};

export default GAEventTypes;
