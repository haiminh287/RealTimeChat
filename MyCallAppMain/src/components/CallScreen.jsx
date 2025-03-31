import React, { useEffect, useState, useRef } from 'react';
import { View, Button, Text, Platform, PermissionsAndroid, Alert } from 'react-native';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices, RTCView } from 'react-native-webrtc';
import secure from '../core/secure';
import { ADDRESS } from '../core/apis';
import { useRoute } from '@react-navigation/native';

const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

const CallScreen = () => {
    const route = useRoute();
    const friend = route.params.friend;
    const [isCallActive, setIsCallActive] = useState(false);
    const [callStatus, setCallStatus] = useState('Ready to Call');
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const peerConnection = useRef(new RTCPeerConnection(configuration));
    const ws = useRef(null);

    useEffect(() => {
        const setupConnection = async () => {
            const credentials = await secure.get('credentials');
            const token = credentials.token;
            const socket = new WebSocket(`ws://${ADDRESS}/call/?token=${token}`);
            ws.current = socket;

            ws.current.onmessage = (event) => {
                console.log('Message received', event.data);
                handleMessage(event);
            };

            ws.current.onopen = () => {
                console.log('WebSocket connection opened');
            };

            return () => {
                ws.current.close();
                peerConnection.current.close();
            };
        };

        setupConnection();
    }, []);

    async function requestAudioPermission() {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        title: 'Audio Permission',
                        message: 'This app needs access to your microphone to make calls.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Permission granted:', granted);
                    return true;
                } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    Alert.alert(
                        'Permission Required',
                        'Microphone permission is required to make calls. Please enable it in the app settings.',
                        [
                            { text: 'OK' }
                        ]
                    );
                    return false;
                } else {
                    console.log('Permission denied:', granted);
                    return false;
                }
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true; 
    }

    async function getAudioStream() {
        const hasPermission = await requestAudioPermission();
        if (!hasPermission) {
            console.error('Audio permission denied');
            return;
        }
    
        const stream = await mediaDevices.getUserMedia({ audio: true, video: true });
        setLocalStream(stream);
        stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
    }

    async function createOffer() {
        console.log('Creating offer');
        try {
            await getAudioStream();
        } catch (e) {
            console.error(e);
        }
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        ws.current.send(JSON.stringify({ offer, receiverUsername: friend.username }));
        setIsCallActive(true);
        setCallStatus('Call Active');
    }

    async function handleOffer(offer) {
        console.log('Handling offer', offer);
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        await getAudioStream();
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        ws.current.send(JSON.stringify({ answer, receiverUsername: friend.username }));
        setIsCallActive(true);
        setCallStatus('Call Active');
    }

    async function handleAnswer(answer) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    }

    async function handleCandidate(candidate) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    }

    const handleMessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Message received', data);
        if (data.offer) handleOffer(data.offer);
        if (data.answer) handleAnswer(data.answer);
        if (data.candidate) handleCandidate(data.candidate);
    }

    function endCall() {
        peerConnection.current.close();
        setIsCallActive(false);
        setCallStatus('Call Ended');
        setLocalStream(null);
        setRemoteStream(null);
    }

    useEffect(() => {
        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                ws.current.send(JSON.stringify({ candidate: event.candidate, receiverUsername: friend.username }));
            }
        };

        peerConnection.current.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                setRemoteStream(event.streams[0]);
            }
        };
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{callStatus}</Text>
            {localStream && (
                <RTCView
                    streamURL={localStream.toURL()}
                    style={{ width: 200, height: 200 }}
                />
            )}
            {remoteStream && (
                <RTCView
                    streamURL={remoteStream.toURL()}
                    style={{ width: 200, height: 200 }}
                />
            )}
            {!isCallActive ? (
                <Button title="Start Call" onPress={createOffer} />
            ) : (
                <Button title="End Call" onPress={endCall} />
            )}
        </View>
    );
};

export default CallScreen;