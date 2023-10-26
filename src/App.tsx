import { ReactElement, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, InputGroup, Layout, Modal, Nav, Notification, Select } from "@douyinfe/semi-ui";
import { IconPlus  } from "@douyinfe/semi-icons";
import AceEditor from "react-ace";
import YAML from 'yaml';

import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

import * as KubeAPI from './kube-api';


const NavItems = [
    {
        itemKey: 'pod',
        text: '容器组',
    },
    {
        itemKey: 'deployment',
        text: '无状态',
    },
    {
        itemKey: 'statefulset',
        text: '有状态',
    },
    {
        itemKey: 'job',
        text: '任务',
    },
    {
        itemKey: 'cronjob',
        text: '定时任务',
    },
    {
        itemKey: 'daemonset',
        text: '守护进程集',
    },
]

export default function App() {
    const [namespaces, setNamespaces] = useState([] as any[]);
    const [visible, setVisible] = useState(false);
    const [kubeObject, setKubeObject] = useState({} as any);
    const [canSubmit, setCanSubmit] = useState(false);

    const navigate = useNavigate();
    const { pathname } = useLocation();
    
    const [searchParams, setSearchParams] = useSearchParams();
    if (searchParams.get('namespace') === null) {
        setSearchParams({ namespace: 'default' });
    }
    const namespace: string = searchParams.get('namespace') as string;

    useEffect(() => {
        (async () => {
            const response = await KubeAPI.listNamespaces();
            setNamespaces(response.data.items.map((item: any) => item.metadata.name));
        })()
    }, []);

    const createResourceModalProps = {
        title: '创建资源',
        visible: visible,
        onOk: () => {
            (async () => {
                const { group, version, kind } = KubeAPI.buildGVKForURL(kubeObject.apiVersion, kubeObject.kind);
                kubeObject.metadata.namespace = kubeObject.metadata.namespace || namespace;
                const response = await KubeAPI.createResource(
                    group, version, kind,
                    kubeObject.metadata.namespace, kubeObject
                );
                const success = (response !== null && response.status < 400);
                Notification.open({
                    type: success ? 'info' : 'error',
                    title: `创建${success ? '成功' : '失败'}`,
                    content: success ? kubeObject.metadata.name : '错误请求',
                    duration: 1,
                    onClose: () => window.location.reload(),
                }); 
            })();
            setVisible(false);
        },
        onCancel: () => setVisible(false),
        okButtonProps: { disabled: !canSubmit }
    }
    const yamlEditorOptions = {
        name: 'yaml-editor',
        mode: 'yaml',
        setOptions: { useWorker: false },
        onChange: (value: any) => {
            try {
                const object = YAML.parse(value, {});
                setKubeObject(object);
                setCanSubmit(true);
            } catch (e) {
                setCanSubmit(false);
            }
        }
    }
    
    const namespaceSelectorProps = {
        defaultValue: 'default',
        onChange: (value: any) => {
            navigate(`${pathname}?namespace=${value as string}`);
        }
    }

    const navFooter = (
        <InputGroup>
            <Select {...namespaceSelectorProps}>
                {namespaces.map((item) => (
                    <Select.Option key={item} value={item}>{item}</Select.Option>
                ))}
            </Select>
            <Button type={'primary'} icon={<IconPlus />} onClick={() => setVisible(true)} />
        </InputGroup>   
    );

    const verticalNavRenderWrapper = ({ itemElement, props }: { itemElement: ReactElement, props: any }) => {
        return (<Link to={`${props.itemKey}?namespace=${namespace}`}>{itemElement}</Link>);
    };

    return (
        <Layout>
            <Layout.Header>
                <Nav mode='horizontal' header={{text: '应用管理平台'}} footer={navFooter} />
            </Layout.Header>
            <Layout>
                <Layout.Sider>
                    <Nav items={NavItems} renderWrapper={verticalNavRenderWrapper} />
                </Layout.Sider>
                <Layout.Content>
                    <Modal {...createResourceModalProps}>
                        <AceEditor {...yamlEditorOptions} />
                    </Modal>
                    <Outlet />
                </Layout.Content>
            </Layout>
        </Layout>
    );
}
