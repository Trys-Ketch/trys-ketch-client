const Category = {
  auth: 'Auth',
  userProfile: 'User Profile',
  room: 'Room',
  host: 'Host',
  game: 'Game',
  picture: 'Picture',
  paintTool: 'PaintTool',
  badge: 'Badge',
  setting: 'Setting',
};

const Action = {
  auth: {
    login: 'Login', // login api submit
    logout: 'Logout',
  },
  userProfile: {
    refreshImage: 'Refresh Image',
    refreshNickname: 'Refresh Nickname',
    profileEdit: 'Profile Edit',
  },
  room: {
    enterRoom: 'Enter Room', // enter room api submit
    inviteCodeEnter: 'Enter Room with Invite Code', // enter room api with invite code
    copyInviteCode: 'Copy Invite Code', // invite code copy button click
    createRoom: 'Create Room', // create room api submit
    submitChat: 'Sumbit Chat Message', // submit chat message
  },
  host: {
    forcedExit: 'Forced Exit Attendee', // forced exit attendee
    delegateHost: 'Delegate Host', // delegate host
  },
  game: {
    startGame: 'Start Game',
    submitPicture: 'Submit Picture',
    submitWord: 'Submit Word',
    backToRoom: 'Back to Room',
  },
  paintTool: {
    pencil: 'Pencil',
    erase: 'Erase',
    paint: 'Paint',
    Thickness: 'Thickness',
    undo: 'Undo',
    redo: 'Redo',
    color: 'Color',
  },
  picture: {
    likePicture: 'Like Picture',
    savePicture: 'Save Picture',
    watchLikedPicture: 'Watch Liked Picture', // watch liked picture in mypage
  },
  badge: {
    showBadges: 'Show Badges',
    selectBadges: 'Select Badges',
  },
  setting: {
    Settings: 'Set options', // on setting modal
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
