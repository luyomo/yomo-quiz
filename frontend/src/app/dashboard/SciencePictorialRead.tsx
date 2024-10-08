"use client";

import { Image, Select, Typography, Flex, Statistic, Checkbox, Button, Card, Progress, Input } from 'antd';
import { useState, useEffect, useRef } from 'react';
import type { CountdownProps } from 'antd';
import type { InputRef } from 'antd';

import {  RandomInt } from './Utils.tsx';

const cardStyle: React.CSSProperties = {
  width: 780,
  height: 640,
  margin: 20,
};

let jsonQa     = [];
let jsonDoneQa = [];
let timer = Date.now();

export default (props) => {
  const [mounted     , setMounted]   = useState(false);

  const [skipCheckAnswer, setSkipCheckAnswer] = useState(false);
  const [group   , setGroup   ] = useState("");
  const [groups  , setGroups  ] = useState([]);
  const [section , setSection ] = useState("");
  const [sections, setSections] = useState([]);
  const [image   , setImage   ] = useState("https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png");

  const [inputValue, setInputValue] = useState('');

  const [numQuesCor, setNumQuesCor] = useState(0);
  const [numQues, setNumQues] = useState(1);
  const [numQues2Do, setNumQues2Do] = useState(1);

  const inputRef = useRef<InputRef>(null);

  const { Countdown } = Statistic;

  const onInputKeyUp = (event) => {
    if(event.keyCode === 13){
      let inputV = inputValue;
      setInputValue("");
      setNumQues2Do(jsonQa.length);

      let tmpTimer = Date.now();
      let timeTaken = Math.abs(tmpTimer - timer);
      timer = tmpTimer;
      jsonDoneQa[jsonDoneQa.length-1]["time_taken"] = timeTaken;

      jsonDoneQa[jsonDoneQa.length-1]["answer"] = inputV;

      if (inputV.toLowerCase().trim() == jsonDoneQa[jsonDoneQa.length-1].question.toLowerCase().trim() ){
        setNumQuesCor(numQuesCor + 1);
      }

      if (jsonQa.length === 0) {
//        SpeakEnglish("The test has been completed.");
//        event.target.disabled = true;
//        fetch(`/example-backend/api/v1/data/complete-test?level=${props.level}&group=${group}&section=${section}`, {method: "POST", body:JSON.stringify(jsonDoneWords)})
//          .then(response => console.log(response.status) || response)
//          .then(response => response.text())
//          .then(body => {
//            console.log("Completed the data upload");
//           });
        return;
      }

        let qa = jsonQa.shift();
        let urls = JSON.parse(qa.urls);

        setImage(urls[RandomInt(20)]);

        timer = Date.now();
        jsonDoneQa.push(qa)
        console.log("Starting to render the pic");
    }
  };

  const inputProps = {
    placeholder: "Please input the heard word",
    ref: inputRef,
    onKeyUp: onInputKeyUp,
  };


  const synth = window.speechSynthesis;

  const onFinish: CountdownProps['onFinish'] = () => {
    console.log('finished!');
  };

  const onChange: CountdownProps['onChange'] = (val) => {
    if (typeof val === 'number' && 4.95 * 1000 < val && val < 5 * 1000) {
      console.log('changed!');
    }
  };

  const EikenLevelName = (theLevel) => {
    switch (theLevel) {
      case "level 1-2":   return "英検一級"
      case "level 1-1":   return "英検準一"
      case "level 2-2":   return "英検二級"
      case "level 2-1":   return "英検準二"
      case "level 3"  :   return "英検三級"
    }
  };

  const handleGroupChange = (value) => {
    setGroup(value);

    fetch(`/example-backend/api/v1/eiken/sections?level=${props.level}&group=${value}`)
      .then(response => console.log(response.status) || response)
      .then(response => response.text())
      .then(body => {
        let jsonData = JSON.parse(body);
        setSections(jsonData); });
  };

  const onSectionChange = (value) => { setSection(value); };

  useEffect(() => { 
    setMounted(true);

    fetch(`/example-backend/api/v1/eiken/groups?level=${props.level}`)
      .then(response => console.log(response.status) || response)
      .then(response => response.text())
      .then(body => {
        console.log(body);
        let jsonData = JSON.parse(body);
        setGroups(jsonData); });
   }, [])

  const correctnessLabel = `${skipCheckAnswer? 'Count correctness' : 'Skip Correctness'}`;
  const onSkipCheckAnswer: CheckboxProps['onChange'] = (e) => {
     setSkipCheckAnswer(e.target.checked);
  }; 

  const SkipAnswerProgress = () => {
    if (!skipCheckAnswer) {
      return (<Progress type="circle" percent={100*numQuesCor/(numQues-numQues2Do)} format={(percent) => `成功率${numQuesCor}/${numQues-numQues2Do}`} />)
    } 
  }

  // https://github.com/BradBarkel/js-text-to-speech/blob/master/dist/js/main.js
  const TestProcess = () => {
    fetch(`/example-backend/api/v1/science/pictorial/pic-read`)
      .then(response => console.log(response.status) || response)
      .then(response => response.text())
      .then(body => {
        // console.log(`console output from function: ${body}`);
        jsonQa = JSON.parse(body);
        console.log("Fetch the json data: ");
        console.log(jsonQa);

        // console.log(body);
        if (jsonQa.length === 0) {
          SpeakEnglish("No available question.");
          return;
        }
        setNumQues(jsonQa.length);
        setNumQues2Do(jsonQa.length);
        inputRef.current!.focus({ cursor: 'start' });
        let qa = jsonQa.shift();
        console.log("------ The qa urls are here");
        console.log(qa.urls);
        let urls = JSON.parse(qa.urls);
        console.log(urls);


        // Set the value here
        console.log("The url is:");
        console.log(urls[0]);
        // setImage(urls[RandomInt(urls.length)]);
        setImage(urls[RandomInt(20)]);

        timer = Date.now();
        jsonDoneQa.push(qa)
        console.log("Starting to render the pic");

//        SpeakEnglish(word.enword);
    });
  }

  const SpeakEnglish = (inputText) => {
    if (synth.speaking) {
      console.error("already speaking");
      return;
    }
    const speakText = new SpeechSynthesisUtterance(inputText);
    //Speak end
    speakText.onend = e => {
      // body.style.background = "#141414";
    };

    //Speak error
    speakText.onerror = e => {
      console.error("Something went wrong...");
    };

    synth.speak(speakText);
  };

  return mounted && (
    <div>
    <Typography.Title level={5}>{ EikenLevelName(props.level) } - wrtie words from audio</Typography.Title>
    <Card hoverable style={cardStyle} styles={{ body: { padding: 20, overflow: 'hidden' } }}>
    <Flex vertical='vertical' justify='space-evenly' gap={ 50 } >
      <Flex justify='space-evenly' align='center' gap={ 80 }>
        <Flex vertical='vertical' justify='space-evenly'>
          <Typography.Title level={5}>Group</Typography.Title>
          <Select
            defaultValue={groups[0]}
            style={{ width: 120 }}
            onChange={handleGroupChange}
            options={groups.map((group) => ({ label: `Group ${group}`, value: group }))}
          />
        </Flex>
        <Flex vertical='vertical' justify='space-evenly'>
          <Typography.Title level={5}>Section</Typography.Title>
          <Select
            style={{ width: 120 }}
            value={section}
            onChange={onSectionChange}
            options={sections.map((section) => ({ label: `Section ${section}`, value: section }))}
          />
        </Flex>
        <Flex vertical='vertical' justify='space-evenly' gap='large'>
          <Button type="primary" onClick={ TestProcess }>Start Test</Button>
          <Checkbox checked={skipCheckAnswer} onChange={ onSkipCheckAnswer}>{correctnessLabel}</Checkbox>
        </Flex>
      </Flex>
      <Flex justify='space-evenly' align='center'>
        <Progress type="circle" percent={100*(numQues-numQues2Do)/numQues} format={percent => `完成率${numQues-numQues2Do}/${numQues}` } />
        <SkipAnswerProgress />
      </Flex>
      <Flex justify='space-evenly' align='center'>
        <Image width={200} src={ image } />
      </Flex>
      <Flex justify='space-evenly' align='center'>
        <Input {...inputProps} value={inputValue} onChange={ event => setInputValue(event.target.value) } />
      </Flex>
      <Flex justify='flex-end'>
        <Countdown title="Seconds" value={Date.now() + 60 * 1000} format="HH:mm:ss" onFinish={ () => {alert("Completed the count down")} } />
      </Flex>
    </Flex>
    </Card>
    </div>
  );
};
