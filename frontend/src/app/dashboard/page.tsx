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
  const [pathname    , setPathname]  = useState('/init-component');
  const [mounted     , setMounted]   = useState(false);
  const [cookies     , setCookie]    = useCookies(['AUTH_ACCESS_TOKEN'])
  const [form] = Form.useForm<{ name: string; company: string }>();
  const { styles } = useStyle();
  const [skipCheckAnswer, setSkipCheckAnswer] = useState(false);

  const [cities, setCities] = useState(cityData[provinceData[0] as CityName]);
  const [secondCity, setSecondCity] = useState(cityData[provinceData[0]][0] as CityName);

  const handleProvinceChange = (value: CityName) => {
    setCities(cityData[value]);
    setSecondCity(cityData[value][0] as CityName);
  };

  const { Countdown } = Statistic;
  const onSecondCityChange = (value: CityName) => {
    setSecondCity(value);
  };

  const onFinish: CountdownProps['onFinish'] = () => {
    console.log('finished!');
  };

  const onChange: CountdownProps['onChange'] = (val) => {
    if (typeof val === 'number' && 4.95 * 1000 < val && val < 5 * 1000) {
      console.log('changed!');
    }
  };

  useEffect(() => { 
    setMounted(true);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration("/tidbonaks/").then((registration) => {
        if (registration) {
          // This property returns null if the request is a force refresh.
          // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/controller
          console.log("Registration ----------- ");
          console.log(registration);
          navigator.serviceWorker.ready.then(() => {
              console.log('----- ready!');
          });
          console.log(navigator.serviceWorker.controller);
          if (registration.active && !navigator.serviceWorker.controller) { window.location.reload(); }
        }else {
          navigator.serviceWorker.register('/tidbonaks/service.js', {scope: "/tidbonaks/"}).then(function(registration) {

            // This property returns null if the request is a force refresh.
            // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/controller
            if (registration.active && !navigator.serviceWorker.controller) { window.location.reload() }
          }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
          });
        };
      });
    } else {
      console.log("The service worker is not defined in the navigator");
    }

