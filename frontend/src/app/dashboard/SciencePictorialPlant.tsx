"use client";

import { Typography, Flex, Card, Radio, Space } from 'antd';
import { useState, useEffect } from 'react';

const { Paragraph } = Typography;
import _ from 'lodash';

const cardStyle: React.CSSProperties = {
  width: 780,
  height: 200,
  margin: 10,
};

// let data = [
//   {"question": "This is the first question", "answer_01": "answer 1A", "answer_02": "answer 1B", "answer_03": "answer 1C", "answer_04": "answer 1D", "correct_answer": "Correct answer", "answer": 0},
//   {"question": "This is the second question", "answer_01": "answer 2A", "answer_02": "answer 2B", "answer_03": "answer 2C", "answer_04": "answer 2D", "correct_answer": "Correct answer", "answer": 0},
//   {"question": "This is the third question", "answer_01": "answer 3A", "answer_02": "answer 3B", "answer_03": "answer 3C", "answer_04": "answer 3D", "correct_answer": "Correct answer", "answer": 0},
//   {"question": "This is the forth question", "answer_01": "answer 4A", "answer_02": "answer 4B", "answer_03": "answer 4C", "answer_04": "answer 4D", "correct_answer": "Correct answer", "answer": 0},
//   {"question": "This is the fifth question", "answer_01": "answer 5A", "answer_02": "answer 5B", "answer_03": "answer 5C", "answer_04": "answer 5D", "correct_answer": "Correct answer", "answer": 0},
// ];

export default (props) => {
  const [value, setValue]   = useState([]);
  const [data, setData]   = useState([]);
  const [mounted     , setMounted]   = useState(false);

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

  return mounted && (
    <div>
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
    </div>
  );
};
