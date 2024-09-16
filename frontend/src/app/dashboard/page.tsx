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
  const [pathname    , setPathname]  = useState('/product/tidb-clusters-on-gcp');
  const [mounted     , setMounted]   = useState(false);
  const [pageRoute   , setPageRoute] = useState("/grade-selection");
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

    fetch("/tidbonak/api/v1/tidbclustercreate").then(response => console.log(response.status) || response).then(response => response.text()).then(body => console.log(`console output from function: ${body}`));
   }, [])

  const EikenQuesType = () => {
    if(pageRoute === "/grade-selection") {
      return <EikenGrade />
    }else if(pageRoute === "/example/eiken/audio-en-word-2-write") {
      return <EikenCategory />
    }else {
      return <EikenGrade />
    }
  }

  // const EikenQuesType = () => {console.log("Calling the Eiken Question Type")};
  const EikenGrade = () => (
    <Flex vertical gap="large" style={{ width: '100%' }}>
      <ConfigProvider button={{ className: styles.linearGradientButton }} >
          <Button size="large" icon={<AntDesignOutlined />} onClick={() => alert("Write English From Audio")} >一  級</Button>
          <Button size="large" onClick={() => alert(`Write English From JP`)} >準一級</Button>
          <Button size="large" onClick={() => alert(`Write English Sentence From Audio`)} >二  級</Button>
          <Button size="large" onClick={() => alert(`Write English Sentence from JP`)} >準二級</Button>
          <Button size="large" onClick={() => alert(`Write English Sentence from JP`)} >三  級</Button>
      </ConfigProvider>
    </Flex>)

  const EikenCategory = () => (
    <Flex vertical gap="large" style={{ width: '100%' }}>
      <ConfigProvider button={{ className: styles.linearGradientButton }} >
          <Button type="primary" size="large" icon={<AntDesignOutlined />} onClick={() => alert("Write English From Audio")} >Write English From Audio</Button>
          <Button size="large" onClick={() => alert(`Write English From JP`)} >Write English From JP</Button>
          <Button size="large" onClick={() => alert(`Write English Sentence From Audio`)} >Write English Sentence From Audio</Button>
          <Button size="large" nClick={() => alert(`Write English Sentence from JP`)} >Write English Sentence from JP</Button>
      </ConfigProvider>
    </Flex>
  )

  const switchPageContent = (args) => {
    console.log("Switching page between different panels");
    console.log(args);
    setPageRoute(args.pathname);
    setPathname(args.pathname);
  }

  return mounted && (
    <div id="test-pro-layout" style={{ height: '100vh' }} >
      <ProLayout
        title="Eiken"
        logo="/example/en-icon.jpg"
        fixSiderbar
        onPageChange={ switchPageContent }
        route={{
          path: '/',
          routes: [
            {
              name: 'Eiken',
              icon: <EikenIcon style={{ fontSize: '32px' }} />,
              path: '/eiken',
              routes: [
                {
                  path: '/example/eiken/audio-en-word-2-write',
                  name: 'Write English From Audio',
                  icon: <CrownOutlined />,
                },
                {
                  path: '/eiken/jp-word-2-english',
                  name: 'Write English From JP',
                  icon: <CrownOutlined />,
                },
                {
                  path: '/eiken/audio-en-sentence-2-write',
                  name: 'Write English Sentence From Audio',
                  icon: <CrownOutlined />,
                },
                {
                  path: '/eiken/jp-sentence-2-english',
                  name: 'Write English Sentence from JP',
                  icon: <CrownOutlined />,
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
          return (
            <p style={{ textAlign: 'center', color: 'rgba(0,0,0,0.6)', paddingBlockStart: 12 }} >
              TiDB Clusters
            </p>
          );
        }}
        onMenuHeaderClick={(e) => console.log(e)}
        menuItemRender={(item, dom) => (
          <a onClick={() => { setPathname(item.path || pathname ); }} > {dom} </a>
        )}
      >
        <PageContainer content={ <EikenQuesType /> } >
        </PageContainer>
      </ProLayout>
    </div>
  );
};
