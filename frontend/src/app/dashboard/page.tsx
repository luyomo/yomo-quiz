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
import React from 'react';

import EikenAudio2Word       from './EikenGroupSection.tsx';
import SciencePictorialPlant from './SciencePictorialPlant.tsx';
import SciencePictorialRead  from './SciencePictorialRead.tsx';
import HistoryChoice         from './HistoryChoice.tsx';

const EikenJP2Word        = () => ("Todo: Write English Words from JP");
const EikenAudio2Sentence = () => ("Todo: Write English Sentence from Audio");
const EikenJP2Sentence    = () => ("Todo: Write English Sentence from JP");

const MapComponent = {
  "EikenAudio2Word"       : EikenAudio2Word,
  "SciencePictorialPlant" : SciencePictorialPlant,
  "SciencePictorialRead"  : SciencePictorialRead,
  "HistoryChoice"         : HistoryChoice,
  "EikenJP2Word"          : EikenJP2Word,
  "EikenAudio2Sentence"   : EikenAudio2Sentence,
  "EikenJP2Sentence"      : EikenJP2Sentence
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
  const [form] = Form.useForm<{ name: string; company: string }>();
  const { styles } = useStyle();
  const [level, setLevel] = useState("level 3");
  const [dataType, setDataType] = useState("audio2engWord");
  const [cookies,   setCookie]    = useCookies([]);
  const [menuData,  setMenuData]  = useState([]);
  const [component, setComponent] = useState(<div />);


  useEffect(() => { 
    fetch('/example-backend/api/v1/menu')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setMenuData({path: '/', routes: data } || []);
      });
//    setMenuData({
//          path: '/', 
//          routes: [
//            {
//              name: '英検', path: '/eiken',
//              routes: [
//                { path: '/eiken/ques-type1-2' , name: '一   級'     , icon: <CrownOutlined />,
//                  routes: [
//                    { path: '/eiken/ques-type1-2/audio2engWord'     , name: 'Write English From Audio'          , component: <EikenAudio2Word     level="level 1-2" /> },
//                    { path: '/eiken/ques-type1-2/jp2engWord'        , name: 'Write English From JP'             , component: <EikenJP2Word        level="level 1-2" /> },
//                    { path: '/eiken/ques-type1-2/audio2engSentence' , name: 'Write English Sentence From Audio' , component: <EikenAudio2Sentence level="level 1-2" /> },
//                    { path: '/eiken/ques-type1-2/jp2engSentence'    , name: 'Write English Sentence from JP'    , component: <EikenJP2Sentence    level="level 1-2" /> },
//                  ],
//                },
//                { path: '/eiken/ques-type1-1' , name: '準一級'      , icon: <CrownOutlined />,
//                  routes: [
//                    { path: '/eiken/ques-type1-1/audio2engWord'     , name: 'Write English From Audio'          , component: <EikenAudio2Word     level="level 1-1" /> },
//                    { path: '/eiken/ques-type1-1/jp2engWord'        , name: 'Write English From JP'             , component: <EikenJP2Word        level="level 1-1" /> },
//                    { path: '/eiken/ques-type1-1/audio2engSentence' , name: 'Write English Sentence From Audio' , component: <EikenAudio2Sentence level="level 1-1" /> },
//                    { path: '/eiken/ques-type1-1/jp2engSentence'    , name: 'Write English Sentence from JP'    , component: <EikenJP2Sentence    level="level 1-1" /> },
//                  ],
//                },
//                { path: '/eiken/ques-type2-2' , name: '二   級'     , icon: <CrownOutlined />,
//                  routes: [
//                    { path: '/eiken/ques-type2-2/audio2engWord'     , name: 'Write English From Audio'          , component: <EikenAudio2Word     level="level 2-2" /> },
//                    { path: '/eiken/ques-type2-2/jp2engWord'        , name: 'Write English From JP'             , component: <EikenJP2Word        level="level 2-2" /> },
//                    { path: '/eiken/ques-type2-2/audio2engSentence' , name: 'Write English Sentence From Audio' , component: <EikenAudio2Sentence level="level 2-2" /> },
//                    { path: '/eiken/ques-type2-2/jp2engSentence'    , name: 'Write English Sentence from JP'    , component: <EikenJP2Sentence    level="level 2-2" /> },
//                  ],
//                },
//                { path: '/eiken/ques-type2-1' , name: '準二級'      , icon: <CrownOutlined />,
//                  routes: [
//                    { path: '/eiken/ques-type2-1/audio2engWord'     , name: 'Write English From Audio'          , component: <EikenAudio2Word     level="level 2-1" /> },
//                    { path: '/eiken/ques-type2-1/jp2engWord'        , name: 'Write English From JP'             , component: <EikenJP2Word        level="level 2-1" /> },
//                    { path: '/eiken/ques-type2-1/audio2engSentence' , name: 'Write English Sentence From Audio' , component: <EikenAudio2Sentence level="level 2-1" /> },
//                    { path: '/eiken/ques-type2-1/jp2engSentence'    , name: 'Write English Sentence from JP'    , component: <EikenJP2Sentence    level="level 2-1" /> },
//                  ],
//                },
//                { path: '/eiken/ques-type3' , name: '三   級'       , icon: <CrownOutlined />,
//                  routes: [
//                    { path: '/eiken/ques-type3/audio2engWord'       , name: 'Write English From Audio'          , component: <EikenAudio2Word     level="level 3" /> },
//                    { path: '/eiken/ques-type3/jp2engWord'          , name: 'Write English From JP'             , component: <EikenJP2Word        level="level 3" /> },
//                    { path: '/eiken/ques-type3/audio2engSentence'   , name: 'Write English Sentence From Audio' , component: <EikenAudio2Sentence level="level 3" /> },
//                    { path: '/eiken/ques-type3/jp2engSentence'      , name: 'Write English Sentence from JP'    , component: <EikenJP2Sentence    level="level 3" /> },
//                  ],
//                },
//              ],
//            },
//
//            {
//              name: '理      科', path: '/science/index',
//              routes: [
//                { path: '/science/pictorial/plant' , name: '図    鑑'     , icon: <CrownOutlined />,
//                  routes: [
//                    { path: '/science/pictorial/plant'     , name: '植物選択'  , component: <SciencePictorialPlant  /> },
//                    { path: '/science/pictorial/pic-read'  , name: '植物図読'  , component: <SciencePictorialRead   /> },
//                  ],
//                },
//              ],
//            },
//
//
//            {
//              name: '歴    史', path: '/history/index',
//              routes: [
//                { path: '/history/inter-02' , name: '中学校2年生'     , icon: <CrownOutlined />,
//                  routes: [
//                    { path: '/history/inter-02/choice'     , name: '選択問題'  , component: <HistoryChoice /> },
//                  ],
//                },
//              ],
//            },
//
//          ],
//        }
//      );

    setMounted(true);
   }, [])


  return mounted && (
    <div id="test-pro-layout" style={{ height: '100vh' }} >
      <ProLayout
        title="Eiken"
        logo="/example/en-icon.jpg"
        fixSiderbar
        route={ menuData }
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
          console.log("---------");
          console.log(item.component);
          let component = React.createElement(MapComponent[item.component], item.params);
//          let component = MapComponent[item.component];
//          const obj = Object.assign(item.params, component);

//          console.log(component);
          setComponent(component);

//          var rx = /\/eiken\/ques-type(.*)\/(.*)/g;
//          var arr = rx.exec(item.path);
//          console.log(arr);
//          if (arr.length === 3) {
//            setPathname(`/eiken/ques-type/${arr[2]}`);
//            setLevel(`level ${arr[1]}`);
//          }else {
//            setPathname(pathname);
//          }

          }} > {dom} </a>)}
      >
        <PageContainer content={ component } >
        </PageContainer>
      </ProLayout>
    </div>
  );
};
