"use client";

import { Select, Button, Typography, Flex, Card, Radio, Space, ConfigProvider, message } from 'antd';
import { useState, useEffect } from 'react';
import { createStyles } from 'antd-style';
import { CorrectIcon, WrongIcon} from '../../../icons/Icons.tsx';
import { PlayCircleOutlined } from '@ant-design/icons';

import { SpeakJapanese } from './Utils.tsx';

const { Paragraph } = Typography;
import _ from 'lodash';

import { useCookies             } from 'react-cookie';

const cardStyle: React.CSSProperties = {
  width: 780,
  height: 200,
  margin: 10,
};

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      border-width: 0;

      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

export default (props) => {
  const [data, setData]   = useState([]);
  const [progress, setProgress]   = useState("init");
  const [mounted     , setMounted]   = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { styles } = useStyle();
  const [cookies, setCookie] = useCookies([]);
  const [term  , setTerm  ] = useState("");
  const [terms , setTerms ] = useState([]);
  const [group , setGroup ] = useState("");
  const [groups, setGroups] = useState([]);

  useEffect(() => { 
    let params = _.cloneDeep(props);
    params["questionType"] = "choice";

    fetch(`/example-backend/api/v1/question-list/level02?` + new URLSearchParams(params))
      .then(response => console.log(response.status) || response)
      .then(response => response.json())
      .then(body => {
        console.log(body);
        setTerms(body);
      });

    console.log("The level 01:", props.level01);
    setMounted(true);

   }, [])

  const onRadioChange = (event: RadioChangeEvent) => {
    // If the setState target is one object, the value is kept as pointer. Changing contents does not trigger the render, 
    // so the cloneDeep is required to change the object pointer.
    let theData = _.cloneDeep(data);
    theData[event.target.name].answer = event.target.value;
    setData(theData);
  };

  const onSubmit = () => {
    // If not all the questions are filled in, the submit is not allowed. 
    let toDoList = _.filter(data, function(row) { return !row.answer; });
    if(toDoList.length > 0){
      messageApi.open({
        type: 'warning',
        content: 'Please complete all the questions.',
      });
      return;
    }

    // According to the choice result, set the is_correct value of the object to show the correct/wrong icon. 
    // Data example as below:
    // {
    //   answer: 2,                                                   # the choice like 1,2,3...
    //   answers: ["Choice 01", "Choice 02", "Choice 03" ...], 
    //   correct_answer: "Choice 02",
    //   question: "This is the example question",
    //   is_correct: 1,                                               # This item will be added after the below logic. 
    //                                                                # 1: correct, 2: wrong, else: no icon display
    // }
    let jsonData = _(data).map(row => {
      if (row["answer"] === 9) {  // [わからない]
        row["is_correct"] = 2; 
      }else if(row["correct_answer"] == row["answers"][row["answer"] - 1]) {
        row["is_correct"] = 1; 
      } else {
        row["is_correct"] = 2; 
      }
      return row;
    }).value(); 

    // Render the GUI
    setData(jsonData);
    setProgress("completed");

    
    fetch(`/example-backend/api/v1/history/choice-qa`, {method: "POST", body: JSON.stringify({user: cookies.user_email, data: jsonData})} )
      .then(response => console.log(response.status) || response)
      .then(response => response.text())
      .then(body => {
        console.log(body);
      });
  };

  const onNextNew = () => { onNext("new", "No new questions are available."); };
  const onNextFailure = () => { onNext("failure", "No failure questions are available."); };

  const onNext = (theType, message) => {
    // so the cloneDeep is required to change the object pointer.
    let params = _.cloneDeep(props);
    params["user"] = cookies.user_email;
    params["type"] = theType;
    params["level02"] = term;
    params["level03"] = group;

    fetch(`/example-backend/api/v1/history/choice-qa?` + new URLSearchParams(params).toString())
      .then(response => console.log(response.status) || response)
      .then(response => response.text())
      .then(body => {
        let jsonData = JSON.parse(body);
        let convertedJsonData = _(jsonData).map(row => {
          let ret = {};

          ret["question"]       = row["question"];
          ret["sequence"]       = row["sequence"];
          ret["correct_answer"] = row["correct_answer"];
          ret["answer"]         = 0;                       // Set the answer as 0 in order not to select the radio item initially

          // Pull one column from answers and push to the answer to random the answer every time.
          // It does not matter how you change the sequence of the answer if the correct_answer column is there to be used to determine
          // user's result
          // ex: ["A", "B", "C"] -> ["B", "A", "C"] randomly
          ret["answers"]        = [];
          let num = row["answers"].length;
          for (let idx=0; idx < num; idx++) {
            ret["answers"].push( _(row["answers"]).pullAt(_.random(0, row["answers"].length -1) ).first() ); 
          }

          setProgress("started");

          return ret;
        }).value();

        if(convertedJsonData.length === 0){
          messageApi.open({
            type: 'info',
            content: message,
          });
        }

        setData(convertedJsonData);
      });
  };
  const onTermChange = (e) => {
    setTerm(e);
    // so the cloneDeep is required to change the object pointer.
    let params = _.cloneDeep(props);
    params["level02"] = e;
    params["questionType"] = "choice";
    fetch(`/example-backend/api/v1/question-list/level03?` + new URLSearchParams(params))
      .then(response => console.log(response.status) || response)
      .then(response => response.json())
      .then(body => {
        console.log(body);
        setGroups(body);
      });
  };
  const onGroupChange = (event) => {setGroup(event)};

  return mounted && (
    <div>
      {contextHolder}
      <Flex>
      <Flex vertical justify='space-evenly' align='center' style={{ width: 180 }}  >
        <Flex justify='space-evenly' gap={ 20 }>
          <Typography>Term</Typography>
          <Select
            defaultValue={terms[0]}
            style={{ width: 120 }}
            onChange={onTermChange}
            options={terms.map((term) => ({ label: term, value: term}))}
          />
        </Flex>
        <Flex justify='space-evenly' gap={ 20 }>
          <Typography>Group</Typography>
          <Select
            style={{ width: 120 }}
            value={group}
            onChange={onGroupChange}
            options={groups.map((group) => ({ label: group, value: group}))}
          />
        </Flex>
      </Flex>
      <Flex vertical gap="large" style={{ width: '70%' }}>
        <ConfigProvider button={{ className: styles.linearGradientButton }} >
          <Button size="large" onClick={onNextNew} >Next 10 New Questions</Button>
          <Button size="large" onClick={onNextFailure} >Next 10 Failed Questions</Button>
        </ConfigProvider >
      </Flex>
      </Flex>
      {data.map(function(object, i){
        return (
      <Flex key={i+11} vertical='vertical' justify='space-evenly' gap={ 50 } >
        <Card key={i+21} hoverable style={cardStyle} styles={{ body: { padding: 20, overflow: 'hidden' } }}>
            <Typography> { (() => {
              switch (object['is_correct']) { 
                case 1: 
                  return <CorrectIcon />; 
                  break; 
                case 2: return <WrongIcon />; 
                  break; 
                default: return null; 
              }
              })()
            }  Q{String(i+1).padStart(2, '0')}: {object.question}    <a id="link" href="#" onClick={ (e) => {e.preventDefault(); SpeakJapanese(object.question);} }><PlayCircleOutlined /></a> {(() => { return (progress === "completed" && object['is_correct'] !== 1) ? (<span style={{ color: 'red' }} >正解：{object.correct_answer}</span>) : '' })()} 
            </Typography> 
            <Radio.Group key={i+31} name={i} onChange={onRadioChange} value={object.answer}>
              <Space direction="vertical">
                { object.answers.map(function(answer, idx){
                    return (<Radio value={idx+1} key={i*100+idx+1}>{answer}       <a id="link" href="#" onClick={ (e) => {e.preventDefault(); SpeakJapanese(answer);} }><PlayCircleOutlined /></a> </Radio>)
                  })
                }
                <Radio value={9} key={i*100+9+1}>わからない</Radio>
              </Space>
            </Radio.Group>
        </Card>
      </Flex>
      )
      })}
      { (() => { 
        if (data.length > 0) {
          return(
            <Flex vertical gap="large" style={{ width: '100%' }}>
              <ConfigProvider button={{ className: styles.linearGradientButton }} >
                <Button size="large" onClick={onSubmit} disabled={(() => { return (progress === "started") ? false : true })()} >Submit</Button>
              </ConfigProvider >
            </Flex>
          )}
        })()
      }
    </div>
  );
};
