import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import * as SockJS from 'sockjs-client';
import Audio from './Audio';
import { closeSocket, setID, setSocket } from '../../app/slices/socketSlice';

let pcs: any;
let localStream: MediaStream;
let token: string;

function AudioCall() {
  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'guest']);
  const dispatch = useDispatch();
  /**
   * socket을 관리하는 ref입니다.
   */
  const socketRef = useRef<WebSocket>();

  /**
   * local의 audio에 접근하는 ref입니다.
   * */
  const audioRef = useRef<HTMLAudioElement>(null);

  /**
   * 현재 방에 존재하는 user의 정보를 담은 state입니다.
   * user가 추가되거나 삭제될 때 마다 리렌더링을 해야하므로 useState를 사용했습니다.
   */
  const [users, setUsers] = useState<Array<any>>([]);
  const { id } = useParams();

  /**
   *
   * @param {string} socketID PeerConnection을 만들 상대방의 socketID 입니다.
   * @param {WebSocket} socket local Websocket 입니다.
   * @param {MediaStream} peerConnectionLocalStream local MediaStream 객체입니다.
   * @returns {RTCPeerConnection} 생성된 RTCPeerConnection 객체입니다.
   */

  const createPeerConnection = (
    socketID: string,
    socket: any,
    peerConnectionLocalStream: MediaStream,
  ): RTCPeerConnection => {
    // create peer
    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    });

    // add pc to peerConnections object
    pcs = { ...pcs, [socketID]: pc };

    /**
     * icecandidate 이벤트가 발생했을 때의 이벤트 핸들러입니다.
     * @param {event} e icecandidate 이벤트가 발생했을 때의 이벤트 객체입니다.
     */
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log('onicecandidate');
        socket.send(
          JSON.stringify({
            token,
            type: 'rtc/candidate',
            candidate: e.candidate,
            receiver: socketID,
          }),
        );
      }
    };

    /**
     * iceconnectionstatechange 이벤트가 발생했을 때의 이벤트 핸들러입니다.
     * @param {event} e connection state가 변경됐을 때의 이벤트 객체입니다.
     */
    pc.oniceconnectionstatechange = (e) => {
      // console.log(e);
    };

    /**
     * track이 등록됨을 알려주는 이벤트 track의 이벤트 핸들러입니다.
     * @param e track이 등록됨을 알려주는 이벤트 track이벤트 객체 입니다.
     */
    pc.ontrack = (e) => {
      console.log('ontrack success');
      setUsers((oldUsers) => oldUsers.filter((user) => user.id !== socketID));
      setUsers((oldUsers) => [
        ...oldUsers,
        {
          id: socketID,
          stream: e.streams[0],
        },
      ]);
    };

    // 로컬의 미디어 스트림이 존재하면 PeerConnection에 추가해줍니다.
    if (peerConnectionLocalStream) {
      console.log('localstream add');
      peerConnectionLocalStream.getTracks().forEach((track) => {
        pc.addTrack(track, peerConnectionLocalStream);
      });
    } else {
      console.log('no local stream');
    }

    return pc;
  };

  useEffect(() => {
    // async function init() {
    //   console.log('init');
    // try {
    //   const data = await instance.post('api/room', {
    //     title:
    //       '나 아는사람 강다니엘 닮은 이모가 다시보게되는게 다시 그때처럼 안닮게 엄마보면 느껴지는걸수도 있는거임? 엄마도?',
    //   });
    //   console.log(data.data.data);
    //   id = data.data.data.roomId;
    //   console.log(id);
    //   await instance.post(`api/room/${id}`);
    // } catch (e) {
    //   console.log(e);
    // }

    // 시그널링 서버와 소켓 연결
    socketRef.current = new SockJS(`${process.env.REACT_APP_API_URL}signal`);

    if (cookies.access_token) token = cookies.access_token;
    else if (cookies.guest) token = cookies.guest;

    // 소켓이 연결되었을 때 실행
    socketRef.current.onopen = async () => {
      navigator.mediaDevices
        .getUserMedia({
          video: false,
          audio: true,
        })
        .then((stream) => {
          if (audioRef.current) audioRef.current.srcObject = stream;

          localStream = stream;
          console.log('join_room');
          socketRef.current?.send(JSON.stringify({ type: 'ingame/join_room', room: id, token }));
        })
        .catch((error) => {
          console.log(`getUserMedia error: ${error}`);
        });
      dispatch(setSocket(socketRef.current));
    };

    // 서버로부터 메세지가 왔을 때 실행
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log(data);
      switch (data.type) {
        // 1. all_users로 서버에서 같은 방에 존재하는 나를 제외한 모든 user를 받아옵니다.
        case 'rtc/all_users': {
          const { allUsers, sender } = data;
          dispatch(setID(sender));
          // 나를 제외했으므로 방에 나밖에 없으면 length는 0
          const len = allUsers.length;
          for (let i = 0; i < len; i += 1) {
            console.log('all_users');

            // i번째 유저와 나의 peer connection 생성
            createPeerConnection(allUsers[i].id, socketRef.current, localStream);
            // allUsers에서 사용하는 peer connection, i번째 유저의 peer connection입니다.
            const allUsersPc: RTCPeerConnection = pcs[allUsers[i].id];

            // allUserPc가 존재하면
            if (allUsersPc) {
              // offer를 생성하고
              allUsersPc
                .createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: false })
                .then((sdp) => {
                  console.log('create offer success');
                  // 상대방과의 peer connection에 내 sdp를 이용해 local description을 생성
                  allUsersPc.setLocalDescription(new RTCSessionDescription(sdp));
                  // signaling server에 i번째 유저에게 offer를 요청합니다.
                  socketRef.current?.send(
                    JSON.stringify({
                      type: 'rtc/offer',
                      sdp,
                      receiver: allUsers[i].id,
                    }),
                  );
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }
          break;
        }
        // 2. 상대방이 offer를 받으면
        case 'rtc/offer': {
          console.log('get offer');
          // offer를 요청한 상대방과의 peer connection을 생성합니다.
          createPeerConnection(data.sender, socketRef.current, localStream);
          // offer에서 사용하는 peer connection, offer를 요청한 상대방과의 peer connection 입니다.
          const offerPc: RTCPeerConnection = pcs[data.sender];
          if (offerPc) {
            // offer를 보낸 상대방의 sdp를 이용해 상대방의 remote discription을 생성합니다.
            offerPc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(() => {
              console.log('answer set remote description success');
              offerPc // answer를 생성하고
                .createAnswer({ offerToReceiveVideo: false, offerToReceiveAudio: true })
                .then((sdp) => {
                  // 나의 sdp를 이용해
                  console.log('create answer success');
                  // 내 local description을 설정하고
                  offerPc.setLocalDescription(new RTCSessionDescription(sdp));
                  // offer를 보낸 상대방에게 answer를 보냅니다.
                  socketRef.current?.send(
                    JSON.stringify({
                      token,
                      type: 'rtc/answer',
                      sdp,
                      // answerSendID: newSocket.id,
                      receiver: data.sender,
                    }),
                  );
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          }
          break;
        }
        case 'rtc/answer': {
          console.log('get answer');
          // answer에서 사용하는 peer connection, answer를 보낸 상대방과의 peer connection 입니다.
          const answerPc: RTCPeerConnection = pcs[data.sender];
          // answerPc가 존재하면
          if (answerPc) {
            // answerPc의 remote description을 상대방의 sdp를 이용해 설정합니다.
            answerPc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          }
          break;
        }
        case 'rtc/candidate': {
          console.log('get candidate');
          // candidate에서 사용하는 peer connection, candidate 요청을 보낸 상대방과의 peer connection 입니다.
          const candidatePc: RTCPeerConnection = pcs[data.sender];
          // candidatePc가 존재하면
          if (candidatePc) {
            // cadidate 요청을 보낸 상대방의 candidate 정보로 candidate를 추가합니다.
            candidatePc.addIceCandidate(new RTCIceCandidate(data.candidate)).then(() => {
              console.log('candidate add success');
            });
          }
          break;
        }
        // 유저가 연결을 종료하면
        case 'rtc/user_exit': {
          // 해당 유저와의 peer connection을 종료하고
          pcs[data.sender].close();
          // pcs 배열에서 해당 user를 삭제합니다.
          delete pcs[data.sender];
          // user state를 업데이트하고 리렌더링시킵니다.
          setUsers((oldUsers) => oldUsers.filter((user) => user.id !== data.sender));
          break;
        }
        default:
          break;
      }
    };
    socketRef.current.onerror = (event) => {
      console.log(`Error! : ${event}`);
    };
    socketRef.current.onclose = () => {
      dispatch(closeSocket());
      console.log('socket is closed');
    };
    // }

    // init();

    // async function exit() {
    //   try {
    //     await instance.delete(`api/room/${id}/exit`);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }

    return () => {
      // exit();
      // 컴포넌트가 unmount되면 socket연결을 종료합니다.
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <audio ref={audioRef} muted>
        <track kind="captions" />
      </audio>
      {users.map((user) => {
        return <Audio key={user.id} stream={user.stream} />;
      })}
    </div>
  );
}

export default AudioCall;
