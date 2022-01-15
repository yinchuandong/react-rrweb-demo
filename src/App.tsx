import React, { useState, useRef, useEffect, useCallback } from "react";
import logo from "./logo.svg";
import "./App.css";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import * as rrweb from "rrweb";
import rrwebPlayer, { RRwebPlayerOptions } from "rrweb-player";
import "rrweb-player/dist/style.css";
import { eventWithTime, listenerHandler } from "rrweb/typings/types";

const Player = ({ events }: { events: eventWithTime[] }) => {
  const [replayer, setReplayer] = useState<rrwebPlayer>();
  const wrapper = useRef<any>();
  useEffect(() => {
    if (events.length > 1) {
      setReplayer(
        new rrwebPlayer({
          target: wrapper.current as HTMLElement,
          props: {
            events: events,
          },
        } as RRwebPlayerOptions)
      );
    }
  }, [events]);

  if (events.length < 2) {
    return <p>Loading...</p>;
  }

  return <div ref={wrapper} />;
};


const PlainMenu = () => {
  const [stopFn, setStopFn] = useState<listenerHandler|undefined>(undefined)
  const [events, setEvents] = useState<eventWithTime[]>([])
  const [displayEvents, setDisplayEvents] = useState<eventWithTime[]>([]);

  const [count, setCount] = useState(0);

  const handleClick = () => {
    let rrwebHandler = rrweb.record({
      emit(event) {
        // NOTE: you have to use lambda function to push event into the events array
        setEvents(events => [...events, event])
        console.log("####:", events.length, ", ", event);
      },
    });
    setStopFn(() => rrwebHandler)
  };

  const handleStop = () => {
    if (stopFn) {
      stopFn();
      setStopFn(undefined)
    }
    console.log(events);
    if (events.length < 2) {
      console.log("it needs more than 2 events to play");
      return;
    }

    setDisplayEvents(events);
  };

  const handleCount = () => {
    setCount(count + 1);
  };
  return (
    <div>
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={handleClick}>click to start recording</Button>
        <Button variant="contained" onClick={handleStop}>stop and replay</Button>
        <Button variant="contained" onClick={handleCount}> test count `{count + 1}` </Button>
        <TextField variant="filled" color="success" />
      </Stack>
      <Player events={displayEvents} />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PlainMenu />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
