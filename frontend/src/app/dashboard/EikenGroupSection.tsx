"use client";

import type { ProColumns } from '@ant-design/pro-components';

import Icon, {
  DownOutlined,
  PlayCircleOutlined,
  CrownOutlined,
  InfoCircleOutlined,
  MergeCellsOutlined,
  QuestionCircleOutlined,
  TabletOutlined,
  UserOutlined,
  PlusOutlined,
  AntDesignOutlined,
} from '@ant-design/icons';

import { 
  PageContainer, 
  ProCard, 
  ProLayout,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormDigit,
  StepsForm, } from '@ant-design/pro-components';

import type { CountdownProps } from 'antd';

import { Button, Space, ConfigProvider, Form, Select, Input, 
         Progress, Card, Checkbox, Typography,
         message, Flex, Statistic } from 'antd';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useCookies             } from 'react-cookie';
import EikenIcon from '../../../icons/EikenIcon.tsx';
import { createStyles } from 'antd-style';

const cardStyle: React.CSSProperties = {
  width: 780,
  height: 640,
  margin: 20,
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


const cityData = {
  Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
};
type CityName = keyof typeof cityData;
const provinceData: CityName[] = ['Zhejiang', 'Jiangsu'];

export default () => {
  const [mounted     , setMounted]   = useState(false);
  const [skipCheckAnswer, setSkipCheckAnswer] = useState(false);

  const [group   , setGroup   ] = useState("");
  const [groups  , setGroups  ] = useState([]);
  const [section , setSection ] = useState("");
  const [sections, setSections] = useState([]);

  const handleGroupChange = (value) => {
    setGroup(value);

    fetch(`/example-backend/api/v1/eiken/sections?level=2-1&group=${value}`)
      .then(response => console.log(response.status) || response)
      .then(response => response.text())
      .then(body => {
        let jsonData = JSON.parse(body);
        setSections(jsonData); });
  };

  const correctnessLabel = `${skipCheckAnswer? 'Count correctness' : 'Skip Correctness'}`;
  const onSkipCheckAnswer: CheckboxProps['onChange'] = (e) => {
     setSkipCheckAnswer(e.target.checked);
  }; 

  const SkipAnswerProgress = () => {
    if (!skipCheckAnswer) {
      return (<Progress type="circle" percent={100*10/18} format={(percent) => '成功率10/18'} />)
    } 
  }
  const { Countdown } = Statistic;
  const onSectionChange = (value: CityName) => {
    setSection(value);
  };

  useEffect(() => { 
    setMounted(true);

    fetch("/example-backend/api/v1/eiken/groups?level=2-1")
      .then(response => console.log(response.status) || response)
      .then(response => response.text())
      .then(body => {
        let jsonData = JSON.parse(body);
        setGroups(jsonData); });
   }, [])

  return mounted && (
    <Flex justify='space-evenly' align='center'>
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
      <Flex vertical='vertical' justify='space-evenly'>
        <Button type="primary">Start Test</Button>
        <Checkbox checked={skipCheckAnswer} onChange={ onSkipCheckAnswer}>{correctnessLabel}</Checkbox>
      </Flex>
    </Flex>
  );
};
