"use client";

import { Button, Typography, Flex, Card, Radio, Space, ConfigProvider, message } from 'antd';
import { useState, useEffect } from 'react';
import { createStyles } from 'antd-style';

const { Paragraph } = Typography;
import _ from 'lodash';


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
//   const [value, setValue]   = useState([]);
  const [data, setData]   = useState([]);
  const [mounted     , setMounted]   = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { styles } = useStyle();

  useEffect(() => { 
    setMounted(true);

    fetch(`/example-backend/api/v1/science/pictorial/plant`)
      .then(response => console.log(response.status) || response)
      .then(response => response.text())
      .then(body => {
        let jsonData = JSON.parse(body);
        console.log("------------------------");
        console.log(jsonData);
        let testData = _(jsonData).map(row => {
          let ret = {};
          ret["question"] = row["question"];
          ret["correct_answer"] = row["correct_answer"];
          ret["answer"] = 0;

          ret["answers"] = [];
          let num = row["answers"].length;
          for (let idx=0; idx < num; idx++) {
            ret["answers"].push( _(row["answers"]).pullAt(_.random(0, row["answers"].length -1) ).first() ); 
          }
          return ret;
        }).value();
        console.log(testData);
        setData(testData);
      });
   }, [])

  const onRadioChange = (event: RadioChangeEvent) => {
    let theData = JSON.parse(JSON.stringify(data));  // deep copy
    theData[event.target.name].answer = event.target.value;
    setData(theData);
  };

  const onSubmit = () => {
    let toDoList = _.filter(data, function(row) { return !row.answer; });
    if(toDoList.length > 0){
      messageApi.open({
        type: 'warning',
        content: 'Please complete all the questions.',
      });
    }
    console.log("Starting to check the data.");
    console.log(toDoList);
  };

  return mounted && (
    <div>
      {contextHolder}
      {data.map(function(object, i){
        return (
      <Flex key={i+11} vertical='vertical' justify='space-evenly' gap={ 50 } >
        <Card key={i+21} hoverable style={cardStyle} styles={{ body: { padding: 20, overflow: 'hidden' } }}>
            <Typography> Q{String(i+1).padStart(2, '0')}: {object.question}
            </Typography>
            <Radio.Group key={i+31} name={i} onChange={onRadioChange} value={object.answer}>
              <Space direction="vertical">
                { object.answers.map(function(answer, idx){
                    return (<Radio value={idx+1} key={i*100+idx+1}>{answer}</Radio>)
                  })
                }
              </Space>
            </Radio.Group>
        </Card>
      </Flex>
      )
      })}
      <Flex vertical gap="large" style={{ width: '100%' }}>
        <ConfigProvider button={{ className: styles.linearGradientButton }} >
          <Button size="large" onClick={onSubmit} >Submit</Button>
        </ConfigProvider >
      </Flex>
    </div>
  );
};
