import { useContext, useEffect, useState } from "react";
import { Button, Notification, Table } from "@douyinfe/semi-ui";
import { IconDelete } from "@douyinfe/semi-icons";

import { NamespaceContext } from "./context";
import { listPods, deletePod } from './kube-api'


export default function Pod() {
    const [resources, setResources] = useState([] as any[]);
    const namespace = useContext(NamespaceContext);

    const syncResources = async (namespace: string) => {
        const response = await listPods(namespace);
        setResources(response.data.items);   
    }

    useEffect(() => {
        syncResources(namespace);  
    }, [namespace])

    const handleDelete = (namespace: string, name: string) => {
        (async () => {
            const response = await deletePod(namespace, name);
            Notification.open({
                type: response.status < 400 ? 'info' : 'error',
                title: `删除${response.status < 400 ? '成功' : '失败'}`,
                content: name,
                duration: 1,
                onClose: () => syncResources(namespace)
            });                           
        })()
    }

    const columns = [
        {title: '名字空间', dataIndex: "metadata.namespace"},
        {title: '名称',dataIndex: "metadata.name"},
        {
            title: '镜像',
            render: (text: any, record: any, index: number) => {
                const containers: any[] = record.spec.containers;
                return (
                    <ul>
                        {containers.map(item => (<li>{item.image}</li>))}
                    </ul>
                )
            }
        },
        {title: '节点', dataIndex: "spec.nodeName"},
        {title: '创建时间', dataIndex: "metadata.creationTimestamp"},
        {title: '状态', dataIndex: "status.phase"},
        {
            title: '操作',
            render: (text: any, record: any, index: number) => {
                const { namespace, name } = record.metadata;
                return (
                    <span>
                        <Button type={'danger'} icon={<IconDelete />} onClick={() => { handleDelete(namespace, name) }} />
                    </span>
                );
            }   
        }
    ];

    return (
        <Table pagination={false} columns={columns} dataSource={resources}/>
    )
}