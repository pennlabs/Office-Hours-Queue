import UIfx from "uifx";
import {
    useState,
    useRef,
    useEffect,
    Dispatch,
    SetStateAction,
    MutableRefObject,
} from "react";

export function usePlayer(
    audio: string
): [boolean, Dispatch<SetStateAction<Boolean>>, MutableRefObject<(string) => void>] {
    const player = useRef<UIfx>();
    useEffect(() => {
        player.current = new UIfx(audio, { throttleMs: 100 });
    }, [audio]);
    
    const [notifs, setNotifs] = useState(false);

    const playFunc = (message: string) => {
        if (notifs) {
            player.current?.play();
            new Notification('Alert', { body: message, data: 'somethingelse', icon: '../favicon.ico'});
        }
        console.log(Notification.permission);

    };

    const play = useRef<(string) => void>(playFunc);
    play.current = playFunc;

    return [notifs, setNotifs, play];
}
