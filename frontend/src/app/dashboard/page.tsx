"use client";

import type { ProColumns } from '@ant-design/pro-components';

import Icon, {
  CrownOutlined,
  InfoCircleOutlined,
  MergeCellsOutlined,
  QuestionCircleOutlined,
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
import { EikenIcon} from '../../../icons/Icons.tsx';
import { createStyles } from 'antd-style';
import EikenAudio2Word       from './EikenGroupSection.tsx';
import SciencePictorialPlant from './SciencePictorialPlant.tsx';
import SciencePictorialRead  from './SciencePictorialRead.tsx';
import HistoryChoice         from './HistoryChoice.tsx';


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
  const [form] = Form.useForm<{ name: string; company: string }>();
  const { styles } = useStyle();
  const [level, setLevel] = useState("level 3");
  const [dataType, setDataType] = useState("audio2engWord");
  const [cookies, setCookie] = useCookies([]);


  useEffect(() => { 
    setMounted(true);
   }, [])

  const EikenQuesType = () => {
    switch (pathname) {
      case "/init-component":                             return <TopLevel                      />
      case "/eiken/index":                                return <EikenGrade                    />
      case "/eiken/ques-type":                            return <EikenCategory                 />

      case "/eiken/ques-type/audio2engWord":              return <EikenAudio2Word level={level} />
      case "/eiken/ques-type/jp2engWord":                 return <EikenJP2Word                  />
      case "/eiken/ques-type/audio2engSentence":          return <EikenAudio2Sentence           />
      case "/eiken/ques-type/jp2engSentence":             return <EikenJP2Sentence              />

      // Science index
      case "/science/index":                              return <ScienceIndex                  />

      case "/science/pictorial":                          return <SciencePictorial              />

      case "/science/pictorial/plant":                    return <SciencePictorialPlant         />
      case "/science/pictorial/pic-read":                 return <SciencePictorialRead          />

      // History Index
      case "/history/index":                              return <HistoryIndex                  />

      case "/history/inter-02":                           return <HisortyInter2                 />

      case "/history/inter-02/choice":                    return <HistoryChoice                 />

      default:                                            return <TopLevel                      />
    }
  }

  const TopLevel = () => (
    <Flex vertical gap="large" style={{ width: '100%' }}>
      <ConfigProvider button={{ className: styles.linearGradientButton }} >
          <Button size="large" icon={<AntDesignOutlined />} onClick={() => setPathname("/eiken/index") } >英検単語</Button>
          <Button size="large" onClick={() => alert(`Write English From JP`)} >JPREP</Button>
          <Button size="large" onClick={() => setPathname("/science/index") }  >理      科</Button>
          <Button size="large" onClick={() => setPathname("/history/index") }  >歴      史</Button>
      </ConfigProvider>
    </Flex>)

  const EikenGrade = () => (
    <Flex vertical gap="large" style={{ width: '100%' }}>
      <ConfigProvider button={{ className: styles.linearGradientButton }} >
          <Button size="large" icon={<AntDesignOutlined />} onClick={() => { setLevel("level 1-2"); setPathname("/eiken/ques-type");} } >一  級</Button>
          <Button size="large"                              onClick={() => { setLevel("level 1-1"); setPathname("/eiken/ques-type");} } >準一級</Button>
          <Button size="large"                              onClick={() => { setLevel("level 2-2"); setPathname("/eiken/ques-type");} } >二  級</Button>
          <Button size="large"                              onClick={() => { setLevel("level 2-1"); setPathname("/eiken/ques-type");} } >準二級</Button>
          <Button size="large"                              onClick={() => { setLevel("level 3"  ); setPathname("/eiken/ques-type");} } >三  級</Button>
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

  const EikenJP2Word        = () => ("Todo: Write English Words from JP");
  const EikenAudio2Sentence = () => ("Todo: Write English Sentence from Audio");
  const EikenJP2Sentence    = () => ("Todo: Write English Sentence from JP");

  const ScienceIndex = () => (
    <Flex vertical gap="large" style={{ width: '100%' }}>
      <ConfigProvider button={{ className: styles.linearGradientButton }} >
          <Button size="large" icon={<AntDesignOutlined />} onClick={() => { setPathname("/science/pictorial");} } >図鑑</Button>
      </ConfigProvider>
    </Flex>)

  const SciencePictorial = () => (
    <Flex vertical gap="large" style={{ width: '100%' }}>
      <ConfigProvider button={{ className: styles.linearGradientButton }} >
          <Button size="large" icon={<AntDesignOutlined />} onClick={() => { setPathname("/science/pictorial/plant");} } >植物</Button>
          <Button size="large" icon={<AntDesignOutlined />} onClick={() => { setPathname("/science/pictorial/pic-read");} } >図鑑識別</Button>
      </ConfigProvider>
    </Flex>)

//  const SciencePictorialPlant = () => ("Todo: 図鑑 question here to do");

  // Hisotry
  const HistoryIndex = () => (
    <Flex vertical gap="large" style={{ width: '100%' }}>
      <ConfigProvider button={{ className: styles.linearGradientButton }} >
          <Button size="large" icon={<AntDesignOutlined />} onClick={() => { setPathname("/history/inter-02");} } >中学校2年生</Button>
      </ConfigProvider>
    </Flex>)

  const HisortyInter2 = () => (
    <Flex vertical gap="large" style={{ width: '100%' }}>
      <ConfigProvider button={{ className: styles.linearGradientButton }} >
          <Button size="large" icon={<AntDesignOutlined />} onClick={() => { setPathname("/history/inter-02/choice");} } >選択問題</Button>
      </ConfigProvider>
    </Flex>)

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
        avatarProps={{ src: cookies.user_icon, size: 'small', title: cookies.user_name }}
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
