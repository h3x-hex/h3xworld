import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:3001");
export const charactersAtom = atom([]);
export const mapAtom = atom(null);
export const userAtom = atom(null);
export const itemsAtom = atom(null);

export const SocketManager = () => {
  const [_characters, setCharacters] = useAtom(charactersAtom);
  const [_map, setMap] = useAtom(mapAtom);
  const [_user, setUser] = useAtom(userAtom);
  const [_items, setItems] = useAtom(itemsAtom);
  useEffect(() => {
    function onConnect() {
      console.log("connected");
      setMap(value.map);
      setUser(value.id);
      setItems(value.items);
      setCharacters(value.characters);
    }
    function onDisconnect() {
      console.log("disconnected");
    }

    function onInit(value) {
      setMap(value.map);
      setUser(value.id);
      setItems(value.items);
      setCharacters(value.characters);
    }

    function onCharacters(value) {
      setMap(value.map);
      setUser(value.id);
      setItems(value.items);
      setCharacters(value.characters);
    }

    function onMapUpdate(value) {
      setMap(value.map);
      setCharacters(value.characters);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("init", onInit);
    socket.on("characters", onCharacters);
    socket.on("mapUpdate", onMapUpdate);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("init", onInit);
      socket.off("characters", onCharacters);
      socket.off("mapUpdate", onMapUpdate);
    };
  }, []);
};
