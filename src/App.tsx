import { ReactElement, useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button, InputGroup, Layout, Nav, Select } from "@douyinfe/semi-ui";
import { IconPlus  } from "@douyinfe/semi-icons";

import { NamespaceContext } from './context';
import { listNamespaces } from './kube-api'

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
    // const [nodes, setNodes] = useState([] as any[]);
    const [namespace, setNamespace] = useState('default' as any);
    // const [pods, setPods] = useState([] as any[]);
    const [visible, setVisible] = useState(false);
    // const [podSpec, setPodSpec] = useState({
    //     name: '',
    //     image: '',
    //     node: ''
    // })

    // const onOk = () => {
    //     (async (namespace: string) => {
    //         const response = await createPod(namespace, {
    //             apiVersion: 'v1',
    //             kind: 'Pod',
    //             metadata: {
    //                 labels: {
    //                     app: podSpec.name
    //                 },
    //                 name: podSpec.name,
    //                 namespace: namespace
    //             },
    //             spec: {
    //                 containers: [
    //                     {
    //                         name: podSpec.name,
    //                         image: podSpec.image,
    //                     }
    //                 ],
    //                 nodeName: podSpec.node
    //             }
    //         });
    //         Notification.open({
    //             type: response.status < 400 ? 'info' : 'error',
    //             title: `创建${response.status < 400 ? '成功' : '失败'}`,
    //             content: podSpec.name,
    //             duration: 1,
    //             onClose: () => syncPods(namespace)
    //         });
    //         setVisible(false);
    //     })(namespace); 
    // }

    // const modal = (
    //     <Modal title="创建Pod" visible={visible} onOk={onOk} onCancel={() => setVisible(false)}>
    //         <h4>名称</h4>
    //         <Input placeholder={"example: nginx"} onChange={(value) => setPodSpec({ ...podSpec, name: value })} />
    //         <h4>镜像</h4>
    //         <Input placeholder={"example: nginx:stable"} onChange={(value) => setPodSpec({ ...podSpec, image: value })} />
    //         <h4>节点</h4>
    //         <Select defaultValue={nodes[0]} onChange={(value) => setPodSpec({ ...podSpec, node: value as string })}>
    //             {nodes.map((item) => (
    //                 <Select.Option key={item} value={item}>{item}</Select.Option>
    //             ))}
    //         </Select>
    //     </Modal>
    // )

    useEffect(() => {
        (async () => {
            const response = await listNamespaces();
            setNamespaces(response.data.items.map((item: any) => item.metadata.name));
        })()
    }, [])

    const navFooter = (
        <InputGroup>
            <Select defaultValue={'default'} onChange={(value) => { setNamespace(value) }}>
                {namespaces.map((item) => (
                    <Select.Option key={item} value={item}>{item}</Select.Option>
                ))}
            </Select>
            <Button type={'primary'} icon={<IconPlus />} onClick={() => setVisible(true)} />
        </InputGroup>   
    );

    const renderWrapper = ({ itemElement, props }: { itemElement: ReactElement, props: any }) => {
        return (<Link to={`${props.itemKey}`}>{itemElement}</Link>);
    };

    return (
        <Layout>
            <Layout.Header>
                <Nav mode={'horizontal'} header={{text: '应用管理平台'}} footer={navFooter} />
            </Layout.Header>
            <Layout>
                <Layout.Sider>
                    <Nav items={NavItems} renderWrapper={renderWrapper}/>
                </Layout.Sider>
                <Layout.Content>
                    <NamespaceContext.Provider value={namespace}>
                        <Outlet />
                    </NamespaceContext.Provider>
                </Layout.Content>
            </Layout>
        </Layout>
    );
}
