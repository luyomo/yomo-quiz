"use client";

import { Typography, Flex, Card, Radio, Space } from 'antd';
import { useState, useEffect } from 'react';

const { Paragraph } = Typography;

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
    setData([
      {"question": "This is the first question", "answer_01": "answer 1A", "answer_02": "answer 1B", "answer_03": "answer 1C", "answer_04": "answer 1D", "correct_answer": "Correct answer", "answer": 1},
      {"question": "This is the second question", "answer_01": "answer 2A", "answer_02": "answer 2B", "answer_03": "answer 2C", "answer_04": "answer 2D", "correct_answer": "Correct answer", "answer": 0},
      {"question": "This is the third question", "answer_01": "answer 3A", "answer_02": "answer 3B", "answer_03": "answer 3C", "answer_04": "answer 3D", "correct_answer": "Correct answer", "answer": 0},
      {"question": "This is the forth question", "answer_01": "answer 4A", "answer_02": "answer 4B", "answer_03": "answer 4C", "answer_04": "answer 4D", "correct_answer": "Correct answer", "answer": 0},
      {"question": "This is the fifth question", "answer_01": "answer 5A", "answer_02": "answer 5B", "answer_03": "answer 5C", "answer_04": "answer 5D", "correct_answer": "Correct answer", "answer": 0}]
    );
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
            <Radio value={1}>{object.answer_01}</Radio>
            <Radio value={2}>{object.answer_02}</Radio>
            <Radio value={3}>{object.answer_03}</Radio>
            <Radio value={4}>{object.answer_04}</Radio>
          </Space>
        </Radio.Group>
    </Card>
      </Flex>
      )
      })}
    </div>
  );
};
