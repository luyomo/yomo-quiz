"use client";

import { Table, Tag, Space, Modal, Select, Typography, Flex, Statistic, Checkbox, Button, Card, Progress, Input, message } from 'antd';
import { useState, useEffect, useRef } from 'react';
import type { CountdownProps, InputRef, TableProps } from 'antd';
import { useCookies             } from 'react-cookie';

const columns: TableProps<DataType>['columns'] = [
  { title: 'Seq'     , dataIndex: 'sequence', key: 'sequence' },
  { title: 'Question', dataIndex: 'question', key: 'question' },
  { title: 'Answer'  , dataIndex: 'answer'  , key: 'answer'   },
  { title: 'Response', dataIndex: 'response', key: 'response' },
  { title: 'Tags'    ,                        key: 'tags',
    render: (_, record, idx ) => {
        if(record.answer == record.response) {
          return (<Tag color="blue">correct</Tag>)
        }else{
          return (<Tag color="red">wrong</Tag>)
        }
    },
  },
  { title: 'Action', key: 'action', render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const cardStyle: React.CSSProperties = {
  width: 780,
  height: 640,
  margin: 20,
};

let jsonQ     = [];
let jsonDoneQ = [];
let timer     = Date.now();

export default (props) => {
  const [mounted     , setMounted]   = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // If this checkbox is selected, it will not gather the value from inputbox. The user is able to complete the work by paper
  // and score it afterward.
  const [skipCheckAnswer, setSkipCheckAnswer] = useState(false);

  // The term is used as the selector
  const [term    , setTerm    ] = useState("");
  const [terms   , setTerms   ] = useState([]);

  // The group is used as the second level selector
  const [group   , setGroup   ] = useState("");
  const [groups  , setGroups  ] = useState([]);

  // The question is set
  const [question, setQuestion] = useState({"question": ""});
  const [answers , setAnswers ] = useState([]);
  const [open    , setOpen    ] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [enableInputBox, setEnableInputBox] = useState(true);

  const [numQuesCor, setNumQuesCor] = useState(0);    // The number of the successful questions 
  const [numQues   , setNumQues]    = useState(1);    // The number of the question which has been completed.
  const [numQues2Do, setNumQues2Do] = useState(1);    // The number of the question to be do.

  const inputRef = useRef<InputRef>(null);
  const [cookies, setCookie] = useCookies([]);

  const { Countdown } = Statistic;

  const onInputKeyUp = (event) => {
    if(event.keyCode === 13){
      let inputV = inputValue;
//      console.log("-----------");
//      console.log(inputV);
      setInputValue("");
      setNumQues2Do(jsonQ.length);

      let tmpTimer = Date.now();
      let timeTaken = Math.abs(tmpTimer - timer);
      timer = tmpTimer;
      jsonDoneQ[jsonDoneQ.length-1]["time_taken"] = timeTaken;

      jsonDoneQ[jsonDoneQ.length-1]["response"] = inputV;
//      console.log(jsonDoneQ);
//      console.log(inputV.toLowerCase().trim());

      if (inputV.toLowerCase().trim() == jsonDoneQ[jsonDoneQ.length-1].answer.toLowerCase().trim() ){
        setNumQuesCor(numQuesCor + 1);
      }

      if (jsonQ.length === 0) {
        // Once all the question are done, proceed the answers.
        SpeakEnglish("The test has been completed.");
        setOpen(true);
        setEnableInputBox(true);  // Default: Input box is disabled
        setQuestion({"question": ""});

        fetch(`/example-backend/api/v1/fill-in-blank`, {method: "POST", body: JSON.stringify({user: cookies.user_email, data: jsonDoneQ})})
          .then(response => console.log(response.status) || response)
          .then(response => response.text())
          .then(body => {
            console.log("Completed the data upload");
           });
        return;
      }

      let theQ = jsonQ.shift();
      theQ["key"] = theQ["sequence"];
      jsonDoneQ.push(theQ);
      // SpeakEnglish(word.enword);
      setQuestion(theQ);
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

  const onTermChange = (e) => {
    setTerm(e);

    let params = _.cloneDeep(props);
    params["level02"] = e;
    params["questionType"] = "fill-in-blank";

    fetch(`/example-backend/api/v1/question-list/level03?` + new URLSearchParams(params))
      .then(response => console.log(response.status) || response)
      .then(response => response.json())
      .then(body => {
        console.log(body);
        setGroups(body);
      });
  };

  const onGroupChange = (value) => { setGroup(value); };

  useEffect(() => { 
    setMounted(true);
    setEnableInputBox(true);  // Default: Input box is disabled
    let params = _.cloneDeep(props);
    params["questionType"] = "fill-in-blank";

    fetch(`/example-backend/api/v1/question-list/level02?` + new URLSearchParams(params))
      .then(response => console.log(response.status) || response)
      .then(response => response.json())
      .then(body => {
        console.log(body);
        setTerms(body);
      });
   }, [])

  const correctnessLabel = `${skipCheckAnswer? 'Count correctness' : 'Skip Correctness'}`;
  const onSkipCheckAnswer: CheckboxProps['onChange'] = (e) => {
     setSkipCheckAnswer(e.target.checked);
  }; 

  const SkipAnswerProgress = () => {
    if (!skipCheckAnswer) {
      // Complete ratio = number of correct questions / ( all the questions - number of question to do )
      // Example: Total 10, completed: 8, successful: 6 -> 6/8
      return (<Progress type="circle" percent={100*numQuesCor/(numQues-numQues2Do)} format={(percent) => `成功率${numQuesCor}/${numQues-numQues2Do}`} />)
    } 
  }

  // https://github.com/BradBarkel/js-text-to-speech/blob/master/dist/js/main.js
  const TestProcess = () => {
    let params        = _.cloneDeep(props);
    if (cookies.user_email === undefined) {
      messageApi.open({
        type: 'warning',
        content: 'Please login from google.',
      });
      return;
    }
    params["user"]    = cookies.user_email;
    params["level02"] = term;
    if (term === "") {
      messageApi.open({
        type: 'warning',
        content: 'Please select the term first.',
      });
      return;
    }
    params["level03"] = group;
    if (group === "") {
      messageApi.open({
        type: 'warning',
        content: 'Please select the group first.',
      });
      return;
    }

    fetch(`/example-backend/api/v1/fill-in-blank?` + new URLSearchParams(params).toString())
      .then(response => console.log(response.status) || response)
      .then(response => response.json())
      .then(body => {
        jsonDoneQ = _.cloneDeep([]);
        jsonQ = body;

        if (body.length === 0) {
          SpeakEnglish("No available words for the specific section.");
          return;
        }
        setNumQues(jsonQ.length);
        setNumQues2Do(jsonQ.length);
        inputRef.current!.focus({ cursor: 'start' });
        let theQ = jsonQ.shift();
        timer = Date.now();
        theQ["key"] = theQ["sequence"];
        jsonDoneQ.push(theQ);
        setQuestion(theQ);
        setEnableInputBox(false);  // Once the data is fetched, the inputbox is enabled.
        // SpeakEnglish(word.enword);
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
    {contextHolder}
    <Typography.Title level={5}>{ EikenLevelName(props.level) } - wrtie words from audio</Typography.Title>
    <Card hoverable style={cardStyle} styles={{ body: { padding: 20, overflow: 'hidden' } }}>
    <Flex vertical='vertical' justify='space-evenly' gap={ 50 } >
      <Flex justify='space-evenly' align='center' gap={ 80 }>
        <Flex vertical='vertical' justify='space-evenly'>
          <Typography.Title level={5}>Term</Typography.Title>
          <Select
            defaultValue={terms[0]}
            style={{ width: 120 }}
            onChange={onTermChange}
            options={terms.map((term) => ({ label: term, value: term }))}
          />
        </Flex>
        <Flex vertical='vertical' justify='space-evenly'>
          <Typography.Title level={5}>Group</Typography.Title>
          <Select
            style={{ width: 120 }}
            value={group}
            onChange={onGroupChange}
            options={groups.map((group) => ({ label: group, value: group }))}
          />
        </Flex>
        <Flex vertical='vertical' justify='space-evenly' gap='large'>
          <Button type="primary" onClick={ TestProcess }>Next 10</Button>
          <Checkbox checked={skipCheckAnswer} onChange={ onSkipCheckAnswer}>{correctnessLabel}</Checkbox>
        </Flex>
      </Flex>
      <Flex justify='space-evenly' align='center'>
        <Progress type="circle" percent={100*(numQues-numQues2Do)/numQues} format={percent => `完成率${numQues-numQues2Do}/${numQues}` } />
        <SkipAnswerProgress />
      </Flex>
      <Flex vertical='vertical' justify='space-evenly' align='center'>
        { question.question.split("\\n").map(function(row, idx){
            return (<Typography key="text-{idx}">{ row }</Typography> )
          })
        }
      </Flex>
      <Flex justify='space-evenly' align='center'>
        <Input {...inputProps} value={inputValue} disabled={ enableInputBox }  onChange={ event => setInputValue(event.target.value) } />
      </Flex>
      <Flex justify='flex-end'>
        <Countdown title="Seconds" value={Date.now() + 60 * 1000} format="HH:mm:ss" onFinish={ () => {alert("Completed the count down")} } />
      </Flex>
    </Flex>
    <Modal
      title="To replace here"
      centered
      open={open}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      width={1000}
    >
      <Table<DataType> columns={columns} dataSource={jsonDoneQ} />
    </Modal>
    </Card>
    </div>
  );
};
