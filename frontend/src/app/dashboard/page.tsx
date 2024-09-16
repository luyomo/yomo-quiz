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
import { Button, Form, message  } from 'antd';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useCookies             } from 'react-cookie';
import EikenIcon from '../../../icons/EikenIcon.tsx';

export default () => {
  const [pathname    , setPathname]  = useState('/product/tidb-clusters-on-gcp');
  const [mounted     , setMounted]   = useState(false);
  const [cloudType   , setCloudType] = useState("az");
  const [cookies     , setCookie]    = useCookies(['AUTH_ACCESS_TOKEN'])
  const [form] = Form.useForm<{ name: string; company: string }>();
  const [isWasmLoaded, setIsWasmLoaded] = useState(false);

  
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

    // The service worker only catches those requestes from allowed scope. It's not the destination. 
    fetch("/tidbonak/api/v1/tidbclustercreate").then(response => console.log(response.status) || response).then(response => response.text()).then(body => console.log(`console output from function: ${body}`));
   }, [])

  useLayoutEffect(() => {
    const queryParameters = new URLSearchParams(window.location.hash.substring(1) )
    const access_token    = queryParameters.get("access_token");
    const token_type      = queryParameters.get("token_type");
    const expires_in      = queryParameters.get("expires_in");
    const state           = queryParameters.get("state");


    sessionStorage.setItem('AUTH_ACCESS_TOKEN', access_token);
    console.log(`gcp access token: ${access_token},  token_type: ${token_type},  expires_in: ${expires_in}, state: ${state}`);
    console.log("Calling the region change or subscription change ");

    if ( access_token ) {
      setCookie('AUTH_ACCESS_TOKEN', access_token, { path: '/'});
      setCookie('TiDB_CLOUD_TYPE', state.split(':')[0], { path: '/'});
    }

    console.log("The TiDB cloud type: " + cookies.TiDB_CLOUD_TYPE);
    if (cookies.TiDB_CLOUD_TYPE === "az cloud") {
      // setLocation("/product/tidb-clusters-on-az");
      setPathname("/product/tidb-clusters-on-az");
      setCloudType("az");
    } else if (cookies.TiDB_CLOUD_TYPE === "gcp cloud") {
      console.log("Starting to render gcp template");
      // setLocation("/product/tidb-clusters-on-gcp");
      setPathname("/product/tidb-clusters-on-gcp");
      setCloudType("gcp");
    } else if (cookies.TiDB_CLOUD_TYPE === "aws cloud") {
      // setLocation("/product/tidb-clusters-on-aws");
      setPathname("/product/tidb-clusters-on-aws");
      setCloudType("aws");
    }
  }, [pathname]);

  // https://medium.com/@akshayshan28/building-web-apps-with-react-webassembly-and-go-1a3b2b138b63
  // https://permify.co/post/wasm-go/
//  useEffect(() => {
//    // Function to asynchronously load WebAssembly
//    async function loadWasm(): Promise<void> {
//      // Create a new Go object
//      const goWasm = new window.Go();  
//      const result = await WebAssembly.instantiateStreaming(
//        // Fetch and instantiate the main.wasm file
//        fetch('/tidbonaks/wasm/service.wasm'),  
//        // Provide the import object to Go for communication with JavaScript
//        goWasm.importObject  
//      );
//      // Run the Go program with the WebAssembly instance
//      goWasm.run(result.instance);  
//      setIsWasmLoaded(true); 
//    }
//
//    loadWasm(); 
//  }, []);

// //-  This is the source code to trigger golang function
//   const handleClickButton = async () => {
//     const n = 10;  // Choose a value for n
// 
//     console.log('Starting WebAssembly calculation...');
//     const wasmStartTime = performance.now();
// 
//     try {
//       // Call the wasmFibonacciSum function asynchronously
//       const result = await wasmFibonacciSum(n);  
//       console.log(`The wasm result: ${result}`);
//       console.log('WebAssembly Result:', result);
//     } catch (error) {
//       console.error('WebAssembly Error:', error);
//     }
// 
//     const wasmEndTime = performance.now();
//     console.log(`WebAssembly Calculation Time: ${wasmEndTime - wasmStartTime} ms`);
//   };

  const switchPageContent = (args) => {
    console.log("Switching page between different panels");
    console.log(args);
    // setLocation(args.theLocation);
    setPathname(args.pathname);
  }

  function MainPage(props) {
    const location = props.location;
    console.log("Calling in the MainPage");
    console.log(props);
    console.log(`The location: ${location}`);
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
              path: '/admin',
              name: 'Admin',
              icon: <CrownOutlined />,
              access: 'canAdmin',
              component: './Admin',
              routes: [
                {
                  path: '/admin/users',
                  name: 'User',
                  icon: <CrownOutlined />,
                  component: './Welcome01',
                },
              ],
            },
            {
              name: 'Eiken',
              icon: <EikenIcon style={{ fontSize: '32px' }} />,
              path: '/eiken',
              component: './ListTableList',
              routes: [
                {
                  path: '/eiken/audio-en-word-2-write',
                  name: 'Write English From Audio',
                  icon: <CrownOutlined />,
                  component: './Welcome02',
                },
                {
                  path: '/eiken/jp-word-2-english',
                  name: 'Write English From JP',
                  icon: <CrownOutlined />,
                  component: './Welcome03',
                },
                {
                  path: '/eiken/audio-en-sentence-2-write',
                  name: 'Write English Sentence From Audio',
                  icon: <CrownOutlined />,
                  component: './Welcome04',
                },
                {
                  path: '/eiken/jp-sentence-2-english',
                  name: 'Write English Sentence from JP',
                  icon: <CrownOutlined />,
                  component: './Welcome05',
                },
                {
                  path: '/eiken',
                  name: 'Eiken',
                  icon: <CrownOutlined />,
                  children: [
                    {
                      path: '/eiken/audio-en-word-2-write',
                      name: 'Write English From Audio',
                      icon: <CrownOutlined />,
                      component: './Welcome02',
                    },
                    {
                      path: '/eiken/jp-word-2-english',
                      name: 'Write English From JP',
                      icon: <CrownOutlined />,
                      component: './Welcome03',
                    },
                    {
                      path: '/eiken/audio-en-sentence-2-write',
                      name: 'Write English Sentence From Audio',
                      icon: <CrownOutlined />,
                      component: './Welcome04',
                    },
                    {
                      path: '/eiken/jp-sentence-2-english',
                      name: 'Write English Sentence from JP',
                      icon: <CrownOutlined />,
                      component: './Welcome05',
                    },
                  ],
                },
              ],
            },
          ],
        }}
        location={{ pathname }}
        waterMarkProps={{ content: 'Cloud service' }}
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
        <PageContainer>
          <ProCard style={{ height: '10vh', minHeight: 10 }} >
            <Button onClick={() => setPathname(`/product/${cloudType}/new`)} >New Cluster</Button>
          </ProCard>
          <ProCard style={{ height: '120vh', minHeight: 600 }} >
            <MainPage location={pathname} />
          </ProCard>
        </PageContainer>
      </ProLayout>
    </div>
  );
};
