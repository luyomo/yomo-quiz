"use client";

import type { ProColumns } from '@ant-design/pro-components';

import Icon, {
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
import { Button, ConfigProvider, Form, message, Flex } from 'antd';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useCookies             } from 'react-cookie';
import EikenIcon from '../../../icons/EikenIcon.tsx';
import { createStyles } from 'antd-style';

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

  const EikenAudio2Word     = () => ("Todo: Write English Words from Audio");
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
              path: '/eiken',
              routes: [
                { path: '/example/eiken/audio-en-word-2-write' , name: 'Write English From Audio'          , icon: <CrownOutlined /> },
                { path: '/eiken/jp-word-2-english'             , name: 'Write English From JP'             , icon: <CrownOutlined /> },
                { path: '/eiken/audio-en-sentence-2-write'     , name: 'Write English Sentence From Audio' , icon: <CrownOutlined /> },
                { path: '/eiken/jp-sentence-2-english'         , name: 'Write English Sentence from JP'    , icon: <CrownOutlined /> },
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
