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
import GroupSectionComp from './EikenGroupSection.tsx';

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

export default () => {
  const [pathname    , setPathname]  = useState('/init-component');
  const [mounted     , setMounted]   = useState(false);
  const [cookies     , setCookie]    = useCookies(['AUTH_ACCESS_TOKEN'])
  const [form] = Form.useForm<{ name: string; company: string }>();
  const { styles } = useStyle();
  const [skipCheckAnswer, setSkipCheckAnswer] = useState(false);
  const [level, setLevel] = useState("level 3");
  const [dataType, setDataType] = useState("audio2engWord");

  const { Countdown } = Statistic;

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
      navigator.serviceWorker.getRegistration("/example/").then((registration) => {
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
          navigator.serviceWorker.register('/example/service.js', {scope: "/example/"}).then(function(registration) {

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

    fetch("/example-backend/api/v1/load-data", {method: "PUT"}).then(response => console.log(response.status) || response).then(response => response.text()).then(body => console.log(`console output from function: ${body}`));
   }, [])

  const EikenQuesType = () => {
    switch (pathname) {
      case "/init-component":                             return <TopLevel            />
      case "/eiken/index":                                return <EikenGrade          />
      case "/eiken/ques-type":                            return <EikenCategory       />

      case "/eiken/ques-type/audio2engWord":              return <EikenAudio2Word     />
      case "/eiken/ques-type/jp2engWord":                 return <EikenJP2Word        />
      case "/eiken/ques-type/audio2engSentence":          return <EikenAudio2Sentence />
      case "/eiken/ques-type/jp2engSentence":             return <EikenJP2Sentence    />
      default:                                            return <TopLevel            />
    }
  }

  const EikenLevelName = (theLevel) => {
    switch (theLevel) {
      case "level 1-2":   return "英検一級"
      case "level 1-1":   return "英検準一"
      case "level 2-2":   return "英検二級"
      case "level 2-1":   return "英検準二"
      case "level 3"  :   return "英検三級"
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
          <Button size="large" icon={<AntDesignOutlined />} onClick={() => {
            setLevel("level 1-2");
            setPathname("/eiken/ques-type");}
          } >一  級</Button>
          <Button size="large" onClick={() => {
            setLevel("level 1-1");
            setPathname("/eiken/ques-type");}
          } >準一級</Button>
          <Button size="large" onClick={() => {
            setLevel("level 2-2");
            setPathname("/eiken/ques-type"); }
          } >二  級</Button>
          <Button size="large" onClick={() => {
            setLevel("level 2-1");
            setPathname("/eiken/ques-type");}
          } >準二級</Button>
          <Button size="large" onClick={() => {
            setLevel("level 3");
            setPathname("/eiken/ques-type");} 
          } >三  級</Button>
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
  }; 

  const SkipAnswerProgress = () => {
    if (!skipCheckAnswer) {
      return (<Progress type="circle" percent={100*10/18} format={(percent) => '成功率10/18'} />)
    } 
  }


  // phase 01: Check whether it's the first time to access the data. If yes, start it to go through all the words to filter out the unremembered words.
  // 01.01 send request to service worker. 
  // phase 02:
  const EikenAudio2Word     = () => (
    <div>
    <Typography.Title level={5}>{ EikenLevelName(level) } - wrtie words from audio</Typography.Title>
    <Card hoverable style={cardStyle} styles={{ body: { padding: 20, overflow: 'hidden' } }}>
    <Flex vertical='vertical' justify='space-evenly' gap={ 50 } >
      <Flex justify='space-evenly' align='left'>
        <GroupSectionComp level={level} />
        <Flex vertical='vertical' justify='space-evenly' gap='large'>
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
    </div>
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
                { path: '/eiken/ques-type1-2' , name: '一   級'     , icon: <CrownOutlined />,
                  routes: [
                    { path: '/eiken/ques-type1-2/audio2engWord'     , name: 'Write English From Audio'          , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type1-2/jp2engWord'        , name: 'Write English From JP'             , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type1-2/audio2engSentence' , name: 'Write English Sentence From Audio' , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type1-2/jp2engSentence'    , name: 'Write English Sentence from JP'    , icon: <CrownOutlined /> },
                  ],
                },
                { path: '/eiken/ques-type1-1' , name: '準一級'      , icon: <CrownOutlined />,
                  routes: [
                    { path: '/eiken/ques-type1-1/audio2engWord'     , name: 'Write English From Audio'          , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type1-1/jp2engWord'        , name: 'Write English From JP'             , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type1-1/audio2engSentence' , name: 'Write English Sentence From Audio' , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type1-1/jp2engSentence'    , name: 'Write English Sentence from JP'    , icon: <CrownOutlined /> },
                  ],
                },
                { path: '/eiken/ques-type2-2' , name: '二   級'     , icon: <CrownOutlined />,
                  routes: [
                    { path: '/eiken/ques-type2-2/audio2engWord'     , name: 'Write English From Audio'          , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type2-2/jp2engWord'        , name: 'Write English From JP'             , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type2-2/audio2engSentence' , name: 'Write English Sentence From Audio' , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type2-2/jp2engSentence'    , name: 'Write English Sentence from JP'    , icon: <CrownOutlined /> },
                  ],
                },
                { path: '/eiken/ques-type2-1' , name: '準二級'      , icon: <CrownOutlined />,
                  routes: [
                    { path: '/eiken/ques-type2-1/audio2engWord'     , name: 'Write English From Audio'          , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type2-1/jp2engWord'        , name: 'Write English From JP'             , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type2-1/audio2engSentence' , name: 'Write English Sentence From Audio' , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type2-1/jp2engSentence'    , name: 'Write English Sentence from JP'    , icon: <CrownOutlined /> },
                  ],
                },
                { path: '/eiken/ques-type3' , name: '三   級'       , icon: <CrownOutlined />,
                  routes: [
                    { path: '/eiken/ques-type3/audio2engWord'       , name: 'Write English From Audio'          , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type3/jp2engWord'          , name: 'Write English From JP'             , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type3/audio2engSentence'   , name: 'Write English Sentence From Audio' , icon: <CrownOutlined /> },
                    { path: '/eiken/ques-type3/jp2engSentence'      , name: 'Write English Sentence from JP'    , icon: <CrownOutlined /> },
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
        menuItemRender={(item, dom) => ( <a onClick={() => {
          var rx = /\/eiken\/ques-type(.*)\/(.*)/g;
          var arr = rx.exec(item.path);
          console.log(arr);
          if (arr.length === 3) {
            setPathname(`/eiken/ques-type/${arr[2]}`);
            setLevel(`level ${arr[1]}`);
          }else {
            setPathname(pathname);
          }
          }} > {dom} </a>)}
      >
        <PageContainer content={ <EikenQuesType /> } >
        </PageContainer>
      </ProLayout>
    </div>
  );
};