//    fetch("/tidbonak/api/v1/tidbclustercreate").then(response => console.log(response.status) || response).then(response => response.text()).then(body => console.log(`console output from function: ${body}`));
   }, [])

  const EikenQuesType = () => {
    switch (pathname) {
      case "/init-component":                               return <TopLevel            />
      case "/eiken/index":                                  return <EikenGrade          />
      case "/eiken/ques-type":                              return <EikenCategory       />
      case "/eiken/ques-type/audio2engWord":                return <EikenAudio2Word     />
      case "/eiken/ques-type/jp2engWord":                   return <EikenJP2Word        />
      case "/eiken/ques-type/audio2engSentence":            return <EikenAudio2Sentence />
      case "/eiken/ques-type/jp2engSentence":               return <EikenJP2Sentence    />
      default:                                              return <TopLevel            />
    }
  }

  const TopLevel = () => (
    <Flex vertical gap="large" style={{ width: '100%' }}>
      <ConfigProvider button={{ className: styles.linearGradientButton }} >
          <Button size="large" icon={<AntDesignOutlined />} onClick={() => setPathname("/eiken/index") } >英検単語</Button>
          <Button size="large" onClick={() => alert(`Write English From JP`)} >JPREP</Button>
      </ConfigProvider>
    </Flex>)

  const EikenGrade = () => (
    <Flex vertical gap="large" style={{ width: '100%' }}>
      <ConfigProvider button={{ className: styles.linearGradientButton }} >
          <Button size="large" icon={<AntDesignOutlined />} onClick={() => setPathname("/eiken/ques-type")} >一  級</Button>
          <Button size="large" onClick={() => setPathname("/eiken/ques-type") } >準一級</Button>
          <Button size="large" onClick={() => setPathname("/eiken/ques-type") } >二  級</Button>
          <Button size="large" onClick={() => setPathname("/eiken/ques-type") } >準二級</Button>
          <Button size="large" onClick={() => setPathname("/eiken/ques-type") } >三  級</Button>
      </ConfigProvider>
    </Flex>)

  const EikenCategory = () => (
    <Flex vertical gap="large" style={{ width: '100%' }}>
      <ConfigProvider button={{ className: styles.linearGradientButton }} >
          <Button type="primary" size="large" icon={<AntDesignOutlined />} onClick={() => setPathname("/eiken/ques-type/audio2engWord")} >Write English From Audio</Button>
          <Button size="large" onClick={() => setPathname("/eiken/ques-type/jp2engWord")}        >Write English From JP</Button>
          <Button size="large" onClick={() => setPathname("/eiken/ques-type/audio2engSentence")} >Write English Sentence From Audio</Button>
          <Button size="large" onClick={() => setPathname("/eiken/ques-type/jp2engSentence")}    >Write English Sentence from JP</Button>
      </ConfigProvider>
    </Flex>
  )

  const correctnessLabel = `${skipCheckAnswer? 'Count correctness' : 'Skip Correctness'}`;
  const onSkipCheckAnswer: CheckboxProps['onChange'] = (e) => {
     setSkipCheckAnswer(e.target.checked);
  }; ;

  const SkipAnswerProgress = () => {
    if (!skipCheckAnswer) {
      return (<Progress type="circle" percent={100*10/18} format={(percent) => '成功率10/18'} />)
    } 
  }


  // phase 01: Check whether it's the first time to access the data. If yes, start it to go through all the words to filter out the unremembered words.
  // 01.01 send request to service worker. 
  // phase 02:
  const EikenAudio2Word     = () => (
    <Card hoverable style={cardStyle} styles={{ body: { padding: 20, overflow: 'hidden' } }}>
    <Flex vertical='vertical' justify='space-evenly' gap={ 50 } >
      <Flex justify='space-evenly' align='center'>
        <Flex vertical='vertical' justify='space-evenly'>
        <Typography.Title level={5}>Group</Typography.Title>
        <Select
          defaultValue={provinceData[0]}
          style={{ width: 120 }}
          onChange={handleProvinceChange}
          options={provinceData.map((province) => ({ label: province, value: province }))}
        />
        </Flex>
        <Flex vertical='vertical' justify='space-evenly'>
        <Typography.Title level={5}>Section</Typography.Title>
        <Select
          style={{ width: 120 }}
          value={secondCity}
          onChange={onSecondCityChange}
          options={cities.map((city) => ({ label: city, value: city }))}
        />
        </Flex>
        <Flex vertical='vertical' justify='space-evenly'>
          <Button type="primary">Start Test</Button>
          <Checkbox checked={skipCheckAnswer} onChange={ onSkipCheckAnswer}>{correctnessLabel}</Checkbox>
        </Flex>
      </Flex>
      <Flex justify='space-evenly' align='center'>
        <Progress type="circle" percent={100*18/20} format={percent => `完成率18/20` } />
        <SkipAnswerProgress />
      </Flex>
      <Flex justify='space-evenly' align='center'>
        <Input placeholder="Please input the words" />
      </Flex>
      <Flex  justify='flex-end'>
        <Countdown title="Seconds" value={Date.now() + 60 * 1000} format="HH:mm:ss" />
      </Flex>
    </Flex>
    </Card>
  );
  const EikenJP2Word        = () => ("Todo: Write English Words from JP");
  const EikenAudio2Sentence = () => ("Todo: Write English Sentence from Audio");
  const EikenJP2Sentence    = () => ("Todo: Write English Sentence from JP");

  return mounted && (
    <div id="test-pro-layout" style={{ height: '100vh' }} >
      <ProLayout
        title="Eiken"
        logo="/example/en-icon.jpg"
        fixSiderbar
        route={{
          path: '/',
          routes: [
            {
              name: 'Eiken',
              icon: <EikenIcon style={{ fontSize: '32px' }} />,
              path: '/eiken/index',
              routes: [
                { path: '/eiken/ques-type01' , name: '一   級'     , icon: <CrownOutlined />,
                  routes: [
                    { path: '/eiken/ques-type/audio2engWord'     , name: 'Write English From Audio'          , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type/jp2engWord'        , name: 'Write English From JP'             , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type/audio2engSentence' , name: 'Write English Sentence From Audio' , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type/jp2engSentence'    , name: 'Write English Sentence from JP'    , icon: <CrownOutlined /> },
                  ],
                },
                { path: '/eiken/ques-type02' , name: '準一級'      , icon: <CrownOutlined />,
                  routes: [
                    { path: '/eiken/ques-type/audio2engWord'     , name: 'Write English From Audio'          , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type/jp2engWord'        , name: 'Write English From JP'             , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type/audio2engSentence' , name: 'Write English Sentence From Audio' , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type/jp2engSentence'    , name: 'Write English Sentence from JP'    , icon: <CrownOutlined /> },
                  ],
                },
                { path: '/eiken/ques-type03' , name: '二   級'      , icon: <CrownOutlined />,
                  routes: [
                    { path: '/eiken/ques-type/audio2engWord'     , name: 'Write English From Audio'          , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type/jp2engWord'        , name: 'Write English From JP'             , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type/audio2engSentence' , name: 'Write English Sentence From Audio' , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type/jp2engSentence'    , name: 'Write English Sentence from JP'    , icon: <CrownOutlined /> },
                  ],
                },
                { path: '/eiken/ques-type04' , name: '準二級'      , icon: <CrownOutlined />,
                  routes: [
                    { path: '/eiken/ques-type/audio2engWord'     , name: 'Write English From Audio'          , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type/jp2engWord'        , name: 'Write English From JP'             , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type/audio2engSentence' , name: 'Write English Sentence From Audio' , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type/jp2engSentence'    , name: 'Write English Sentence from JP'    , icon: <CrownOutlined /> },
                  ],
                },
                { path: '/eiken/ques-type05' , name: '三   級'      , icon: <CrownOutlined />,
                  routes: [
                    { path: '/eiken/ques-type/audio2engWord'     , name: 'Write English From Audio'          , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type/jp2engWord'        , name: 'Write English From JP'             , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type/audio2engSentence' , name: 'Write English Sentence From Audio' , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type/jp2engSentence'    , name: 'Write English Sentence from JP'    , icon: <CrownOutlined /> },
                  ],
                },
              ],
            },
          ],
        }}
        location={{ pathname }}
        waterMarkProps={{ content: 'English Corner' }}
        avatarProps={{ icon: <UserOutlined />, size: 'small', title: '七妮妮' }}
        actionsRender={() => [
          <InfoCircleOutlined key="InfoCircleOutlined" />,
          <QuestionCircleOutlined key="QuestionCircleOutlined" />,
          <MergeCellsOutlined key="MergeCellsOutlined" />,
        ]}
        menuFooterRender={(props) => {
          if (props?.collapsed) return undefined;
          return (<p style={{ textAlign: 'center', color: 'rgba(0,0,0,0.6)', paddingBlockStart: 12 }} >English Corner</p>);
        }}
        onMenuHeaderClick={(e) => { console.log(e); setPathname("/init-component");} }
        menuItemRender={(item, dom) => ( <a onClick={() => { setPathname(item.path || pathname ); }} > {dom} </a>)}
      >
        <PageContainer content={ <EikenQuesType /> } >
        </PageContainer>
      </ProLayout>
    </div>
  );
};
