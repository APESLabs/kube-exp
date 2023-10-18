import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Input, InputGroup, Layout, Modal, Nav, Notification, Select, Table } from "@douyinfe/semi-ui";
import { IconDelete, IconPlus } from "@douyinfe/semi-icons";

import { listNodes, listNamespaces, listPods, createPod } from './kube-api'


export default function App() {
    const [namespaces, setNamespaces] = useState([] as any[]);
    const [nodes, setNodes] = useState([] as any[]);
    const [namespace, setNamespace] = useState('default' as any);
    const [pods, setPods] = useState([] as any[]);
    const [visible, setVisible] = useState(false);
    const [podSpec, setPodSpec] = useState({
        name: '',
        image: '',
        node: ''
    })

    const onOk = () => {
        (async (namespace: string) => {
            const response = await createPod(namespace, {
                apiVersion: 'v1',
                kind: 'Pod',
                metadata: {
                    labels: {
                        app: podSpec.name
                    },
                    name: podSpec.name,
                    namespace: namespace
                },
                spec: {
                    containers: [
                        {
                            name: podSpec.name,
                            image: podSpec.image,
                        }
                    ],
                    nodeName: podSpec.node
                }
            });
            Notification.open({
                type: response.status < 400 ? 'info' : 'error',
                title: `创建${response.status < 400 ? '成功' : '失败'}`,
                content: podSpec.name,
                duration: 1,
                onClose: () => syncPods(namespace)
            });
            setVisible(false);
        })(namespace); 
    }

    const modal = (
        <Modal title="创建Pod" visible={visible} onOk={onOk} onCancel={() => setVisible(false)}>
            <h4>名称</h4>
            <Input placeholder={"example: nginx"} onChange={(value) => setPodSpec({ ...podSpec, name: value })} />
            <h4>镜像</h4>
            <Input placeholder={"example: nginx:stable"} onChange={(value) => setPodSpec({ ...podSpec, image: value })} />
            <h4>节点</h4>
            <Select defaultValue={nodes[0]} onChange={(value) => setPodSpec({ ...podSpec, node: value as string })}>
                {nodes.map((item) => (
                    <Select.Option key={item} value={item}>{item}</Select.Option>
                ))}
            </Select>
        </Modal>
    )

    const syncNodes = async () => {
        const response = await listNodes();
        setNodes(response.data.items.map((item: any) => item.metadata.name));   
    }

    const syncNamespaces = async () => {
        const response = await listNamespaces();
        setNamespaces(response.data.items.map((item: any) => item.metadata.name));
    }

    const syncPods = async (namespace: string) => {
        const response = await listPods(namespace);
        setPods(response.data.items);   
    }

    useEffect(() => {
        syncNodes(); 
        syncNamespaces();    
    }, []);

    useEffect(() => {
        syncPods(namespace);
    }, [namespace]) 

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

    const columns = [
        {
            title: '名字空间',
            dataIndex: "metadata.namespace"
        },
        {
            title: '名称',
            dataIndex: "metadata.name"
        },
        {
            title: '节点',
            dataIndex: "spec.nodeName"
        },
        {
            title: '创建时间',
            dataIndex: "metadata.creationTimestamp"
        },
        {
            title: '状态',
            dataIndex: "status.phase"
        },
        {
            title: '操作',
            render: (text: any, record: any, index: number) => {
                return (
                    <span>
                        <Button type={'danger'} icon={<IconDelete />} onClick={() => {
                            (async ({ metadata }) => {
                                const { namespace, name } = metadata;
                                const response = await axios.delete(`/api/v1/namespaces/${namespace}/pods?fieldSelector=metadata.name=${name}`, {
                                    headers: { 'Authorization': `Bearer ${process.env.REACT_APP_TOKEN}` }
                                });
                                Notification.open({
                                    type: response.status < 400 ? 'info' : 'error',
                                    title: `删除${response.status < 400 ? '成功' : '失败'}`,
                                    content: name,
                                    duration: 1,
                                    onClose: () => syncPods(namespace)
                                });                           
                            })(record)
                        }} />
                    </span>
                );
            }   
        }
    ];

    return (
        <Layout>
            <Layout.Header>
                <Nav mode={'horizontal'} header={{text: 'Kubernetes'}} footer={navFooter} />
            </Layout.Header>
            <Layout>
                <Layout.Content>
                    <Table pagination={false} columns={columns} dataSource={pods}/>
                    {modal}
                </Layout.Content>
            </Layout>
        </Layout>
    );
}
